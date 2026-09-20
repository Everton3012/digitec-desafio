import {
    addDelivery
} from "../../deliveries/deliveries.js";

import {
    APP_EVENTS
} from "../../constants/events.js";

import {
    showToast
} from "../feedback.js";

const dialog = document.querySelector("#delivery-dialog");
const form = document.querySelector("#delivery-form");
const newButton = document.querySelector("#new-delivery");
const closeButton = document.querySelector("#close-delivery-dialog");
const cancelButton = document.querySelector("#cancel-delivery");

const fields = {
    recipient: document.querySelector("#delivery-recipient"),
    type: document.querySelector("#delivery-type"),
    sender: document.querySelector("#delivery-sender"),
    date: document.querySelector("#delivery-date"),
    time: document.querySelector("#delivery-time"),
    notes: document.querySelector("#delivery-notes")
};

function notifyDataChanged() {
    document.dispatchEvent(
        new CustomEvent(APP_EVENTS.DATA_CHANGED)
    );
}

function setCurrentDateTime() {
    const now = new Date();
    const offset = now.getTimezoneOffset() * 60000;
    const local = new Date(now.getTime() - offset);

    fields.date.value = local.toISOString().slice(0, 10);
    fields.time.value = local.toISOString().slice(11, 16);
}

function openDeliveryForm() {
    form.reset();
    setCurrentDateTime();
    dialog.showModal();
}

function closeDeliveryForm() {
    if (dialog.open) {
        dialog.close();
    }
}

function handleSubmit(event) {
    event.preventDefault();

    const receivedAt = `${fields.date.value}T${fields.time.value}`;

    try {
        addDelivery({
            recipient: fields.recipient.value,
            type: fields.type.value,
            sender: fields.sender.value,
            receivedAt,
            notes: fields.notes.value
        });

        closeDeliveryForm();
        notifyDataChanged();
        showToast("Entrega registrada com sucesso.");
    } catch (error) {
        showToast(error.message, "error");
    }
}

export function initDeliveryForm() {
    newButton.addEventListener("click", openDeliveryForm);
    closeButton.addEventListener("click", closeDeliveryForm);
    cancelButton.addEventListener("click", closeDeliveryForm);
    form.addEventListener("submit", handleSubmit);
}
