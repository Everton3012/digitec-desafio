import {
    getMovements
} from "../../inventory/movements.js";

import {
    getMovementTypeLabel
} from "../../utils/formatters.js";

import {
    createCsvContent,
    downloadCsv
} from "../../utils/csv.js";

function getDateOnly(date) {
    return new Date(date)
        .toISOString()
        .slice(0, 10);
}

function formatCsvDate(date) {
    if (!date) return "";

    return new Intl.DateTimeFormat("pt-BR", {
        dateStyle: "short",
        timeStyle: "short"
    }).format(new Date(date));
}

function getMovementSourceLabel(source) {
    const labels = {
        initial: "Estoque inicial",
        manual: "Movimentação manual",
        request: "Solicitação"
    };

    return labels[source] ?? source ?? "";
}

function getMovementsByPeriod(
    movements,
    startDate,
    endDate
) {
    return movements.filter((movement) => {
        const movementDate =
            getDateOnly(movement.date);

        return (
            movementDate >= startDate &&
            movementDate <= endDate
        );
    });
}

export function exportMovementsCsv({
    startDate,
    endDate
}) {
    const movements =
        getMovementsByPeriod(
            getMovements(),
            startDate,
            endDate
        );

    if (movements.length === 0) {
        return false;
    }

    const headers = [
        "Material",
        "Tipo",
        "Quantidade",
        "Unidade",
        "Data",
        "Origem",
        "Solicitante",
        "Observações"
    ];

    const rows = movements.map((movement) => [
        movement.materialName,
        getMovementTypeLabel(movement.type),
        movement.quantity,
        movement.materialUnit,
        formatCsvDate(movement.date),
        getMovementSourceLabel(movement.source),
        movement.requester ?? "",
        movement.notes ?? ""
    ]);

    const content =
        createCsvContent(headers, rows);

    const filename =
        `movimentacoes-digitec-${startDate}-a-${endDate}.csv`;

    downloadCsv(content, filename);

    return true;
}