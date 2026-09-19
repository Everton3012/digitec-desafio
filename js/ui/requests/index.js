import {
    initRequestForm
} from "./form.js";

import {
    initRequestsTable,
    renderRequests
} from "./table.js";

export function initRequestsUI() {
    initRequestForm();
    initRequestsTable();
}

export function refreshRequestsUI() {
    renderRequests();
}