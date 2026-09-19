import {
    getData,
    saveData,
    STORAGE_KEYS
} from "../storage.js";

import {
    REQUEST_PRIORITY,
    REQUEST_STATUS
} from "../constants/domain.js";

const EDITABLE_STATUS = Object.freeze([
    REQUEST_STATUS.PENDING,
    REQUEST_STATUS.APPROVED,
    REQUEST_STATUS.CANCELLED
]);

export function getRequests() {
    return getData(
        STORAGE_KEYS.REQUESTS
    );
}

export function getRequestById(id) {
    return getRequests().find(
        (request) =>
            request.id === id
    );
}

function validateRequest(data) {
    if (!data.employee?.trim()) {
        throw new Error(
            "Informe o nome do colaborador."
        );
    }

    if (!data.materialId) {
        throw new Error(
            "Selecione um material."
        );
    }

    const quantity =
        Number(data.quantity);

    if (
        !Number.isFinite(quantity) ||
        quantity <= 0
    ) {
        throw new Error(
            "A quantidade deve ser maior que zero."
        );
    }

    if (
        !Object.values(REQUEST_PRIORITY)
            .includes(data.priority)
    ) {
        throw new Error(
            "Prioridade inválida."
        );
    }
}

function validateStatus(status) {
    if (!EDITABLE_STATUS.includes(status)) {
        throw new Error(
            "Status da solicitação inválido."
        );
    }
}

function getRequestIndex(requests, id) {
    const index =
        requests.findIndex(
            (request) =>
                request.id === id
        );

    if (index === -1) {
        throw new Error(
            "Solicitação não encontrada."
        );
    }

    return index;
}

function createRequest(data, now) {
    return {
        id: crypto.randomUUID(),

        employee:
            data.employee.trim(),

        materialId:
            data.materialId,

        materialName:
            data.materialName,

        quantity:
            Number(data.quantity),

        requestDate:
            now,

        priority:
            data.priority,

        status:
            REQUEST_STATUS.PENDING,

        notes:
            data.notes?.trim() || "",

        deliveredAt:
            null,

        createdAt:
            now,

        updatedAt:
            now
    };
}

export function addRequest(data) {
    validateRequest(data);

    const requests =
        getRequests();

    const now =
        new Date().toISOString();

    const request =
        createRequest(data, now);

    requests.push(request);

    saveData(
        STORAGE_KEYS.REQUESTS,
        requests
    );

    return request;
}

export function updateRequestStatus(
    id,
    status
) {
    validateStatus(status);

    const requests =
        getRequests();

    const index =
        getRequestIndex(
            requests,
            id
        );

    const request =
        requests[index];

    if (
        request.status ===
        REQUEST_STATUS.DELIVERED
    ) {
        throw new Error(
            "Uma solicitação entregue não pode ter o status alterado."
        );
    }

    request.status = status;

    request.updatedAt =
        new Date().toISOString();

    saveData(
        STORAGE_KEYS.REQUESTS,
        requests
    );

    return request;
}

export function markRequestAsDelivered(id) {
    const requests =
        getRequests();

    const index =
        getRequestIndex(
            requests,
            id
        );

    const request =
        requests[index];

    validateDelivery(request);

    const now =
        new Date().toISOString();

    request.status =
        REQUEST_STATUS.DELIVERED;

    request.deliveredAt =
        now;

    request.updatedAt =
        now;

    saveData(
        STORAGE_KEYS.REQUESTS,
        requests
    );

    return request;
}

function validateDelivery(request) {
    if (
        request.status ===
        REQUEST_STATUS.DELIVERED
    ) {
        throw new Error(
            "Esta solicitação já foi entregue."
        );
    }

    if (
        request.status !==
        REQUEST_STATUS.APPROVED
    ) {
        throw new Error(
            "A solicitação precisa estar aprovada antes da entrega."
        );
    }
}