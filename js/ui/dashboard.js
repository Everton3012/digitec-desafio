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
    MOVEMENT_TYPES,
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
        document.querySelector("#total-movements"),

    stockStatusChart:
        document.querySelector("#stock-status-chart"),

    movementsChart:
        document.querySelector("#movements-chart")
};


let stockStatusChart = null;
let movementsChart = null;


function getStockSummary(materials) {
    const summary = {
        [STOCK_STATUS.AVAILABLE]: 0,
        [STOCK_STATUS.LOW]: 0,
        [STOCK_STATUS.OUT]: 0
    };

    materials.forEach((material) => {
        const status = getStockStatus(material);
        summary[status]++;
    });

    return summary;
}


function getMovementSummary(movements) {
    const summary = {
        [MOVEMENT_TYPES.ENTRY]: 0,
        [MOVEMENT_TYPES.EXIT]: 0
    };

    movements.forEach((movement) => {
        summary[movement.type]++;
    });

    return summary;
}


function getPendingRequestsCount(requests) {
    return requests.filter(
        (request) =>
            request.status === REQUEST_STATUS.PENDING
    ).length;
}


function renderStockStatusChart(stockSummary) {
    const data = [
        stockSummary[STOCK_STATUS.AVAILABLE],
        stockSummary[STOCK_STATUS.LOW],
        stockSummary[STOCK_STATUS.OUT]
    ];

    if (stockStatusChart) {
        stockStatusChart.data.datasets[0].data = data;
        stockStatusChart.update();
        return;
    }

    stockStatusChart = new Chart(
        elements.stockStatusChart,
        {
            type: "doughnut",

            data: {
                labels: [
                    "Em estoque",
                    "Estoque baixo",
                    "Sem estoque"
                ],

                datasets: [
                    {
                        data,
                        backgroundColor: [
                            "#16a34a",
                            "#d97706",
                            "#dc2626"
                        ],
                        borderWidth: 0
                    }
                ]
            },

            options: {
                responsive: true,
                maintainAspectRatio: false,
                cutout: "68%",

                plugins: {
                    legend: {
                        position: "bottom"
                    }
                }
            }
        }
    );
}


function renderMovementsChart(movementSummary) {
    const data = [
        movementSummary[MOVEMENT_TYPES.ENTRY],
        movementSummary[MOVEMENT_TYPES.EXIT]
    ];

    if (movementsChart) {
        movementsChart.data.datasets[0].data = data;
        movementsChart.update();
        return;
    }

    movementsChart = new Chart(
        elements.movementsChart,
        {
            type: "bar",

            data: {
                labels: [
                    "Entradas",
                    "Saídas"
                ],

                datasets: [
                    {
                        label: "Movimentações",
                        data,
                        backgroundColor: [
                            "#16a34a",
                            "#dc2626"
                        ],
                        borderRadius: 6,
                        borderSkipped: false
                    }
                ]
            },

            options: {
                responsive: true,
                maintainAspectRatio: false,

                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            precision: 0
                        }
                    }
                },

                plugins: {
                    legend: {
                        display: false
                    }
                }
            }
        }
    );
}


export function renderDashboard() {
    const materials = getMaterials();
    const movements = getMovements();
    const requests = getRequests();

    const stockSummary =
        getStockSummary(materials);

    const movementSummary =
        getMovementSummary(movements);

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

    renderStockStatusChart(stockSummary);
    renderMovementsChart(movementSummary);
}


export function initDashboard() {
    renderDashboard();
}


export function refreshDashboard() {
    renderDashboard();
}