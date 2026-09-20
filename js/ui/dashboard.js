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

function getCssVariable(variable) {
    return getComputedStyle(
        document.documentElement
    )
        .getPropertyValue(variable)
        .trim();
}

function getChartColors() {
    return {
        text:
            getCssVariable("--color-text-secondary"),

        border:
            getCssVariable("--color-border"),

        success:
            getCssVariable("--color-success"),

        warning:
            getCssVariable("--color-warning"),

        danger:
            getCssVariable("--color-danger")
    };
}

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
    const colors = getChartColors();

    const data = [
        stockSummary[STOCK_STATUS.AVAILABLE],
        stockSummary[STOCK_STATUS.LOW],
        stockSummary[STOCK_STATUS.OUT]
    ];

    if (stockStatusChart) {
        stockStatusChart.data.datasets[0].data = data;

        stockStatusChart.data.datasets[0].backgroundColor = [
            colors.success,
            colors.warning,
            colors.danger
        ];

        stockStatusChart.options.plugins.legend.labels.color =
            colors.text;

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
                            colors.success,
                            colors.warning,
                            colors.danger
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
                        position: "bottom",
                        labels: {
                            color: colors.text
                        }
                    }
                }
            }
        }
    );
}


function renderMovementsChart(movementSummary) {
    const colors = getChartColors();

    const data = [
        movementSummary[MOVEMENT_TYPES.ENTRY],
        movementSummary[MOVEMENT_TYPES.EXIT]
    ];

    if (movementsChart) {
        movementsChart.data.datasets[0].data = data;

        movementsChart.data.datasets[0].backgroundColor = [
            colors.success,
            colors.danger
        ];

        movementsChart.options.scales.x.ticks.color =
            colors.text;

        movementsChart.options.scales.y.ticks.color =
            colors.text;

        movementsChart.options.scales.x.grid.color =
            colors.border;

        movementsChart.options.scales.y.grid.color =
            colors.border;

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
                            colors.success,
                            colors.danger
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
                    x: {
                        ticks: {
                            color: colors.text
                        },
                        grid: {
                            color: colors.border
                        }
                    },
                    y: {
                        beginAtZero: true,
                        ticks: {
                            precision: 0,
                            color: colors.text
                        },
                        grid: {
                            color: colors.border
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

    document.addEventListener(
        "app:theme-changed",
        renderDashboard
    );
}

export function refreshDashboard() {
    renderDashboard();
}