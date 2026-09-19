import {
    initMaterialForm
} from "./material-form.js";

import {
    initMaterialsTable,
    renderCategoryFilter,
    renderMaterials
} from "./materials-table.js";

export function refreshInventoryUI() {
    renderCategoryFilter();
    renderMaterials();
}

export function initInventoryUI() {
    initMaterialForm();
    initMaterialsTable();
}