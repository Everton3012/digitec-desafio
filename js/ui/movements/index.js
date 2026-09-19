import {
    initMovementForm,
    openMovementForm
} from "./form.js";

import {
    initMovementsTable,
    renderMovements
} from "./table.js";

export {
    openMovementForm
};

export function initMovementsUI() {
    initMovementForm();
    initMovementsTable();
}

export function refreshMovementsUI() {
    renderMovements();
}