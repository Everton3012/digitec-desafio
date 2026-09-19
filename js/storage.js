export const STORAGE_KEYS = Object.freeze({
    MATERIALS: "digitec_materials",
    MOVEMENTS: "digitec_movements",
    REQUESTS: "digitec_requests"
});

export function getData(key) {
    try {
        const storedData = localStorage.getItem(key);

        if (!storedData) {
            return [];
        }

        return JSON.parse(storedData);
    } catch (error) {
        console.error(
            `Erro ao recuperar "${key}" do armazenamento:`,
            error
        );

        return [];
    }
}

export function saveData(key, data) {
    try {
        localStorage.setItem(
            key,
            JSON.stringify(data)
        );
    } catch (error) {
        console.error(
            `Erro ao salvar "${key}" no armazenamento:`,
            error
        );

        throw new Error(
            "Não foi possível salvar os dados."
        );
    }
}