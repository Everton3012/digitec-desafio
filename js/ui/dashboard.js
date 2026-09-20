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

    availableStock:
        document.querySelector("#available-stock"),

    lowStock:
        document.querySelector("#low-stock"),

    outStock:
        document.querySelector("#out-stock"),

    pendingRequests:
        document.querySelector("#pending-requests"),

    totalMovements:
        document.querySelector("#total-movements")
};

function getStockSummary(materials) {
    const summary = {
        [STOCK_STATUS.AVAILABLE]: 0,
        [STOCK_STATUS.LOW]: 0,
        [STOCK_STATUS.OUT]: 0
    };

    materials.forEach((material) => {
        const status =
            getStockStatus(material);

        summary[status]++;
    });

    return summary;
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

    const stockSummary =
        getStockSummary(materials);

    elements.totalMaterials.textContent =
        materials.length;

    elements.availableStock.textContent =
        stockSummary[STOCK_STATUS.AVAILABLE];

    elements.lowStock.textContent =
        stockSummary[STOCK_STATUS.LOW];

    elements.outStock.textContent =
        stockSummary[STOCK_STATUS.OUT];

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