import {
    getMaterialById
} from "../../inventory/materials.js";

import {
    registerMovement
} from "../../inventory/movements.js";

import {
    APP_EVENTS
} from "../../constants/events.js";

const dialog =
    document.querySelector("#movement-dialog");

const form =
    document.querySelector("#movement-form");

const closeButton =
    document.querySelector("#close-movement-dialog");

const cancelButton =
    document.querySelector("#cancel-movement");

const fields = {
    materialId:
        document.querySelector("#movement-material-id"),

    materialName:
        document.querySelector("#movement-material-name"),

    type:
        document.querySelector("#movement-type"),

    quantity:
        document.querySelector("#movement-quantity"),

    notes:
        document.querySelector("#movement-notes")
};

function notifyDataChanged() {
    document.dispatchEvent(
        new CustomEvent(APP_EVENTS.DATA_CHANGED)
    );
}

export function openMovementForm(materialId) {
    const material =
        getMaterialById(materialId);

    if (!material) {
        alert("Material não encontrado.");
        return;
    }

    form.reset();

    fields.materialId.value =
        material.id;

    fields.materialName.textContent =
        `${material.name} — Estoque atual: ${material.quantity} ${material.unit}`;

    dialog.showModal();
}

function closeMovementForm() {
    dialog.close();
}

function handleSubmit(event) {
    event.preventDefault();

    try {
        registerMovement(
            fields.materialId.value,
            fields.type.value,
            fields.quantity.value,
            fields.notes.value
        );

        closeMovementForm();
        notifyDataChanged();
    } catch (error) {
        alert(error.message);
    }
}

export function initMovementForm() {
    closeButton.addEventListener(
        "click",
        closeMovementForm
    );

    cancelButton.addEventListener(
        "click",
        closeMovementForm
    );

    form.addEventListener(
        "submit",
        handleSubmit
    );
}