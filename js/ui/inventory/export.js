import {
    getMaterials,
    getStockStatus
} from "../../inventory/materials.js";

import {
    getStockStatusLabel
} from "../../utils/formatters.js";

import {
    createCsvContent,
    createCsvFilename,
    downloadCsv
} from "../../utils/csv.js";


function formatCsvDate(date) {
    if (!date) return "";

    return new Intl.DateTimeFormat("pt-BR").format(
        new Date(date)
    );
}


export function exportInventoryCsv() {
    const materials = getMaterials();

    if (materials.length === 0) {
        return false;
    }

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

    const content =
        createCsvContent(headers, rows);

    const filename =
        createCsvFilename("estoque-digitec");

    downloadCsv(content, filename);

    return true;
}