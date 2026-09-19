import {
    getData,
    saveData,
    STORAGE_KEYS
} from "../storage.js";

import {
    STOCK_STATUS,
    MOVEMENT_TYPES
} from "../constants/domain.js";

import {
    createMovement
} from "./movements.js";

export function getMaterials() {
    return getData(STORAGE_KEYS.MATERIALS);
}

export function getMaterialById(id) {
    return getMaterials().find(
        (material) => material.id === id
    );
}

export function getStockStatus(material) {
    if (material.quantity === 0) {
        return STOCK_STATUS.OUT;
    }

    if (
        material.quantity <=
        material.minimumStock
    ) {
        return STOCK_STATUS.LOW;
    }

    return STOCK_STATUS.AVAILABLE;
}

function validateMaterial(
    data,
    validateQuantity = true
) {
    if (!data.name?.trim()) {
        throw new Error(
            "Informe o nome do material."
        );
    }

    if (!data.category) {
        throw new Error(
            "Selecione uma categoria."
        );
    }

    if (!data.unit) {
        throw new Error(
            "Selecione uma unidade de medida."
        );
    }

    if (!data.storageLocation?.trim()) {
        throw new Error(
            "Informe o local de armazenamento."
        );
    }

    const minimumStock =
        Number(data.minimumStock);

    if (
        !Number.isFinite(minimumStock) ||
        minimumStock < 0
    ) {
        throw new Error(
            "Informe um estoque mínimo válido."
        );
    }

    if (!validateQuantity) {
        return;
    }

    const quantity = Number(data.quantity);

    if (
        !Number.isFinite(quantity) ||
        quantity < 0
    ) {
        throw new Error(
            "Informe uma quantidade válida."
        );
    }
}

function createMaterial(data, now) {
    const quantity = Number(data.quantity);

    return {
        id: crypto.randomUUID(),
        name: data.name.trim(),
        category: data.category,
        quantity,
        minimumStock:
            Number(data.minimumStock),
        unit: data.unit,
        storageLocation:
            data.storageLocation.trim(),
        lastRestock:
            quantity > 0 ? now : null,
        notes:
            data.notes?.trim() || "",
        createdAt: now,
        updatedAt: now
    };
}

export function addMaterial(data) {
    validateMaterial(data);

    const materials = getMaterials();
    const now = new Date().toISOString();

    const material =
        createMaterial(data, now);

    materials.push(material);

    saveData(
        STORAGE_KEYS.MATERIALS,
        materials
    );

    if (material.quantity > 0) {
        createMovement(
            material,
            MOVEMENT_TYPES.ENTRY,
            material.quantity,
            "Estoque inicial",
            now
        );
    }

    return material;
}

export function updateMaterial(id, data) {
    validateMaterial(data, false);

    const materials = getMaterials();

    const index = materials.findIndex(
        (material) => material.id === id
    );

    if (index === -1) {
        throw new Error(
            "Material não encontrado."
        );
    }

    const updatedMaterial = {
        ...materials[index],

        name:
            data.name.trim(),

        category:
            data.category,

        minimumStock:
            Number(data.minimumStock),

        unit:
            data.unit,

        storageLocation:
            data.storageLocation.trim(),

        notes:
            data.notes?.trim() || "",

        updatedAt:
            new Date().toISOString()
    };

    materials[index] = updatedMaterial;

    saveData(
        STORAGE_KEYS.MATERIALS,
        materials
    );

    return updatedMaterial;
}

export function removeMaterial(id) {
    const materials = getMaterials();

    const index = materials.findIndex(
        (material) => material.id === id
    );

    if (index === -1) {
        throw new Error(
            "Material não encontrado."
        );
    }

    materials.splice(index, 1);

    saveData(
        STORAGE_KEYS.MATERIALS,
        materials
    );
}