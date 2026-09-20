import {
    getMaterials,
    getMaterialById,
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

import {
    openMaterialDetails
} from "./material-details.js";

import {
    showToast
} from "../feedback.js";

import {
    confirmAction
} from "../confirm.js";

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

function renderIcons() {
    if (window.lucide) {
        window.lucide.createIcons();
    }
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
    
        <td class="desktop-only">
            ${material.category}
        </td>
    
        <td class="desktop-only">
            ${material.quantity} ${material.unit}
        </td>
    
        <td class="desktop-only">
            <span class="badge badge-${status}">
                ${getStockStatusLabel(status)}
            </span>
        </td>
    
        <td class="table-actions">
            <button
                type="button"
                class="icon-button"
                data-action="details"
                data-id="${material.id}"
                aria-label="Ver detalhes de ${material.name}"
                title="Ver detalhes"
            >
                <i data-lucide="ellipsis" aria-hidden="true"></i>
            </button>
    
            <button
                type="button"
                class="icon-button"
                data-action="movement"
                data-id="${material.id}"
                aria-label="Movimentar estoque de ${material.name}"
                title="Movimentar estoque"
            >
                <i data-lucide="arrow-right-left" aria-hidden="true"></i>
            </button>
    
            <button
                type="button"
                class="icon-button"
                data-action="edit"
                data-id="${material.id}"
                aria-label="Editar ${material.name}"
                title="Editar"
            >
                <i data-lucide="pencil" aria-hidden="true"></i>
            </button>
    
            <button
                type="button"
                class="icon-button icon-button-danger"
                data-action="delete"
                data-id="${material.id}"
                aria-label="Excluir ${material.name}"
                title="Excluir"
            >
                <i data-lucide="trash-2" aria-hidden="true"></i>
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
                <td colspan="5">
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

    renderIcons();
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

async function handleTableAction(event) {
    const button =
        event.target.closest(
            "button[data-action]"
        );

    if (!button) {
        return;
    }

    const { action, id } =
        button.dataset;

    if (action === "details") {
        openMaterialDetails(id);
        return;
    }

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

    const material =
        getMaterialById(id);

    if (!material) {
        showToast(
            "Material não encontrado.",
            "error"
        );

        return;
    }

    const confirmed =
        await confirmAction({
            title: "Excluir material",
            message:
                "Esta ação removerá o material do estoque. O histórico de movimentações será mantido.",
            confirmText: "Excluir",
            details: [
                {
                    label: "Material",
                    value: material.name
                },
                {
                    label: "Quantidade atual",
                    value: `${material.quantity} ${material.unit}`
                }
            ]
        });

    if (!confirmed) {
        return;
    }

    try {
        removeMaterial(id);

        notifyDataChanged();

        showToast(
            "Material excluído com sucesso."
        );
    } catch (error) {
        showToast(
            error.message,
            "error"
        );
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