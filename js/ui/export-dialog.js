const dialog =
    document.querySelector("#export-dialog");

const form =
    document.querySelector("#export-form");

const title =
    document.querySelector("#export-dialog-title");

const startDate =
    document.querySelector("#export-start-date");

const endDate =
    document.querySelector("#export-end-date");

const closeButton =
    document.querySelector("#close-export-dialog");

const cancelButton =
    document.querySelector("#cancel-export");

let exportHandler = null;

function closeDialog() {
    if (dialog.open) {
        dialog.close();
    }

    form.reset();
    exportHandler = null;
}

export function openExportDialog({
    title: dialogTitle,
    onExport
}) {
    title.textContent = dialogTitle;
    exportHandler = onExport;

    form.reset();

    dialog.showModal();
}

export function initExportDialog() {
    closeButton.addEventListener(
        "click",
        closeDialog
    );

    cancelButton.addEventListener(
        "click",
        closeDialog
    );

    dialog.addEventListener(
        "cancel",
        (event) => {
            event.preventDefault();
            closeDialog();
        }
    );

    dialog.addEventListener(
        "click",
        (event) => {
            if (event.target === dialog) {
                closeDialog();
            }
        }
    );

    form.addEventListener(
        "submit",
        (event) => {
            event.preventDefault();

            if (!exportHandler) {
                return;
            }

            const start = startDate.value;
            const end = endDate.value;

            if (start > end) {
                endDate.setCustomValidity(
                    "A data final deve ser igual ou posterior à data inicial."
                );

                endDate.reportValidity();
                return;
            }

            endDate.setCustomValidity("");

            const exported = exportHandler({
                startDate: start,
                endDate: end
            });

            if (exported) {
                closeDialog();
            }
        }
    );

    endDate.addEventListener("input", () => {
        endDate.setCustomValidity("");
    });

    startDate.addEventListener("input", () => {
        endDate.setCustomValidity("");
    });
}