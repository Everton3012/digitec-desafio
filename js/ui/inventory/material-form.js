import {
    addMaterial,
    getMaterialById,
    updateMaterial
} from "../../inventory/materials.js";

import {
    showToast
} from "../feedback.js";

import {
    APP_EVENTS
} from "../../constants/events.js";

const dialog =
    document.querySelector("#material-dialog");

const form =
    document.querySelector("#material-form");

const formTitle =
    document.querySelector("#material-form-title");

const newMaterialButton =
    document.querySelector("#new-material");

const closeButton =
    document.querySelector("#close-material-dialog");

const cancelButton =
    document.querySelector("#cancel-material");

const quantityGroup =
    document.querySelector(
        "#material-quantity-group"
    );

const fields = {
    id:
        document.querySelector("#material-id"),

    name:
        document.querySelector("#material-name"),

    category:
        document.querySelector("#material-category"),

    quantity:
        document.querySelector("#material-quantity"),

    minimumStock:
        document.querySelector("#material-minimum-stock"),

    unit:
        document.querySelector("#material-unit"),

    storageLocation:
        document.querySelector("#material-storage-location"),

    notes:
        document.querySelector("#material-notes")
};

function notifyDataChanged() {
    document.dispatchEvent(
        new CustomEvent(APP_EVENTS.DATA_CHANGED)
    );
}

function getFormData() {
    return {
        name: fields.name.value,
        category: fields.category.value,
        quantity: fields.quantity.value,
        minimumStock: fields.minimumStock.value,
        unit: fields.unit.value,
        storageLocation: fields.storageLocation.value,
        notes: fields.notes.value
    };
}

export function openMaterialForm() {
    form.reset();

    fields.id.value = "";

    formTitle.textContent =
        "Novo material";

    quantityGroup.hidden =
        false;

    dialog.showModal();
}

export function openMaterialEditForm(materialId) {
    const material =
        getMaterialById(materialId);

    if (!material) {
        showToast(
            "Material não encontrado.",
            "error"
        );

        return;
    }

    form.reset();

    fields.id.value =
        material.id;

    fields.name.value =
        material.name;

    fields.category.value =
        material.category;

    fields.quantity.value =
        material.quantity;

    fields.minimumStock.value =
        material.minimumStock;

    fields.unit.value =
        material.unit;

    fields.storageLocation.value =
        material.storageLocation;

    fields.notes.value =
        material.notes ?? "";

    formTitle.textContent =
        "Editar material";

    quantityGroup.hidden =
        true;

    dialog.showModal();
}

function closeMaterialForm() {
    dialog.close();
}

function handleSubmit(event) {
    event.preventDefault();

    const materialId =
        fields.id.value;

    const data =
        getFormData();

    try {
        const isEditing =
            Boolean(materialId);

        if (isEditing) {
            updateMaterial(
                materialId,
                data
            );
        } else {
            addMaterial(data);
        }

        closeMaterialForm();
        notifyDataChanged();

        showToast(
            isEditing
                ? "Material atualizado com sucesso."
                : "Material cadastrado com sucesso."
        );
    } catch (error) {
        showToast(
            error.message,
            "error"
        );
    }
}

export function initMaterialForm() {
    newMaterialButton.addEventListener(
        "click",
        openMaterialForm
    );

    closeButton.addEventListener(
        "click",
        closeMaterialForm
    );

    cancelButton.addEventListener(
        "click",
        closeMaterialForm
    );

    form.addEventListener(
        "submit",
        handleSubmit
    );
}