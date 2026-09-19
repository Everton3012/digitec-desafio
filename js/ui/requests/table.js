import {
    getRequestById,
    getRequests,
    updateRequestStatus,
    markRequestAsDelivered
} from "../../requests/requests.js";

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
    formatDate,
    getPriorityLabel,
    getRequestStatusLabel
} from "../../utils/formatters.js";

const tableBody =
    document.querySelector("#requests-table-body");

const priorityFilter =
    document.querySelector("#priority-filter");

const statusFilter =
    document.querySelector("#request-status-filter");

function notifyDataChanged() {
    document.dispatchEvent(
        new CustomEvent(APP_EVENTS.DATA_CHANGED)
    );
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

function createStatusOption(request, status) {
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

function createRequestActions(request) {
    if (
        request.status ===
        REQUEST_STATUS.DELIVERED
    ) {
        return `
            <span class="request-finished">
                ${getRequestStatusLabel(
                    REQUEST_STATUS.DELIVERED
                )}
            </span>
        `;
    }

    const deliverButton =
        request.status ===
        REQUEST_STATUS.APPROVED
            ? `
                <button
                    type="button"
                    data-action="deliver"
                    data-id="${request.id}"
                >
                    Entregar
                </button>
            `
            : "";

    return `
        <select
            data-action="status"
            data-id="${request.id}"
            aria-label="Alterar status"
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
        <td>${request.employee}</td>
        <td>${request.materialName}</td>
        <td>${request.quantity}</td>

        <td>
            ${formatDate(request.requestDate)}
        </td>

        <td>
            <span
                class="badge badge-priority-${request.priority}"
            >
                ${getPriorityLabel(request.priority)}
            </span>
        </td>

        <td>
            <span
                class="badge badge-request-${request.status}"
            >
                ${getRequestStatusLabel(request.status)}
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
                <td colspan="7">
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
}

function handleStatusChange(event) {
    const select =
        event.target.closest(
            'select[data-action="status"]'
        );

    if (!select) {
        return;
    }

    try {
        updateRequestStatus(
            select.dataset.id,
            select.value
        );

        notifyDataChanged();
    } catch (error) {
        alert(error.message);
        renderRequests();
    }
}

function handleDelivery(event) {
    const button =
        event.target.closest(
            'button[data-action="deliver"]'
        );

    if (!button) {
        return;
    }

    const request =
        getRequestById(button.dataset.id);

    if (!request) {
        alert("Solicitação não encontrada.");
        return;
    }

    const material =
        getMaterialById(request.materialId);

    if (!material) {
        alert(
            "O material desta solicitação não está mais cadastrado."
        );
        return;
    }

    if (request.quantity > material.quantity) {
        alert(
            `Estoque insuficiente. Disponível: ${material.quantity} ${material.unit}.`
        );

        return;
    }

    const confirmed = confirm(
        `Confirmar entrega de ${request.quantity} ${material.unit} de ${material.name} para ${request.employee}?`
    );

    if (!confirmed) {
        return;
    }

    try {
        registerMovement(
            material.id,
            MOVEMENT_TYPES.EXIT,
            request.quantity,
            `Entrega para ${request.employee}`
        );

        markRequestAsDelivered(
            request.id
        );

        notifyDataChanged();
    } catch (error) {
        alert(error.message);
    }
}

export function initRequestsTable() {
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