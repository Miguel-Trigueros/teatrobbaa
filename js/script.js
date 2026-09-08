class ChicagoDashboard {
  constructor() {
    this.tabButtons = document.querySelectorAll(".tab-btn");
    this.tabPanels = document.querySelectorAll(".tab-panel");
    this.nav = document.querySelector("nav");
    this.elencoButton = document.querySelector("#botonElenco");
    this.contactosButtons = document.querySelectorAll(".botonContactos");
    this.merchButton = document.querySelector("#botonMerch");
    this.frame = document.querySelectorAll(".frame");
    this.menuToggle = document.getElementById("menuToggle");
    this.mainNav = document.getElementById("mainNav");
    this.iconOpen = document.getElementById("iconOpen");
    this.iconClose = document.getElementById("iconClose");
    this.gap = 26;
    this.carouselInterval = null;
    this.currentSlide = 1;
    this.totalSlides = 7;
    this.init();
  }

  init() {
    this.setupEventListeners();
    this.restoreLastTab();
    this.initCarousel();
  }

  setupEventListeners() {
    this.nav.addEventListener("click", (e) => {
      const button = e.target.closest(".tab-btn");
      if (!button) return;
      const tabId = button.getAttribute("data-tab");
      this.switchTab(tabId);
    });

    // Keyboard navigation
    this.nav.addEventListener("keydown", (e) => {
      const button = e.target.closest(".tab-btn");
      if (!button) return;
      if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
        e.preventDefault();
        const buttons = Array.from(this.tabButtons);
        const currentIndex = buttons.indexOf(button);
        let nextIndex;
        if (e.key === "ArrowRight") {
          nextIndex = (currentIndex + 1) % buttons.length;
        } else {
          nextIndex = (currentIndex - 1 + buttons.length) % buttons.length;
        }
        buttons[nextIndex].focus();
        buttons[nextIndex].click();
      }
    });

    //Botones
    this.elencoButton.addEventListener("click", () => {
      this.goToElenco();
    });

    this.contactosButtons.forEach((btn) => {
      btn.addEventListener("click", () => {
        this.goToContactos();
      });
    });

    this.merchButton.addEventListener("click", () => {
      this.goToMerch();
    });

    // Layout bulbs - FIX: Use this.layoutBulbs()
    this.layoutBulbs();
    window.addEventListener("resize", () => this.layoutBulbs());

    // Modal functionality
    // Modal functionality
    const openBtns = document.querySelectorAll(".openBtn");
    const modals = document.querySelectorAll(".detailsModal");

    openBtns.forEach((btn) => {
      btn.addEventListener("click", () => {
        const modal = document.getElementById(btn.dataset.modal);
        if (modal) modal.showModal();
      });
    });

    modals.forEach((modal) => {
      const closeBtn = modal.querySelector(".closeBtn");
      if (closeBtn) {
        closeBtn.addEventListener("click", () => modal.close());
      }

      modal.addEventListener("click", (e) => {
        const rect = modal.getBoundingClientRect();
        const inside =
          e.clientX >= rect.left &&
          e.clientX <= rect.right &&
          e.clientY >= rect.top &&
          e.clientY <= rect.bottom;
        if (!inside) modal.close();
      });
    });

    document.addEventListener("keydown", (e) => {
      if (e.key !== "Escape") return;
      modals.forEach((modal) => {
        if (modal.open) modal.close();
      });
    });

    this.menuToggle.addEventListener("click", () => {
      const isOpen = !this.mainNav.classList.contains("hidden");
      this.mainNav.classList.toggle("hidden");
      this.iconOpen.classList.toggle("hidden");
      this.iconClose.classList.toggle("hidden");
      this.menuToggle.setAttribute("aria-expanded", String(!isOpen));
    });
    this.mainNav.querySelectorAll(".tab-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        if (window.innerWidth < 768) {
          this.mainNav.classList.add("hidden");
          this.iconOpen.classList.remove("hidden");
          this.iconClose.classList.add("hidden");
          this.menuToggle.setAttribute("aria-expanded", "false");
        }
      });
    });
  }

  goToElenco() {
    this.switchTab("elenco");
  }
  goToContactos() {
    this.switchTab("contacto");
  }
  goToMerch() {
    this.switchTab("merch");
  }

  initCarousel() {
    const carouselItems = document.querySelectorAll(".carousel-item");
    carouselItems.forEach((item, index) => {
      if (!item.id) {
        item.id = `slide${index + 1}`;
      }
    });

    this.totalSlides = carouselItems.length;

    if (this.carouselInterval) {
      clearInterval(this.carouselInterval);
    }

    this.carouselInterval = setInterval(() => {
      this.nextSlide();
    }, 2000);
  }

  nextSlide() {
    if (this.totalSlides === 0) return;

    if (this.currentSlide < this.totalSlides) {
      this.currentSlide++;
    } else {
      this.currentSlide = 1;
    }

    // Scroll to the current slide
    this.scrollToSlide(this.currentSlide);
  }

  goToSlide(slideNumber) {
    this.currentSlide = slideNumber;
    this.scrollToSlide(this.currentSlide);
  }

  scrollToSlide(slideNumber) {
    const slideElement = document.getElementById(`slide${slideNumber}`);
    if (slideElement) {
      const carousel = slideElement.closest(".carousel");
      if (carousel) {
        // Calculate the slide's position relative to the carousel
        const slideOffsetLeft = slideElement.offsetLeft - carousel.offsetLeft;

        // Use the calculated position directly (don't add scrollLeft)
        carousel.scrollTo({
          left: slideOffsetLeft,
          behavior: "smooth",
        });
      }
    }
  }

  stopCarousel() {
    if (this.carouselInterval) {
      clearInterval(this.carouselInterval);
    }
  }

  startCarousel() {
    this.stopCarousel();
    this.carouselInterval = setInterval(() => {
      this.nextSlide();
    }, 3000);
  }

  switchTab(tabId) {
    const container = document.getElementById("tab-div");
    container.scrollTo({ top: 0});
    this.tabButtons.forEach((btn) => {
      btn.classList.remove(
        "border-chicago-red",
        "text-chicago-red",
        "font-semibold",
      );
      btn.classList.add("border-transparent", "text-gray-400", "font-medium");
    });

    const activeButton = document.querySelector(`[data-tab="${tabId}"]`);
    if (activeButton) {
      activeButton.classList.remove(
        "border-transparent",
        "text-gray-400",
        "font-medium",
      );
      activeButton.classList.add(
        "border-chicago-red",
        "text-chicago-red",
        "font-semibold",
      );
    }

    this.tabPanels.forEach((panel) => panel.classList.add("hidden"));
    const activePanel = document.getElementById(tabId);
    if (activePanel) {
      activePanel.classList.remove("hidden");

      if (tabId === "inicio") {
        this.currentSlide = 1;
        this.startCarousel();
      }

      // FIX: Re-layout bulbs when merch tab is shown
      if (tabId === "merch") {
        // Use multiple timeouts to ensure the panel is fully rendered
        setTimeout(() => {
          this.layoutBulbs();
        }, 100);

        // Also try again after the panel has settled
        setTimeout(() => {
          this.layoutBulbs();
        }, 300);
      }
    }

    localStorage.setItem("chicago_active_tab", tabId);
  }

  restoreLastTab() {
    const lastTab = localStorage.getItem("chicago_active_tab");
    if (lastTab) {
      const button = document.querySelector(`[data-tab="${lastTab}"]`);
      if (button) button.click();
    }
  }

  layoutBulbs() {
    if (!this.frame) return;
    this.frame.forEach((frame) => {
      frame.querySelectorAll(".bulb").forEach((b) => b.remove());
      const w = frame.offsetWidth;
      const h = frame.offsetHeight;
      const gap = this.gap || 26;

      const left = 4;
      const top = 4;
      const right = w - 10;
      const bottom = h - 10;

      const topLen = Math.max(0, right - left);
      const sideLen = Math.max(0, bottom - top);

      // Number of bulbs per edge, forced even spacing on each edge.
      // Corner bulbs are shared: each edge starts at its own corner and
      // stops just before the next corner, so every corner is placed once.
      const topCount = Math.max(1, Math.round(topLen / gap));
      const sideCount = Math.max(1, Math.round(sideLen / gap));

      const topStep = topLen / topCount;
      const sideStep = sideLen / sideCount;

      const positions = [];

      // Top edge: left -> right
      for (let i = 0; i < topCount; i++)
        positions.push([left + i * topStep, top]);
      // Right edge: top -> bottom
      for (let i = 0; i < sideCount; i++)
        positions.push([right, top + i * sideStep]);
      // Bottom edge: right -> left
      for (let i = 0; i < topCount; i++)
        positions.push([right - i * topStep, bottom]);
      // Left edge: bottom -> top
      for (let i = 0; i < sideCount; i++)
        positions.push([left, bottom - i * sideStep]);

      positions.forEach(([x, y], i) => {
        const bulb = document.createElement("span");
        bulb.className = "bulb" + (i % 2 === 0 ? "" : " off");
        bulb.style.left = x + "px";
        bulb.style.top = y + "px";
        frame.appendChild(bulb);
      });
    });
  }
}

document.addEventListener("DOMContentLoaded", () => {
  new ChicagoDashboard();
});
