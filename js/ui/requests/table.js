import {
    getRequestById,
    getRequests,
    updateRequestStatus,
    markRequestAsDelivered
} from "../../requests/requests.js";

import {
    openRequestDetails
} from "./request-details.js";

import {
    getMaterialById
} from "../../inventory/materials.js";

import {
    registerMovement
} from "../../inventory/movements.js";

import {
    REQUEST_STATUS,
    MOVEMENT_TYPES
} from "../../constants/domain.js";

import {
    APP_EVENTS
} from "../../constants/events.js";

import {
    getRequestStatusLabel
} from "../../utils/formatters.js";

import {
    showToast
} from "../feedback.js";

import {
    confirmAction
} from "../confirm.js";

const tableBody =
    document.querySelector(
        "#requests-table-body"
    );

const priorityFilter =
    document.querySelector(
        "#priority-filter"
    );

const statusFilter =
    document.querySelector(
        "#request-status-filter"
    );

function notifyDataChanged() {
    document.dispatchEvent(
        new CustomEvent(
            APP_EVENTS.DATA_CHANGED
        )
    );
}

function renderIcons() {
    if (window.lucide) {
        window.lucide.createIcons();
    }
}

function getFilteredRequests() {
    const priority =
        priorityFilter.value;

    const status =
        statusFilter.value;

    return getRequests()
        .filter((request) => {
            const matchesPriority =
                !priority ||
                request.priority === priority;

            const matchesStatus =
                !status ||
                request.status === status;

            return (
                matchesPriority &&
                matchesStatus
            );
        })
        .sort(
            (a, b) =>
                new Date(b.requestDate) -
                new Date(a.requestDate)
        );
}

function createStatusOption(
    request,
    status
) {
    const selected =
        request.status === status
            ? "selected"
            : "";

    return `
        <option
            value="${status}"
            ${selected}
        >
            ${getRequestStatusLabel(status)}
        </option>
    `;
}

function createDetailsButton(request) {
    return `
        <button
            type="button"
            class="icon-button"
            data-action="details"
            data-id="${request.id}"
            aria-label="Ver detalhes da solicitação de ${request.employee}"
            title="Ver detalhes"
        >
            <i
                data-lucide="ellipsis"
                aria-hidden="true"
            ></i>
        </button>
    `;
}

function createRequestActions(request) {
    const detailsButton =
        createDetailsButton(request);

    if (
        request.status === REQUEST_STATUS.DELIVERED ||
        request.status === REQUEST_STATUS.CANCELLED
    ) {
        return detailsButton;
    }

    const deliverButton =
        request.status ===
            REQUEST_STATUS.APPROVED
            ? `
                <button
                    type="button"
                    class="button-deliver"
                    data-action="deliver"
                    data-id="${request.id}"
                >
                    Entregar
                </button>
            `
            : "";

    return `
        ${detailsButton}

        <select
            data-action="status"
            data-id="${request.id}"
            aria-label="Alterar status da solicitação"
        >
            ${createStatusOption(
        request,
        REQUEST_STATUS.PENDING
    )}

            ${createStatusOption(
        request,
        REQUEST_STATUS.APPROVED
    )}

            ${createStatusOption(
        request,
        REQUEST_STATUS.CANCELLED
    )}
        </select>

        ${deliverButton}
    `;
}

function createRequestRow(request) {
    const row =
        document.createElement("tr");

    row.innerHTML = `
        <td class="desktop-only">
            ${request.employee}
        </td>
    
        <td>${request.materialName}</td>
    
        <td class="desktop-only">
            ${request.quantity}
        </td>
    
        <td>
            <span
                class="badge badge-request-${request.status}"
            >
                ${getRequestStatusLabel(
        request.status
    )}
            </span>
        </td>
    
        <td class="table-actions">
            ${createRequestActions(request)}
        </td>
    `;

    return row;
}

