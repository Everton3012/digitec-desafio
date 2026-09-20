import {
    initMaterialForm
} from "./material-form.js";

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
}

export function refreshInventoryUI() {
    renderCategoryFilter();
    renderMaterials();
}