import {
    initRequestForm
} from "./form.js";

import {
    initRequestsTable,
    renderRequests
} from "./table.js";

import {
    initRequestDetails
} from "./request-details.js";

export function initRequestsUI() {
    initRequestForm();
    initRequestDetails();
    initRequestsTable();
}

export function refreshRequestsUI() {
    renderRequests();
}