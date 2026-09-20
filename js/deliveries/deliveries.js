import {
    getData,
    saveData,
    STORAGE_KEYS
} from "../storage.js";

import {
    DELIVERY_STATUS,
    DELIVERY_TYPES
} from "../constants/domain.js";

export function getDeliveries() {
    return getData(STORAGE_KEYS.DELIVERIES);
}

export function getDeliveryById(id) {
    return getDeliveries().find(
        (delivery) => delivery.id === id
    );
}

function validateDelivery(data) {
    if (!data.recipient?.trim()) {
        throw new Error("Informe o destinatário.");
    }

    if (!data.sender?.trim()) {
        throw new Error("Informe o remetente.");
    }

    if (!Object.values(DELIVERY_TYPES).includes(data.type)) {
        throw new Error("Tipo de entrega inválido.");
    }

    if (!data.receivedAt || Number.isNaN(new Date(data.receivedAt).getTime())) {
        throw new Error("Informe uma data e horário de recebimento válidos.");
    }
}

function validateStatus(status) {
    if (!Object.values(DELIVERY_STATUS).includes(status)) {
        throw new Error("Status da entrega inválido.");
    }
}

export function addDelivery(data) {
    validateDelivery(data);

    const deliveries = getDeliveries();
    const now = new Date().toISOString();

    const delivery = {
        id: crypto.randomUUID(),
        recipient: data.recipient.trim(),
        type: data.type,
        sender: data.sender.trim(),
        receivedAt: new Date(data.receivedAt).toISOString(),
        status: DELIVERY_STATUS.RECEIVED,
        notes: data.notes?.trim() || "",
        createdAt: now,
        updatedAt: now
    };

    deliveries.push(delivery);
    saveData(STORAGE_KEYS.DELIVERIES, deliveries);

    return delivery;
}

export function updateDeliveryStatus(id, status) {
    validateStatus(status);

    const deliveries = getDeliveries();

    const index = deliveries.findIndex(
        (delivery) => delivery.id === id
    );

    if (index === -1) {
        throw new Error("Entrega não encontrada.");
    }

    const delivery = deliveries[index];

    if (
        delivery.status === DELIVERY_STATUS.WITHDRAWN ||
        delivery.status === DELIVERY_STATUS.CANCELLED
    ) {
        throw new Error("Esta entrega já foi finalizada.");
    }

    const allowedTransitions = {
        [DELIVERY_STATUS.RECEIVED]: [
            DELIVERY_STATUS.NOTIFIED,
            DELIVERY_STATUS.WITHDRAWN,
            DELIVERY_STATUS.CANCELLED
        ],
        [DELIVERY_STATUS.NOTIFIED]: [
            DELIVERY_STATUS.WITHDRAWN,
            DELIVERY_STATUS.CANCELLED
        ]
    };

    if (!allowedTransitions[delivery.status]?.includes(status)) {
        throw new Error("Alteração de status não permitida.");
    }

    delivery.status = status;
    delivery.updatedAt = new Date().toISOString();

    saveData(STORAGE_KEYS.DELIVERIES, deliveries);

    return delivery;
}

export function getPendingDeliveriesCount() {
    return getDeliveries().filter(
        (delivery) =>
            delivery.status !== DELIVERY_STATUS.WITHDRAWN &&
            delivery.status !== DELIVERY_STATUS.CANCELLED
    ).length;
}
