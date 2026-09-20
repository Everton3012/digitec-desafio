export function escapeCsvValue(value) {
    const text = String(value ?? "");

    return `"${text.replaceAll('"', '""')}"`;
}

export function createCsvContent(headers, rows) {
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

export function downloadCsv(content, filename) {
    const blob = new Blob(
        ["\uFEFF", content],
        {
            type: "text/csv;charset=utf-8;"
        }
    );

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = filename;

    document.body.appendChild(link);

    link.click();
    link.remove();

    URL.revokeObjectURL(url);
}

export function createCsvFilename(prefix) {
    const date = new Date()
        .toISOString()
        .slice(0, 10);

    return `${prefix}-${date}.csv`;
}