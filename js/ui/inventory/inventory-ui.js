import {
    initMaterialForm
} from "./material-form.js";

import {
    exportInventoryCsv
} from "./export.js";

import {
    initMaterialsTable,
    renderCategoryFilter,
    renderMaterials
} from "./materials-table.js";

import {
    initMaterialDetails
} from "./material-details.js";

import {
    showToast
} from "../feedback.js";


export function initInventoryUI() {
    initMaterialForm();
    initMaterialDetails();
    initMaterialsTable();

    const exportButton =
        document.querySelector("#export-inventory");

    exportButton.addEventListener("click", () => {
        const exported = exportInventoryCsv();

        if (!exported) {
            showToast(
                "Não há materiais para exportar.",
                "warning"
            );

            return;
        }

        showToast(
            "Estoque exportado com sucesso.",
            "success"
        );
    });
}


export function refreshInventoryUI() {
    renderCategoryFilter();
    renderMaterials();
}