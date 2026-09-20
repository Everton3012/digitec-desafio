import {
    getData,
    saveData,
    STORAGE_KEYS
} from "../storage.js";

import {
    MOVEMENT_TYPES
} from "../constants/domain.js";

export function getMovements() {
    return getData(STORAGE_KEYS.MOVEMENTS);
}

function validateMovement(type, quantity) {
    const parsedQuantity = Number(quantity);

    if (
        !Number.isFinite(parsedQuantity) ||
        parsedQuantity <= 0
    ) {
        throw new Error(
            "A quantidade deve ser maior que zero."
        );
    }

    if (
        !Object.values(MOVEMENT_TYPES)
            .includes(type)
    ) {
        throw new Error(
            "Tipo de movimentação inválido."
        );
    }

    return parsedQuantity;
}

export function createMovement(
    material,
    type,
    quantity,
    notes = "",
    date = new Date().toISOString(),
    context = {}
) {
    const movements = getMovements();

    const movement = {
        id: crypto.randomUUID(),
        materialId: material.id,
        materialName: material.name,
        materialUnit: material.unit,
        type,
        quantity: Number(quantity),
        date,
        notes: notes?.trim() || "",
        source: context.source || "manual",
        requestId: context.requestId || null,
        requester: context.requester || null
    };

    movements.push(movement);

    saveData(
        STORAGE_KEYS.MOVEMENTS,
        movements
    );

    return movement;
}

export function registerMovement(
    materialId,
    type,
    quantity,
    notes = "",
    context = {}
) {
    const movementQuantity =
        validateMovement(type, quantity);

    const materials =
        getData(STORAGE_KEYS.MATERIALS);

    const materialIndex =
        materials.findIndex(
            (material) =>
                material.id === materialId
        );

    if (materialIndex === -1) {
        throw new Error(
            "Material não encontrado."
        );
    }

    const material =
        materials[materialIndex];

    if (
        type === MOVEMENT_TYPES.EXIT &&
        movementQuantity > material.quantity
    ) {
        throw new Error(
            "Quantidade indisponível em estoque."
        );
    }

    const now =
        new Date().toISOString();

    updateStock(
        material,
        type,
        movementQuantity,
        now
    );

    const movement =
        createMovement(
            material,
            type,
            movementQuantity,
            notes,
            now,
            context
        );

    saveData(
        STORAGE_KEYS.MATERIALS,
        materials
    );

    return movement;
}

function updateStock(
    material,
    type,
    quantity,
    now
) {
    if (type === MOVEMENT_TYPES.ENTRY) {
        material.quantity += quantity;
        material.lastRestock = now;
    } else {
        material.quantity -= quantity;
    }

    material.updatedAt = now;
}