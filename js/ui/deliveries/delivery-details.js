import {
    getDeliveryById
} from "../../deliveries/deliveries.js";

import {
    formatDate,
    formatTime,
    getDeliveryStatusLabel,
    getDeliveryTypeLabel
} from "../../utils/formatters.js";

const dialog = document.querySelector("#delivery-details-dialog");
const closeButton = document.querySelector("#close-delivery-details");

const fields = {
    recipient: document.querySelector("#delivery-detail-recipient"),
    type: document.querySelector("#delivery-detail-type"),
    sender: document.querySelector("#delivery-detail-sender"),
    date: document.querySelector("#delivery-detail-date"),
    time: document.querySelector("#delivery-detail-time"),
    status: document.querySelector("#delivery-detail-status"),
    notes: document.querySelector("#delivery-detail-notes")
};

export function openDeliveryDetails(id) {
    const delivery = getDeliveryById(id);

    if (!delivery) {
        return;
    }

    fields.recipient.textContent = delivery.recipient;
    fields.type.textContent = getDeliveryTypeLabel(delivery.type);
    fields.sender.textContent = delivery.sender;
    fields.date.textContent = formatDate(delivery.receivedAt);
    fields.time.textContent = formatTime(delivery.receivedAt);
    fields.status.textContent = getDeliveryStatusLabel(delivery.status);
    fields.notes.textContent = delivery.notes || "Sem observações";

    dialog.showModal();
}

function closeDeliveryDetails() {
    if (dialog.open) {
        dialog.close();
    }
}

export function initDeliveryDetails() {
    closeButton.addEventListener("click", closeDeliveryDetails);

    dialog.addEventListener("cancel", (event) => {
        event.preventDefault();
        closeDeliveryDetails();
    });

    dialog.addEventListener("click", (event) => {
        if (event.target === dialog) {
            closeDeliveryDetails();
        }
    });
}
