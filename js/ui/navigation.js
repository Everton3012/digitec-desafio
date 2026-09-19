const navigationButtons =
    document.querySelectorAll(
        ".sidebar-nav button"
    );

const sections =
    document.querySelectorAll(
        ".page-section"
    );

export function showSection(sectionId) {
    sections.forEach((section) => {
        section.hidden =
            section.id !== sectionId;
    });

    navigationButtons.forEach((button) => {
        button.classList.toggle(
            "active",
            button.dataset.section === sectionId
        );
    });
}

export function initNavigation() {
    navigationButtons.forEach((button) => {
        button.addEventListener(
            "click",
            () => {
                showSection(
                    button.dataset.section
                );
            }
        );
    });

    showSection("dashboard");
}