import { initTheme } from "./ui/theme.js";
import { APP_EVENTS } from "./constants/events.js";
import {
    initExportDialog
} from "./ui/export-dialog.js";
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
    initDeliveriesUI,
    refreshDeliveriesUI
} from "./ui/deliveries/index.js";
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
    refreshDeliveriesUI();
    refreshDashboard();
    renderIcons();
}

function initApplication() {
    initTheme();
    initInventoryUI();
    initMovementsUI();
    initRequestsUI();
    initDeliveriesUI();
    initDashboard();
    initNavigation();
    initExportDialog();
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