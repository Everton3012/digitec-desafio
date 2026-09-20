import {
    STOCK_STATUS,
    MOVEMENT_TYPES,
    REQUEST_STATUS,
    REQUEST_PRIORITY,
    DELIVERY_TYPES,
    DELIVERY_STATUS
} from "../constants/domain.js";

const STOCK_STATUS_LABELS = Object.freeze({
    [STOCK_STATUS.AVAILABLE]: "Em estoque",
    [STOCK_STATUS.LOW]: "Estoque baixo",
    [STOCK_STATUS.OUT]: "Sem estoque"
});

const MOVEMENT_TYPE_LABELS = Object.freeze({
    [MOVEMENT_TYPES.ENTRY]: "Entrada",
    [MOVEMENT_TYPES.EXIT]: "Saída"
});

const REQUEST_PRIORITY_LABELS = Object.freeze({
    [REQUEST_PRIORITY.LOW]: "Baixa",
    [REQUEST_PRIORITY.MEDIUM]: "Média",
    [REQUEST_PRIORITY.HIGH]: "Alta"
});

const DELIVERY_TYPE_LABELS = Object.freeze({
    [DELIVERY_TYPES.PACKAGE]: "Encomenda",
    [DELIVERY_TYPES.DOCUMENT]: "Documento",
    [DELIVERY_TYPES.CORRESPONDENCE]: "Correspondência",
    [DELIVERY_TYPES.OTHER]: "Outros"
});

const DELIVERY_STATUS_LABELS = Object.freeze({
    [DELIVERY_STATUS.RECEIVED]: "Recebido",
    [DELIVERY_STATUS.NOTIFIED]: "Avisado",
    [DELIVERY_STATUS.WITHDRAWN]: "Retirado",
    [DELIVERY_STATUS.CANCELLED]: "Cancelado"
});

const REQUEST_STATUS_LABELS = Object.freeze({
    [REQUEST_STATUS.PENDING]: "Pendente",
    [REQUEST_STATUS.APPROVED]: "Aprovada",
    [REQUEST_STATUS.DELIVERED]: "Entregue",
    [REQUEST_STATUS.CANCELLED]: "Cancelada"
});

export function formatDate(date) {
    if (!date) {
        return "-";
    }

    return new Intl.DateTimeFormat("pt-BR", {
        dateStyle: "short"
    }).format(new Date(date));
}

export function formatTime(date) {
    if (!date) {
        return "-";
    }

    return new Intl.DateTimeFormat("pt-BR", {
        hour: "2-digit",
        minute: "2-digit"
    }).format(new Date(date));
}

export function getStockStatusLabel(status) {
    return STOCK_STATUS_LABELS[status] ?? status;
}

export function getMovementTypeLabel(type) {
    return MOVEMENT_TYPE_LABELS[type] ?? type;
}

export function getPriorityLabel(priority) {
    return REQUEST_PRIORITY_LABELS[priority] ?? priority;
}

export function getRequestStatusLabel(status) {
    return REQUEST_STATUS_LABELS[status] ?? status;
}

export function getDeliveryTypeLabel(type) {
    return DELIVERY_TYPE_LABELS[type] ?? type;
}

export function getDeliveryStatusLabel(status) {
    return DELIVERY_STATUS_LABELS[status] ?? status;
}
