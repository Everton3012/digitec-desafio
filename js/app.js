// js/app.js

import { APP_EVENTS } from "./constants/events.js";
import {
    initInventoryUI,
    refreshInventoryUI
} from "./ui/inventory/inventory-ui.js";
import {
    initMovementsUI,
    refreshMovementsUI
} from "./ui/movements/index.js";
import {
    initRequestsUI,
    refreshRequestsUI
} from "./ui/requests/index.js";
import {
    initDashboard,
    refreshDashboard
} from "./ui/dashboard.js";
import {
    initNavigation
} from "./ui/navigation.js";

function renderIcons() {
    lucide.createIcons();
}

function refreshApplication() {
    refreshInventoryUI();
    refreshMovementsUI();
    refreshRequestsUI();
    refreshDashboard();

    renderIcons();
}

function initApplication() {
    initInventoryUI();
    initMovementsUI();
    initRequestsUI();
    initDashboard();
    initNavigation();

    renderIcons();

    document.addEventListener(
        APP_EVENTS.DATA_CHANGED,
        refreshApplication
    );
}

document.addEventListener(
    "DOMContentLoaded",
    initApplication
);