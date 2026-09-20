const THEME_KEY = "digitec_theme";

const THEMES = Object.freeze({
    LIGHT: "light",
    DARK: "dark"
});

const toggleButton =
    document.querySelector("#theme-toggle");

const toggleLabel =
    document.querySelector("#theme-toggle-label");

function getCurrentTheme() {
    return document.documentElement.dataset.theme === THEMES.DARK
        ? THEMES.DARK
        : THEMES.LIGHT;
}

function updateToggle(theme) {
    const isDark = theme === THEMES.DARK;

    toggleLabel.textContent =
        isDark ? "Tema claro" : "Tema escuro";

    toggleButton.setAttribute(
        "aria-label",
        isDark
            ? "Ativar tema claro"
            : "Ativar tema escuro"
    );

    toggleButton.innerHTML = `
        <i
            data-lucide="${isDark ? "sun" : "moon"}"
            aria-hidden="true"
        ></i>
        <span id="theme-toggle-label">
            ${isDark ? "Tema claro" : "Tema escuro"}
        </span>
    `;

    lucide.createIcons();
}

function applyTheme(theme) {
    if (theme === THEMES.DARK) {
        document.documentElement.dataset.theme =
            THEMES.DARK;
    } else {
        delete document.documentElement.dataset.theme;
    }

    updateToggle(theme);
}

function toggleTheme() {
    const currentTheme = getCurrentTheme();

    const newTheme =
        currentTheme === THEMES.DARK
            ? THEMES.LIGHT
            : THEMES.DARK;

    localStorage.setItem(THEME_KEY, newTheme);

    applyTheme(newTheme);

    document.dispatchEvent(
        new CustomEvent("app:theme-changed", {
            detail: {
                theme: newTheme
            }
        })
    );
}

export function initTheme() {
    const savedTheme =
        localStorage.getItem(THEME_KEY);

    const initialTheme =
        savedTheme === THEMES.DARK
            ? THEMES.DARK
            : THEMES.LIGHT;

    applyTheme(initialTheme);

    toggleButton.addEventListener(
        "click",
        toggleTheme
    );
}