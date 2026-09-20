import {
    getMaterials,
    getStockStatus
} from "../../inventory/materials.js";

import {
    getStockStatusLabel
} from "../../utils/formatters.js";


function escapeCsvValue(value) {
    const text = String(value ?? "");

    return `"${text.replaceAll('"', '""')}"`;
}


function formatCsvDate(date) {
    if (!date) return "";

    return new Intl.DateTimeFormat("pt-BR").format(
        new Date(date)
    );
}


function createCsvContent(materials) {
    const headers = [
        "Material",
        "Categoria",
        "Quantidade",
        "Estoque mínimo",
        "Unidade",
        "Situação",
        "Local de armazenamento",
        "Última reposição",
        "Observações"
    ];

    const rows = materials.map((material) => [
        material.name,
        material.category,
        material.quantity,
        material.minimumStock,
        material.unit,
        getStockStatusLabel(
            getStockStatus(material)
        ),
        material.storageLocation,
        formatCsvDate(material.lastRestock),
        material.notes
    ]);

    return [
        headers,
        ...rows
    ]
        .map((row) =>
            row
                .map(escapeCsvValue)
                .join(";")
        )
        .join("\n");
}


function downloadCsv(content) {
    const blob = new Blob(
        ["\uFEFF", content],
        {
            type: "text/csv;charset=utf-8;"
        }
    );

    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");

    const date = new Date()
        .toISOString()
        .slice(0, 10);

    link.href = url;
    link.download =
        `estoque-digitec-${date}.csv`;

    document.body.appendChild(link);

    link.click();
    link.remove();

    URL.revokeObjectURL(url);
}


export function exportInventoryCsv() {
    const materials = getMaterials();

    if (materials.length === 0) {
        return false;
    }

    const content =
        createCsvContent(materials);

    downloadCsv(content);

    return true;
}