const dialog =
    document.querySelector("#confirm-dialog");

const title =
    document.querySelector("#confirm-title");

const message =
    document.querySelector("#confirm-message");

const details =
    document.querySelector("#confirm-details");

const confirmButton =
    document.querySelector("#confirm-action");

const cancelButton =
    document.querySelector("#confirm-cancel");

const closeButton =
    document.querySelector("#close-confirm-dialog");

let resolveConfirmation = null;

export function confirmAction({
    title: dialogTitle = "Confirmar ação",
    message: dialogMessage,
    confirmText = "Confirmar",
    details: dialogDetails = [],
    variant = "danger"
}) {
    title.textContent = dialogTitle;
    message.textContent = dialogMessage;
    confirmButton.textContent = confirmText;

    confirmButton.classList.remove(
        "button-danger",
        "button-primary"
    );

    confirmButton.classList.add(
        variant === "danger"
            ? "button-danger"
            : "button-primary"
    );

    renderDetails(dialogDetails);

    dialog.showModal();

    return new Promise((resolve) => {
        resolveConfirmation = resolve;
    });
}

function renderDetails(dialogDetails) {
    details.innerHTML = "";

    if (!dialogDetails.length) {
        details.hidden = true;
        return;
    }

    dialogDetails.forEach((detail) => {
        const item =
            document.createElement("div");

        item.className =
            "confirm-detail-item";

        const label =
            document.createElement("span");

        label.textContent =
            detail.label;

        const value =
            document.createElement("strong");

        value.textContent =
            detail.value;

        item.append(
            label,
            value
        );

        details.appendChild(item);
    });

    details.hidden = false;
}

function finishConfirmation(result) {
    if (!resolveConfirmation) {
        return;
    }

    const resolve =
        resolveConfirmation;

    resolveConfirmation = null;

    dialog.close();

    resolve(result);
}

confirmButton.addEventListener(
    "click",
    () => {
        finishConfirmation(true);
    }
);

cancelButton.addEventListener(
    "click",
    () => {
        finishConfirmation(false);
    }
);

closeButton.addEventListener(
    "click",
    () => {
        finishConfirmation(false);
    }
);

dialog.addEventListener(
    "cancel",
    (event) => {
        event.preventDefault();
        finishConfirmation(false);
    }
);