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

export function initInventoryUI() {
    initMaterialForm();
    initMaterialDetails();
    initMaterialsTable();
    const exportButton =
        document.querySelector("#export-inventory");

    exportButton.addEventListener("click", () => {
        exportInventoryCsv();
    });
}

export function refreshInventoryUI() {
    renderCategoryFilter();
    renderMaterials();
}