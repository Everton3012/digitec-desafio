import {
    getRequests
} from "../../requests/requests.js";

import {
    getPriorityLabel,
    getRequestStatusLabel
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

function getRequestsByPeriod(
    requests,
    startDate,
    endDate
) {
    return requests.filter((request) => {
        const requestDate =
            getDateOnly(request.requestDate);

        return (
            requestDate >= startDate &&
            requestDate <= endDate
        );
    });
}

export function exportRequestsCsv({
    startDate,
    endDate
}) {
    const requests =
        getRequestsByPeriod(
            getRequests(),
            startDate,
            endDate
        );

    if (requests.length === 0) {
        return false;
    }

    const headers = [
        "Colaborador",
        "Material",
        "Quantidade",
        "Data da solicitação",
        "Prioridade",
        "Status",
        "Data da entrega",
        "Observações"
    ];

    const rows = requests.map((request) => [
        request.employee,
        request.materialName,
        request.quantity,
        formatCsvDate(request.requestDate),
        getPriorityLabel(request.priority),
        getRequestStatusLabel(request.status),
        formatCsvDate(request.deliveredAt),
        request.notes ?? ""
    ]);

    const content =
        createCsvContent(headers, rows);

    const filename =
        `solicitacoes-digitec-${startDate}-a-${endDate}.csv`;

    downloadCsv(content, filename);

    return true;
}