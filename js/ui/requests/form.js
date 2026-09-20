import {
    addRequest
} from "../../requests/requests.js";

import {
    getMaterialById,
    getMaterials
} from "../../inventory/materials.js";

import {
    APP_EVENTS
} from "../../constants/events.js";

import {
    showToast
} from "../feedback.js";

const dialog =
    document.querySelector("#request-dialog");

const form =
    document.querySelector("#request-form");

const newRequestButton =
    document.querySelector("#new-request");

const closeButton =
    document.querySelector("#close-request-dialog");

const cancelButton =
    document.querySelector("#cancel-request");

const fields = {
    employee:
        document.querySelector("#request-employee"),

    material:
        document.querySelector("#request-material"),

    quantity:
        document.querySelector("#request-quantity"),

    priority:
        document.querySelector("#request-priority"),

    notes:
        document.querySelector("#request-notes")
};

function notifyDataChanged() {
    document.dispatchEvent(
        new CustomEvent(APP_EVENTS.DATA_CHANGED)
    );
}

function renderMaterialOptions() {
    fields.material.innerHTML =
        '<option value="">Selecione</option>';

    getMaterials().forEach((material) => {
        const option =
            document.createElement("option");

        option.value = material.id;

        option.textContent =
            `${material.name} (${material.quantity} ${material.unit})`;

        fields.material.appendChild(option);
    });
}

function openRequestForm() {
    form.reset();
    renderMaterialOptions();
    dialog.showModal();
}

function closeRequestForm() {
    dialog.close();
}

function handleSubmit(event) {
    event.preventDefault();

    const material =
        getMaterialById(fields.material.value);

    if (!material) {
        showToast(
            "Selecione um material válido.",
            "error"
        );

        return;
    }

    const data = {
        employee: fields.employee.value,
        materialId: material.id,
        materialName: material.name,
        quantity: fields.quantity.value,
        priority: fields.priority.value,
        notes: fields.notes.value
    };

    try {
        addRequest(data);

        closeRequestForm();
        notifyDataChanged();

        showToast(
            "Solicitação registrada com sucesso."
        );
    } catch (error) {
        showToast(
            error.message,
            "error"
        );
    }
}

export function initRequestForm() {
    newRequestButton.addEventListener(
        "click",
        openRequestForm
    );

    closeButton.addEventListener(
        "click",
        closeRequestForm
    );

    cancelButton.addEventListener(
        "click",
        closeRequestForm
    );

    form.addEventListener(
        "submit",
        handleSubmit
    );
}