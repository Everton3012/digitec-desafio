import {
    getDeliveries
} from "../../deliveries/deliveries.js";

import {
    getDeliveryStatusLabel,
    getDeliveryTypeLabel
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
        dateStyle: "short"
    }).format(new Date(date));
}

function formatCsvTime(date) {
    if (!date) return "";

    return new Intl.DateTimeFormat("pt-BR", {
        hour: "2-digit",
        minute: "2-digit"
    }).format(new Date(date));
}

function getDeliveriesByPeriod(
    deliveries,
    startDate,
    endDate
) {
    return deliveries.filter((delivery) => {
        const deliveryDate =
            getDateOnly(delivery.receivedAt);

        return (
            deliveryDate >= startDate &&
            deliveryDate <= endDate
        );
    });
}

export function exportDeliveriesCsv({
    startDate,
    endDate
}) {
    const deliveries =
        getDeliveriesByPeriod(
            getDeliveries(),
            startDate,
            endDate
        );

    if (deliveries.length === 0) {
        return false;
    }

    const headers = [
        "Destinatário",
        "Tipo",
        "Remetente",
        "Data de recebimento",
        "Horário",
        "Status",
        "Observações"
    ];

    const rows = deliveries.map((delivery) => [
        delivery.recipient,
        getDeliveryTypeLabel(delivery.type),
        delivery.sender,
        formatCsvDate(delivery.receivedAt),
        formatCsvTime(delivery.receivedAt),
        getDeliveryStatusLabel(delivery.status),
        delivery.notes ?? ""
    ]);

    const content =
        createCsvContent(headers, rows);

    const filename =
        `entregas-digitec-${startDate}-a-${endDate}.csv`;

    downloadCsv(content, filename);

    return true;
}