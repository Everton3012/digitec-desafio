export const STOCK_STATUS = Object.freeze({
    AVAILABLE: "available",
    LOW: "low",
    OUT: "out"
});

export const MOVEMENT_TYPES = Object.freeze({
    ENTRY: "entry",
    EXIT: "exit"
});

export const REQUEST_STATUS = Object.freeze({
    PENDING: "pending",
    APPROVED: "approved",
    DELIVERED: "delivered",
    CANCELLED: "cancelled"
});

export const REQUEST_PRIORITY = Object.freeze({
    LOW: "low",
    MEDIUM: "medium",
    HIGH: "high"
});

export const DELIVERY_TYPES = Object.freeze({
    PACKAGE: "package",
    DOCUMENT: "document",
    CORRESPONDENCE: "correspondence",
    OTHER: "other"
});

export const DELIVERY_STATUS = Object.freeze({
    RECEIVED: "received",
    NOTIFIED: "notified",
    WITHDRAWN: "withdrawn",
    CANCELLED: "cancelled"
});
