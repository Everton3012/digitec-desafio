const container =
    document.querySelector("#toast-container");

const TOAST_DURATION = 3500;

export function showToast(
    message,
    type = "success"
) {
    const toast =
        document.createElement("div");

    toast.className =
        `toast toast-${type}`;

    toast.setAttribute("role", "status");

    toast.innerHTML = `
        <span>${message}</span>

        <button
            type="button"
            class="toast-close"
            aria-label="Fechar notificação"
        >
            &times;
        </button>
    `;

    container.appendChild(toast);

    const closeButton =
        toast.querySelector(".toast-close");

    const timeout = setTimeout(
        () => removeToast(toast),
        TOAST_DURATION
    );

    closeButton.addEventListener(
        "click",
        () => {
            clearTimeout(timeout);
            removeToast(toast);
        }
    );
}

function removeToast(toast) {
    toast.classList.add("toast-leaving");

    toast.addEventListener(
        "animationend",
        () => toast.remove(),
        {
            once: true
        }
    );
}