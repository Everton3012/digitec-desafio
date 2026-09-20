import {
    getMaterialById,
    getStockStatus
} from "../../inventory/materials.js";

import {
    formatDate,
    getStockStatusLabel
} from "../../utils/formatters.js";

const dialog =
    document.querySelector(
        "#material-details-dialog"
    );

const closeButton =
    document.querySelector(
        "#close-material-details"
    );

const fields = {
    name:
        document.querySelector(
            "#material-detail-name"
        ),

    category:
        document.querySelector(
            "#material-detail-category"
        ),

    quantity:
        document.querySelector(
            "#material-detail-quantity"
        ),

    minimumStock:
        document.querySelector(
            "#material-detail-minimum"
        ),

    status:
        document.querySelector(
            "#material-detail-status"
        ),

    location:
        document.querySelector(
            "#material-detail-location"
        ),

    lastRestock:
        document.querySelector(
            "#material-detail-restock"
        ),

    notes:
        document.querySelector(
            "#material-detail-notes"
        )
};

export function openMaterialDetails(materialId) {
    const material =
        getMaterialById(materialId);

    if (!material) {
        return;
    }

    const status =
        getStockStatus(material);

    fields.name.textContent =
        material.name;

    fields.category.textContent =
        material.category;

    fields.quantity.textContent =
        `${material.quantity} ${material.unit}`;

    fields.minimumStock.textContent =
        `${material.minimumStock} ${material.unit}`;

    fields.status.textContent =
        getStockStatusLabel(status);

    fields.location.textContent =
        material.storageLocation;

    fields.lastRestock.textContent =
        material.lastRestock
            ? formatDate(material.lastRestock)
            : "Sem reposições";

    fields.notes.textContent =
        material.notes ||
        "Sem observações";

    dialog.showModal();
}

function closeMaterialDetails() {
    if (dialog.open) {
        dialog.close();
    }
}

export function initMaterialDetails() {
    closeButton.addEventListener(
        "click",
        closeMaterialDetails
    );

    dialog.addEventListener(
        "cancel",
        (event) => {
            event.preventDefault();
            closeMaterialDetails();
        }
    );

    dialog.addEventListener(
        "click",
        (event) => {
            if (event.target === dialog) {
                closeMaterialDetails();
            }
        }
    );
}