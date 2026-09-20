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

import {
    openExportDialog
} from "../export-dialog.js";

import {
    exportRequestsCsv
} from "./export.js";

import {
    showToast
} from "../feedback.js";

export function initRequestsUI() {
    initRequestForm();
    initRequestDetails();
    initRequestsTable();

    const exportButton =
        document.querySelector("#export-requests");

    exportButton.addEventListener("click", () => {
        openExportDialog({
            title: "Exportar solicitações",

            onExport: ({
                startDate,
                endDate
            }) => {
                const exported =
                    exportRequestsCsv({
                        startDate,
                        endDate
                    });

                if (!exported) {
                    showToast(
                        "Não há solicitações no período selecionado.",
                        "warning"
                    );

                    return false;
                }

                showToast(
                    "Solicitações exportadas com sucesso.",
                    "success"
                );

                return true;
            }
        });
    });
}

export function refreshRequestsUI() {
    renderRequests();
}