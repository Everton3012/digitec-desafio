import {
    initDeliveryForm
} from "./form.js";

import {
    initDeliveriesTable,
    renderDeliveries
} from "./table.js";

import {
    initDeliveryDetails
} from "./delivery-details.js";

import {
    openExportDialog
} from "../export-dialog.js";

import {
    exportDeliveriesCsv
} from "./export.js";

import {
    showToast
} from "../feedback.js";

export function initDeliveriesUI() {
    initDeliveryForm();
    initDeliveryDetails();
    initDeliveriesTable();

    const exportButton =
        document.querySelector("#export-deliveries");

    exportButton.addEventListener("click", () => {
        openExportDialog({
            title: "Exportar entregas",

            onExport: ({
                startDate,
                endDate
            }) => {
                const exported =
                    exportDeliveriesCsv({
                        startDate,
                        endDate
                    });

                if (!exported) {
                    showToast(
                        "Não há entregas no período selecionado.",
                        "warning"
                    );

                    return false;
                }

                showToast(
                    "Entregas exportadas com sucesso.",
                    "success"
                );

                return true;
            }
        });
    });
}

export function refreshDeliveriesUI() {
    renderDeliveries();
}