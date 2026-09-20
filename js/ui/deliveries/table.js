import {
    getDeliveries,
    updateDeliveryStatus
} from "../../deliveries/deliveries.js";

import {
    DELIVERY_STATUS
} from "../../constants/domain.js";

import {
    APP_EVENTS
} from "../../constants/events.js";

import {
    formatDate,
    getDeliveryStatusLabel,
    getDeliveryTypeLabel
} from "../../utils/formatters.js";

import {
    openDeliveryDetails
} from "./delivery-details.js";

import {
    showToast
} from "../feedback.js";

import {
    confirmAction
} from "../confirm.js";

const tableBody = document.querySelector("#deliveries-table-body");
const searchInput = document.querySelector("#delivery-search");
const statusFilter = document.querySelector("#delivery-status-filter");

function notifyDataChanged() {
    document.dispatchEvent(
        new CustomEvent(APP_EVENTS.DATA_CHANGED)
    );
}

function renderIcons() {
    if (window.lucide) {
        window.lucide.createIcons();
    }
}

function getFilteredDeliveries() {
    const search = searchInput.value
        .trim()
        .toLocaleLowerCase("pt-BR");

    const status = statusFilter.value;

    return getDeliveries()
        .filter((delivery) => {
            const matchesSearch =
                !search ||
                delivery.recipient
                    .toLocaleLowerCase("pt-BR")
                    .includes(search);

            const matchesStatus =
                !status ||
                (
                    status === "pending"
                        ? delivery.status !== DELIVERY_STATUS.WITHDRAWN &&
                        delivery.status !== DELIVERY_STATUS.CANCELLED
                        : delivery.status === status
                );

            return matchesSearch && matchesStatus;
        })
        .sort(
            (a, b) =>
                new Date(b.receivedAt) -
                new Date(a.receivedAt)
        );
}

function createActions(delivery) {
    const detailsButton = `
        <button
            type="button"
            class="icon-button"
            data-action="details"
            data-id="${delivery.id}"
            aria-label="Ver detalhes da entrega para ${delivery.recipient}"
            title="Ver detalhes"
        >
            <i data-lucide="ellipsis" aria-hidden="true"></i>
        </button>
    `;

    if (
        delivery.status === DELIVERY_STATUS.WITHDRAWN ||
        delivery.status === DELIVERY_STATUS.CANCELLED
    ) {
        return detailsButton;
    }

    const notifyButton =
        delivery.status === DELIVERY_STATUS.RECEIVED
            ? `
                <button
                    type="button"
                    class="icon-button"
                    data-action="notify"
                    data-id="${delivery.id}"
                    aria-label="Marcar destinatário como avisado"
                    title="Marcar como avisado"
                >
                    <i data-lucide="bell" aria-hidden="true"></i>
                </button>
            `
            : "";

    return `
        ${detailsButton}

        ${notifyButton}

        <button
            type="button"
            class="icon-button icon-button-success"
            data-action="withdraw"
            data-id="${delivery.id}"
            aria-label="Confirmar retirada"
            title="Confirmar retirada"
        >
            <i data-lucide="check" aria-hidden="true"></i>
        </button>

        <button
            type="button"
            class="icon-button icon-button-danger"
            data-action="cancel"
            data-id="${delivery.id}"
            aria-label="Cancelar entrega"
            title="Cancelar"
        >
            <i data-lucide="x" aria-hidden="true"></i>
        </button>
    `;
}

function createDeliveryRow(delivery) {
    const row = document.createElement("tr");

    row.innerHTML = `
        <td>${delivery.recipient}</td>

        <td class="desktop-only">
            ${getDeliveryTypeLabel(delivery.type)}
        </td>

        <td class="desktop-only">
            ${formatDate(delivery.receivedAt)}
        </td>

        <td>
            <span class="badge badge-delivery-${delivery.status}">
                ${getDeliveryStatusLabel(delivery.status)}
            </span>
        </td>

        <td class="table-actions">
            ${createActions(delivery)}
        </td>
    `;

    return row;
}

export function renderDeliveries() {
    const deliveries = getFilteredDeliveries();

    tableBody.innerHTML = "";

    if (!deliveries.length) {
        tableBody.innerHTML = `
            <tr>
                <td colspan="5">
                    Nenhuma entrega encontrada.
                </td>
            </tr>
        `;

        return;
    }

    deliveries.forEach((delivery) => {
        tableBody.appendChild(
            createDeliveryRow(delivery)
        );
    });

    renderIcons();
}

async function changeStatus(id, status, confirmation) {
    const confirmed = await confirmAction(confirmation);

    if (!confirmed) {
        return;
    }

    try {
        updateDeliveryStatus(id, status);

        notifyDataChanged();
        renderDeliveries();

        showToast("Status da entrega atualizado.");
    } catch (error) {
        showToast(error.message, "error");
        renderDeliveries();
    }
}

function handleActions(event) {
    const button = event.target.closest(
        "button[data-action]"
    );

    if (!button) {
        return;
    }

    const { action, id } = button.dataset;

    if (action === "details") {
        openDeliveryDetails(id);
        return;
    }

    const delivery = getDeliveries().find(
        (item) => item.id === id
    );

    if (!delivery) {
        showToast("Entrega não encontrada.", "error");
        return;
    }

    if (action === "notify") {
        changeStatus(
            id,
            DELIVERY_STATUS.NOTIFIED,
            {
                title: "Confirmar aviso",
                message: "Confirma que o destinatário foi avisado?",
                confirmText: "Confirmar aviso",
                variant: "primary",
                details: [
                    {
                        label: "Destinatário",
                        value: delivery.recipient
                    }
                ]
            }
        );

        return;
    }

    if (action === "withdraw") {
        changeStatus(
            id,
            DELIVERY_STATUS.WITHDRAWN,
            {
                title: "Confirmar retirada",
                message: "Confirma que a entrega foi retirada pelo destinatário?",
                confirmText: "Confirmar retirada",
                variant: "primary",
                details: [
                    {
                        label: "Destinatário",
                        value: delivery.recipient
                    }
                ]
            }
        );

        return;
    }

    if (action === "cancel") {
        changeStatus(
            id,
            DELIVERY_STATUS.CANCELLED,
            {
                title: "Cancelar entrega",
                message: "Deseja realmente cancelar este registro?",
                confirmText: "Cancelar entrega",
                variant: "danger",
                details: [
                    {
                        label: "Destinatário",
                        value: delivery.recipient
                    }
                ]
            }
        );
    }
}

export function initDeliveriesTable() {
    searchInput.addEventListener(
        "input",
        renderDeliveries
    );

    statusFilter.addEventListener(
        "change",
        renderDeliveries
    );

    tableBody.addEventListener(
        "click",
        handleActions
    );

    renderDeliveries();
}