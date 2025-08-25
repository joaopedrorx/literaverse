document.addEventListener('DOMContentLoaded', function() {
    const btn = document.getElementById("toggle-theme");

    if (btn) {
        // Aplica o tema salvo
        const saved = localStorage.getItem("tema");
        if (saved === "escuro") {
            document.body.classList.add("dark-mode");
        }

        // Alterna a cor (modo escuro)
        btn.addEventListener("click", () => {
            document.body.classList.toggle("dark-mode");
            const escuro = document.body.classList.contains("dark-mode");
            localStorage.setItem("tema", escuro ? "escuro" : "claro");
            // Não muda o texto do botão
        });
    }
});
