/* ============================================================
   PYTHON RÉFÉRENCE — Recherche & Navigation
   ============================================================ */

(function () {
  "use strict";

  /* ── Éléments DOM ── */
  const searchInput  = document.getElementById("search");
  const searchCount  = document.getElementById("search-count");
  const noResults    = document.getElementById("no-results");
  const backToTop    = document.getElementById("back-to-top");
  const mainContent  = document.getElementById("main-content");
  const sidebarLinks = document.querySelectorAll(".sidebar nav a");
  const sections     = document.querySelectorAll(".section");

  /* ── Textes originaux (pour restauration après highlight) ── */
  const originalHTML = new Map();
  sections.forEach(sec => {
    originalHTML.set(sec.id, sec.innerHTML);
  });

  /* ══════════════════════════════════════════════════
     RECHERCHE
  ══════════════════════════════════════════════════ */

  let debounceTimer = null;

  searchInput.addEventListener("input", () => {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(runSearch, 150);
  });

  // Raccourci clavier Ctrl+K / Cmd+K pour focus sur la recherche
  document.addEventListener("keydown", (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === "k") {
      e.preventDefault();
      searchInput.focus();
      searchInput.select();
    }
    // Échap pour effacer la recherche
    if (e.key === "Escape" && document.activeElement === searchInput) {
      searchInput.value = "";
      runSearch();
      searchInput.blur();
    }
  });

  function runSearch() {
    const query = searchInput.value.trim().toLowerCase();

    if (!query) {
      resetSearch();
      return;
    }

    const terms = query.split(/\s+/).filter(Boolean);
    let visibleCount = 0;

    sections.forEach(sec => {
      // Restaurer HTML original avant chaque recherche (pour re-highlighter)
      sec.innerHTML = originalHTML.get(sec.id);

      const keywords  = (sec.dataset.keywords || "").toLowerCase();
      const textContent = sec.textContent.toLowerCase();

      // Une section est visible si TOUS les termes matchent (keywords OU texte)
      const matches = terms.every(term =>
        keywords.includes(term) || textContent.includes(term)
      );

      if (matches) {
        sec.style.display = "";
        highlightTerms(sec, terms);
        visibleCount++;
      } else {
        sec.style.display = "none";
      }
    });

    // Afficher/masquer le message "Aucun résultat"
    noResults.style.display = visibleCount === 0 ? "block" : "none";

    // Compteur
    searchCount.textContent = visibleCount > 0 ? `${visibleCount} section${visibleCount > 1 ? "s" : ""}` : "";
  }

  function resetSearch() {
    sections.forEach(sec => {
      sec.style.display = "";
      sec.innerHTML = originalHTML.get(sec.id);
    });
    noResults.style.display = "none";
    searchCount.textContent = "";
  }

  /* ── Surlignage des termes ── */
  function highlightTerms(container, terms) {
    // On ne surligne que dans les card-title, card-desc et les paragraphes
    // (évite de casser le code HTML des <pre>)
    const targets = container.querySelectorAll(
      ".card-title, .card-desc, .section-header h2, td:not(:has(code)), th"
    );

    targets.forEach(el => {
      let html = el.innerHTML;
      terms.forEach(term => {
        if (!term) return;
        const escaped = term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
        const regex = new RegExp(`(${escaped})`, "gi");
        html = html.replace(regex, "<mark>$1</mark>");
      });
      el.innerHTML = html;
    });
  }

  /* ══════════════════════════════════════════════════
     NAVIGATION ACTIVE (scroll spy)
  ══════════════════════════════════════════════════ */

  const observerOptions = {
    root: null,
    rootMargin: "-64px 0px -60% 0px",
    threshold: 0
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        setActiveLink(entry.target.id);
      }
    });
  }, observerOptions);

  sections.forEach(sec => observer.observe(sec));

  function setActiveLink(id) {
    sidebarLinks.forEach(link => {
      const href = link.getAttribute("href");
      if (href === `#${id}`) {
        link.classList.add("active");
        // Scroll la sidebar pour garder le lien actif visible
        link.scrollIntoView({ block: "nearest", behavior: "smooth" });
      } else {
        link.classList.remove("active");
      }
    });
  }

  /* ── Clic sur un lien sidebar ── */
  sidebarLinks.forEach(link => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      const targetId = link.getAttribute("href").slice(1);
      const target = document.getElementById(targetId);
      if (target) {
        target.scrollIntoView({ behavior: "smooth", block: "start" });
        setActiveLink(targetId);
      }
    });
  });

  /* ══════════════════════════════════════════════════
     BOUTON RETOUR EN HAUT
  ══════════════════════════════════════════════════ */

  window.addEventListener("scroll", () => {
    if (window.scrollY > 400) {
      backToTop.classList.add("visible");
    } else {
      backToTop.classList.remove("visible");
    }
  });

  backToTop.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  /* ══════════════════════════════════════════════════
     COPIER LE CODE AU CLIC
  ══════════════════════════════════════════════════ */

  document.querySelectorAll("pre").forEach(pre => {
    // Créer le bouton copier
    const btn = document.createElement("button");
    btn.className = "copy-btn";
    btn.textContent = "Copier";
    btn.title = "Copier le code";

    // Style inline (pas besoin de toucher au CSS externe)
    Object.assign(btn.style, {
      position: "absolute",
      top: "8px",
      right: "10px",
      background: "#2d3748",
      color: "#8899aa",
      border: "1px solid #3a4a5c",
      borderRadius: "5px",
      padding: "3px 9px",
      fontSize: "0.75rem",
      cursor: "pointer",
      opacity: "0",
      transition: "opacity 0.15s, background 0.15s",
      zIndex: "10"
    });

    // Wrapper relatif pour positionner le bouton
    const wrapper = document.createElement("div");
    wrapper.style.position = "relative";
    pre.parentNode.insertBefore(wrapper, pre);
    wrapper.appendChild(pre);
    wrapper.appendChild(btn);

    // Afficher au survol
    wrapper.addEventListener("mouseenter", () => { btn.style.opacity = "1"; });
    wrapper.addEventListener("mouseleave", () => { btn.style.opacity = "0"; });

    // Clic → copier
    btn.addEventListener("click", () => {
      const code = pre.textContent;
      navigator.clipboard.writeText(code).then(() => {
        btn.textContent = "✓ Copié";
        btn.style.color = "#3ecf8e";
        btn.style.background = "#1a3a2a";
        setTimeout(() => {
          btn.textContent = "Copier";
          btn.style.color = "#8899aa";
          btn.style.background = "#2d3748";
        }, 2000);
      }).catch(() => {
        // Fallback pour les navigateurs sans clipboard API
        const ta = document.createElement("textarea");
        ta.value = code;
        document.body.appendChild(ta);
        ta.select();
        document.execCommand("copy");
        document.body.removeChild(ta);
        btn.textContent = "✓";
        setTimeout(() => { btn.textContent = "Copier"; }, 2000);
      });
    });
  });

  /* ══════════════════════════════════════════════════
     MISE À JOUR DES ORIGINAUX APRÈS wrap pre
     (les innerHTML ont changé avec les wrappers)
  ══════════════════════════════════════════════════ */
  sections.forEach(sec => {
    originalHTML.set(sec.id, sec.innerHTML);
  });

  /* ══════════════════════════════════════════════════
     TOOLTIP PLACEHOLDER (affiche le raccourci dans la search bar)
  ══════════════════════════════════════════════════ */
  const isMac = navigator.platform.toUpperCase().indexOf("MAC") >= 0;
  searchInput.placeholder = `Rechercher : list, for, class, async… (${isMac ? "⌘K" : "Ctrl+K"})`;

})();
