const navigationButtons =
    document.querySelectorAll(
        ".sidebar-nav button"
    );

const sections =
    document.querySelectorAll(
        ".page-section"
    );

const sidebar =
    document.querySelector(
        "#sidebar"
    );

const menuButton =
    document.querySelector(
        "#mobile-menu-button"
    );

const closeButton =
    document.querySelector(
        "#mobile-menu-close"
    );

const overlay =
    document.querySelector(
        "#sidebar-overlay"
    );

function isMobile() {
    return window.matchMedia(
        "(max-width: 700px)"
    ).matches;
}

function openMobileMenu() {
    if (!isMobile()) {
        return;
    }

    sidebar.classList.add(
        "sidebar-open"
    );

    overlay.hidden = false;

    menuButton.setAttribute(
        "aria-expanded",
        "true"
    );

    document.body.classList.add(
        "menu-open"
    );
}

function closeMobileMenu() {
    sidebar.classList.remove(
        "sidebar-open"
    );

    overlay.hidden = true;

    menuButton.setAttribute(
        "aria-expanded",
        "false"
    );

    document.body.classList.remove(
        "menu-open"
    );
}

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

function handleNavigation(button) {
    showSection(
        button.dataset.section
    );

    if (isMobile()) {
        closeMobileMenu();
    }
}

function handleEscape(event) {
    if (
        event.key === "Escape" &&
        sidebar.classList.contains(
            "sidebar-open"
        )
    ) {
        closeMobileMenu();
        menuButton.focus();
    }
}

function handleResize() {
    if (!isMobile()) {
        closeMobileMenu();
    }
}

export function initNavigation() {
    navigationButtons.forEach((button) => {
        button.addEventListener(
            "click",
            () => {
                handleNavigation(button);
            }
        );
    });

    menuButton.addEventListener(
        "click",
        openMobileMenu
    );

    closeButton.addEventListener(
        "click",
        closeMobileMenu
    );

    overlay.addEventListener(
        "click",
        closeMobileMenu
    );

    document.addEventListener(
        "keydown",
        handleEscape
    );

    window.addEventListener(
        "resize",
        handleResize
    );

    showSection("dashboard");
}