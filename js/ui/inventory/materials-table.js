import {
    getMaterials,
    getStockStatus,
    removeMaterial
} from "../../inventory/materials.js";

import {
    getStockStatusLabel
} from "../../utils/formatters.js";

import {
    APP_EVENTS
} from "../../constants/events.js";

import {
    openMovementForm
} from "../movements/index.js";

import {
    openMaterialEditForm
} from "./material-form.js";

const tableBody =
    document.querySelector("#materials-table-body");

const searchInput =
    document.querySelector("#material-search");

const categoryFilter =
    document.querySelector("#category-filter");

const stockFilter =
    document.querySelector("#stock-filter");

function notifyDataChanged() {
    document.dispatchEvent(
        new CustomEvent(APP_EVENTS.DATA_CHANGED)
    );
}

function getFilteredMaterials() {
    const searchTerm =
        searchInput.value
            .trim()
            .toLowerCase();

    const category =
        categoryFilter.value;

    const stockStatus =
        stockFilter.value;

    return getMaterials().filter((material) => {
        const matchesSearch =
            material.name
                .toLowerCase()
                .includes(searchTerm);

        const matchesCategory =
            !category ||
            material.category === category;

        const matchesStock =
            !stockStatus ||
            getStockStatus(material) === stockStatus;

        return (
            matchesSearch &&
            matchesCategory &&
            matchesStock
        );
    });
}

function createMaterialRow(material) {
    const status =
        getStockStatus(material);

    const row =
        document.createElement("tr");

    row.innerHTML = `
        <td>${material.name}</td>
        <td>${material.category}</td>
        <td>${material.quantity}</td>
        <td>${material.unit}</td>

        <td>
            <span class="badge badge-${status}">
                ${getStockStatusLabel(status)}
            </span>
        </td>

        <td class="table-actions">
            <button
                type="button"
                data-action="movement"
                data-id="${material.id}"
            >
                Movimentar
            </button>

            <button
                type="button"
                data-action="edit"
                data-id="${material.id}"
            >
                Editar
            </button>

            <button
                type="button"
                data-action="delete"
                data-id="${material.id}"
            >
                Excluir
            </button>
        </td>
    `;

    return row;
}

export function renderMaterials() {
    const materials =
        getFilteredMaterials();

    tableBody.innerHTML = "";

    if (!materials.length) {
        tableBody.innerHTML = `
            <tr>
                <td colspan="6">
                    Nenhum material encontrado.
                </td>
            </tr>
        `;

        return;
    }

    materials.forEach((material) => {
        tableBody.appendChild(
            createMaterialRow(material)
        );
    });
}

export function renderCategoryFilter() {
    const selectedCategory =
        categoryFilter.value;

    const categories = [
        ...new Set(
            getMaterials()
                .map((material) => material.category)
                .filter(Boolean)
        )
    ].sort((a, b) =>
        a.localeCompare(b, "pt-BR")
    );

    categoryFilter.innerHTML =
        '<option value="">Todas</option>';

    categories.forEach((category) => {
        const option =
            document.createElement("option");

        option.value = category;
        option.textContent = category;

        categoryFilter.appendChild(option);
    });

    if (categories.includes(selectedCategory)) {
        categoryFilter.value =
            selectedCategory;
    }
}

function handleTableAction(event) {
    const button =
        event.target.closest(
            "button[data-action]"
        );

    if (!button) {
        return;
    }

    const { action, id } =
        button.dataset;

    if (action === "movement") {
        openMovementForm(id);
        return;
    }

    if (action === "edit") {
        openMaterialEditForm(id);
        return;
    }

    if (action !== "delete") {
        return;
    }

    const confirmed = confirm(
        "Deseja realmente excluir este material?"
    );

    if (!confirmed) {
        return;
    }

    try {
        removeMaterial(id);
        notifyDataChanged();
    } catch (error) {
        alert(error.message);
    }
}

export function initMaterialsTable() {
    searchInput.addEventListener(
        "input",
        renderMaterials
    );

    categoryFilter.addEventListener(
        "change",
        renderMaterials
    );

    stockFilter.addEventListener(
        "change",
        renderMaterials
    );

    tableBody.addEventListener(
        "click",
        handleTableAction
    );

    renderCategoryFilter();
    renderMaterials();
}