export function renderRequests() {
    const requests =
        getFilteredRequests();

    tableBody.innerHTML = "";

    if (!requests.length) {
        tableBody.innerHTML = `
            <tr>
                <td colspan="5">
                    Nenhuma solicitação encontrada.
                </td>
            </tr>
        `;

        return;
    }

    requests.forEach((request) => {
        tableBody.appendChild(
            createRequestRow(request)
        );
    });

    renderIcons();
}

async function handleStatusChange(event) {
    const select =
        event.target.closest(
            'select[data-action="status"]'
        );

    if (!select) {
        return;
    }

    const requestId =
        select.dataset.id;

    const newStatus =
        select.value;

    const request =
        getRequestById(requestId);

    if (!request) {
        showToast(
            "Solicitação não encontrada.",
            "error"
        );

        renderRequests();
        return;
    }

    if (
        newStatus === REQUEST_STATUS.CANCELLED
    ) {
        const confirmed =
            await confirmAction({
                title: "Cancelar solicitação",
                message:
                    "Esta ação cancelará a solicitação e não poderá ser desfeita.",
                confirmText:
                    "Cancelar solicitação",
                variant: "danger",
                details: [
                    {
                        label: "Colaborador",
                        value: request.employee
                    },
                    {
                        label: "Material",
                        value: request.materialName
                    },
                    {
                        label: "Quantidade",
                        value: String(
                            request.quantity
                        )
                    }
                ]
            });

        if (!confirmed) {
            renderRequests();
            return;
        }
    }

    try {
        updateRequestStatus(
            requestId,
            newStatus
        );

        notifyDataChanged();

        showToast(
            newStatus === REQUEST_STATUS.CANCELLED
                ? "Solicitação cancelada."
                : "Status da solicitação atualizado."
        );
    } catch (error) {
        showToast(
            error.message,
            "error"
        );

        renderRequests();
    }
}

function handleRequestDetails(event) {
    const button =
        event.target.closest(
            'button[data-action="details"]'
        );

    if (!button) {
        return;
    }

    openRequestDetails(
        button.dataset.id
    );
}

async function handleDelivery(event) {
    const button =
        event.target.closest(
            'button[data-action="deliver"]'
        );

    if (!button) {
        return;
    }

    const request =
        getRequestById(
            button.dataset.id
        );

    if (!request) {
        showToast(
            "Solicitação não encontrada.",
            "error"
        );

        return;
    }

    const material =
        getMaterialById(
            request.materialId
        );

    if (!material) {
        showToast(
            "O material desta solicitação não está mais cadastrado.",
            "error"
        );

        return;
    }

    if (
        request.quantity >
        material.quantity
    ) {
        showToast(
            `Estoque insuficiente. Disponível: ${material.quantity} ${material.unit}.`,
            "warning"
        );

        return;
    }

    const confirmed =
        await confirmAction({
            title: "Confirmar entrega",
            message:
                "Confira os dados antes de registrar a entrega.",
            confirmText: "Entregar",
            variant: "primary",
            details: [
                {
                    label: "Material",
                    value: material.name
                },
                {
                    label: "Quantidade",
                    value:
                        `${request.quantity} ${material.unit}`
                },
                {
                    label: "Solicitante",
                    value: request.employee
                }
            ]
        });

    if (!confirmed) {
        return;
    }

    try {
        registerMovement(
            material.id,
            MOVEMENT_TYPES.EXIT,
            request.quantity,
            request.notes,
            {
                source: "request",
                requestId: request.id,
                requester: request.employee
            }
        );

        markRequestAsDelivered(
            request.id
        );

        notifyDataChanged();

        showToast(
            "Entrega registrada com sucesso."
        );
    } catch (error) {
        showToast(
            error.message,
            "error"
        );
    }
}

export function initRequestsTable() {
    tableBody.addEventListener(
        "click",
        handleRequestDetails
    );

    tableBody.addEventListener(
        "change",
        handleStatusChange
    );

    tableBody.addEventListener(
        "click",
        handleDelivery
    );

    priorityFilter.addEventListener(
        "change",
        renderRequests
    );

    statusFilter.addEventListener(
        "change",
        renderRequests
    );

    renderRequests();
}