import {
    getMovements
} from "../../inventory/movements.js";

import {
    formatDate,
    formatTime,
    getMovementTypeLabel
} from "../../utils/formatters.js";

const tableBody =
    document.querySelector(
        "#movements-table-body"
    );

const dialog =
    document.querySelector(
        "#movement-details-dialog"
    );

const closeButton =
    document.querySelector(
        "#close-movement-details"
    );

const fields = {
    material:
        document.querySelector(
            "#movement-detail-material"
        ),

    type:
        document.querySelector(
            "#movement-detail-type"
        ),

    quantity:
        document.querySelector(
            "#movement-detail-quantity"
        ),

    date:
        document.querySelector(
            "#movement-detail-date"
        ),

    time:
        document.querySelector(
            "#movement-detail-time"
        ),

    source:
        document.querySelector(
            "#movement-detail-source"
        ),

    requester:
        document.querySelector(
            "#movement-detail-requester"
        ),

    requesterGroup:
        document.querySelector(
            "#movement-detail-requester-group"
        ),

    notes:
        document.querySelector(
            "#movement-detail-notes"
        )
};

function getMovementSourceLabel(source) {
    const labels = {
        manual: "Movimentação manual",
        request: "Entrega de solicitação",
        initial: "Estoque inicial"
    };

    return labels[source];
}

function renderIcons() {
    if (window.lucide) {
        window.lucide.createIcons();
    }
}

function createMovementRow(movement) {
    const row =
        document.createElement("tr");

    row.innerHTML = `
        <td>${movement.materialName}</td>

        <td>
            <span class="badge badge-${movement.type}">
                ${getMovementTypeLabel(movement.type)}
            </span>
        </td>

        <td class="desktop-only">
            ${movement.quantity} ${movement.materialUnit}
        </td>

        <td class="desktop-only">
            ${formatDate(movement.date)}
        </td>

        <td class="table-actions">
            <button
                type="button"
                class="icon-button"
                data-action="details"
                data-id="${movement.id}"
                aria-label="Ver detalhes da movimentação de ${movement.materialName}"
                title="Ver detalhes"
            >
                <i data-lucide="ellipsis" aria-hidden="true"></i>
            </button>
        </td>
    `;

    return row;
}

export function renderMovements() {
    const movements = [
        ...getMovements()
    ].sort(
        (a, b) =>
            new Date(b.date) -
            new Date(a.date)
    );

    tableBody.innerHTML = "";

    if (!movements.length) {
        tableBody.innerHTML = `
            <tr>
                <td colspan="5">
                    Nenhuma movimentação registrada.
                </td>
            </tr>
        `;

        return;
    }

    movements.forEach((movement) => {
        tableBody.appendChild(
            createMovementRow(movement)
        );
    });

    renderIcons();
}

function openMovementDetails(movementId) {
    const movement =
        getMovements().find(
            (item) =>
                item.id === movementId
        );

    if (!movement) {
        return;
    }

    fields.material.textContent =
        movement.materialName;

    fields.type.textContent =
        getMovementTypeLabel(
            movement.type
        );

    fields.quantity.textContent =
        `${movement.quantity} ${movement.materialUnit}`;

    fields.date.textContent =
        formatDate(movement.date);

    fields.time.textContent =
        formatTime(movement.date);

    fields.source.textContent =
        getMovementSourceLabel(
            movement.source
        );

    fields.notes.textContent =
        movement.notes ||
        "Sem observações";

    if (movement.requester) {
        fields.requester.textContent =
            movement.requester;

        fields.requesterGroup.hidden =
            false;
    } else {
        fields.requesterGroup.hidden =
            true;
    }

    dialog.showModal();
}

function closeMovementDetails() {
    if (dialog.open) {
        dialog.close();
    }
}

function handleTableAction(event) {
    const button =
        event.target.closest(
            'button[data-action="details"]'
        );

    if (!button) {
        return;
    }

    openMovementDetails(
        button.dataset.id
    );
}

export function initMovementsTable() {
    tableBody.addEventListener(
        "click",
        handleTableAction
    );

    closeButton.addEventListener(
        "click",
        closeMovementDetails
    );

    renderMovements();
}