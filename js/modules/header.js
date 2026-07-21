// MENU HAMBURGUER
export function initHeader() {
    const hamburger = document.querySelector(".hamburger");
    const menu = document.querySelector(".menu");
    const header = document.querySelector(".header");

    if (hamburger && menu) {
        hamburger.addEventListener("click", () => {
            if (menu.classList.contains("active")) {
                // Se está aberto, vamos fechar com animação
                hamburger.classList.remove("active");
                menu.classList.remove("active");
                menu.classList.add("closing");
                document.body.style.overflow = "auto";

                // Remove a classe de fechamento após a animação acabar (400ms)
                setTimeout(() => {
                    menu.classList.remove("closing");
                }, 400);
            } else {
                // Se está fechado, abre direto
                hamburger.classList.add("active");
                menu.classList.add("active");
                document.body.style.overflow = "hidden";
            }
        });

        document.querySelectorAll(".menu ul li a").forEach(link => {
            link.addEventListener("click", () => {
                hamburger.classList.remove("active");
                menu.classList.remove("active");
                document.body.style.overflow = "auto"; // Garante que a rolagem volte ao normal ao clicar em um link
            });
        });
    }

    // ESCONDE O HEADER
    if (header) {
        let lastScrollTop = 0;
        let ticking = false;

        const handleScroll = () => {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            const isMenuOpen = menu && menu.classList.contains("active");

            if (scrollTop > lastScrollTop && scrollTop > 100 && !isMenuOpen) {
                header.classList.add("hide");
            } else {
                header.classList.remove("hide");
            }

            lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
            ticking = false;
        };

        window.addEventListener("scroll", () => {
            if (!ticking) {
                window.requestAnimationFrame(handleScroll);
                ticking = true;
            }
        });
    }
}