function openModal() {
    document.getElementById("maintenanceModal").style.display = "flex";
}

function closeModal() {
    document.getElementById("maintenanceModal").style.display = "none";
}

window.onclick = function(event) {
    const modal = document.getElementById("maintenanceModal");

    if (event.target === modal) {
        closeModal();
    }
};

// في حال عندك event لتغيير اللغة
document.addEventListener("languageChanged", function() {
    if (typeof updateTranslations === "function") {
        updateTranslations();
    }
});