import {
    getMaterials,
    getStockStatus
} from "../inventory/materials.js";

import {
    getMovements
} from "../inventory/movements.js";

import {
    getRequests
} from "../requests/requests.js";

import {
    STOCK_STATUS,
    REQUEST_STATUS
} from "../constants/domain.js";

const elements = {
    totalMaterials:
        document.querySelector("#total-materials"),

    lowStock:
        document.querySelector("#low-stock"),

    pendingRequests:
        document.querySelector("#pending-requests"),

    totalMovements:
        document.querySelector("#total-movements")
};

function getLowStockCount(materials) {
    return materials.filter(
        (material) =>
            getStockStatus(material) ===
            STOCK_STATUS.LOW
    ).length;
}

function getPendingRequestsCount(requests) {
    return requests.filter(
        (request) =>
            request.status ===
            REQUEST_STATUS.PENDING
    ).length;
}

export function renderDashboard() {
    const materials = getMaterials();
    const movements = getMovements();
    const requests = getRequests();

    elements.totalMaterials.textContent =
        materials.length;

    elements.lowStock.textContent =
        getLowStockCount(materials);

    elements.pendingRequests.textContent =
        getPendingRequestsCount(requests);

    elements.totalMovements.textContent =
        movements.length;
}

export function initDashboard() {
    renderDashboard();
}

export function refreshDashboard() {
    renderDashboard();
}