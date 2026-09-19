import {
    getMovements
} from "../../inventory/movements.js";

import {
    formatDate,
    getMovementTypeLabel
} from "../../utils/formatters.js";

const tableBody =
    document.querySelector("#movements-table-body");

function createMovementRow(movement) {
    const row =
        document.createElement("tr");

    row.innerHTML = `
        <td>
            ${movement.materialName || "Material removido"}
        </td>

        <td>
            <span class="badge badge-${movement.type}">
                ${getMovementTypeLabel(movement.type)}
            </span>
        </td>

        <td>${movement.quantity}</td>

        <td>
            ${formatDate(movement.date)}
        </td>

        <td>
            ${movement.notes || "-"}
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
}

export function initMovementsTable() {
    renderMovements();
}