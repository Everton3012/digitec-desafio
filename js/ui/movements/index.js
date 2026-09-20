import {
    initMovementForm,
    openMovementForm
} from "./form.js";

import {
    openExportDialog
} from "../export-dialog.js";

import {
    exportMovementsCsv
} from "./export.js";

import {
    showToast
} from "../feedback.js";

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

    const exportButton =
        document.querySelector("#export-movements");

    exportButton.addEventListener("click", () => {
        openExportDialog({
            title: "Exportar movimentações",

            onExport: ({
                           startDate,
                           endDate
                       }) => {
                const exported =
                    exportMovementsCsv({
                        startDate,
                        endDate
                    });

                if (!exported) {
                    showToast(
                        "Não há movimentações no período selecionado.",
                        "warning"
                    );

                    return false;
                }

                showToast(
                    "Movimentações exportadas com sucesso.",
                    "success"
                );

                return true;
            }
        });
    });
}

export function refreshMovementsUI() {
    renderMovements();
}