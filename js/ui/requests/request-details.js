import {
    getRequestById
} from "../../requests/requests.js";

import {
    formatDate,
    formatTime,
    getPriorityLabel,
    getRequestStatusLabel
} from "../../utils/formatters.js";

const dialog =
    document.querySelector(
        "#request-details-dialog"
    );

const closeButton =
    document.querySelector(
        "#close-request-details"
    );

const fields = {
    employee:
        document.querySelector(
            "#request-detail-employee"
        ),

    material:
        document.querySelector(
            "#request-detail-material"
        ),

    quantity:
        document.querySelector(
            "#request-detail-quantity"
        ),

    date:
        document.querySelector(
            "#request-detail-date"
        ),

    time:
        document.querySelector(
            "#request-detail-time"
        ),

    priority:
        document.querySelector(
            "#request-detail-priority"
        ),

    status:
        document.querySelector(
            "#request-detail-status"
        ),

    deliveredDate:
        document.querySelector(
            "#request-detail-delivered-date"
        ),

    deliveredTime:
        document.querySelector(
            "#request-detail-delivered-time"
        ),

    deliveredDateGroup:
        document.querySelector(
            "#request-detail-delivered-date-group"
        ),

    deliveredTimeGroup:
        document.querySelector(
            "#request-detail-delivered-time-group"
        ),

    notes:
        document.querySelector(
            "#request-detail-notes"
        )
};

export function openRequestDetails(requestId) {
    const request =
        getRequestById(requestId);

    if (!request) {
        return;
    }

    fields.employee.textContent =
        request.employee;

    fields.material.textContent =
        request.materialName;

    fields.quantity.textContent =
        String(request.quantity);

    fields.date.textContent =
        formatDate(request.requestDate);

    fields.time.textContent =
        formatTime(request.requestDate);

    fields.priority.textContent =
        getPriorityLabel(request.priority);

    fields.status.textContent =
        getRequestStatusLabel(request.status);

    fields.notes.textContent =
        request.notes ||
        "Sem observações";

    if (request.deliveredAt) {
        fields.deliveredDate.textContent =
            formatDate(request.deliveredAt);

        fields.deliveredTime.textContent =
            formatTime(request.deliveredAt);

        fields.deliveredDateGroup.hidden =
            false;

        fields.deliveredTimeGroup.hidden =
            false;
    } else {
        fields.deliveredDateGroup.hidden =
            true;

        fields.deliveredTimeGroup.hidden =
            true;
    }

    dialog.showModal();
}

function closeRequestDetails() {
    if (dialog.open) {
        dialog.close();
    }
}

export function initRequestDetails() {
    closeButton.addEventListener(
        "click",
        closeRequestDetails
    );

    dialog.addEventListener(
        "cancel",
        (event) => {
            event.preventDefault();
            closeRequestDetails();
        }
    );

    dialog.addEventListener(
        "click",
        (event) => {
            if (event.target === dialog) {
                closeRequestDetails();
            }
        }
    );
}