// publications.js — renders selected and full publications lists from
// /data/publications.json, with live year/type/text filtering on the full
// list. No dependencies. No browser-storage APIs.

(function () {
  "use strict";

  const selectedEl = document.querySelector("[data-pubs-selected]");
  const fullEl = document.querySelector("[data-pubs-full]");
  const yearSelect = document.querySelector("[data-filter='year']");
  const typeSelect = document.querySelector("[data-filter='type']");
  const textInput = document.querySelector("[data-filter='text']");

  if (!selectedEl || !fullEl) return;

  const TYPE_LABELS = {
    peer_reviewed: "Peer-reviewed",
    under_review: "Under review",
    in_prep: "In preparation",
    technical_report: "Technical report"
  };

  // Canonical order for the type filter. Only types present in the data are rendered.
  const TYPE_ORDER = ["peer_reviewed", "under_review", "in_prep", "technical_report"];

  let publications = [];

  function typeLabel(type) {
    return TYPE_LABELS[type] || type || "";
  }

  function normalize(s) {
    return (s || "").toString().toLowerCase();
  }

  function resolveHref(p) {
    if (p.url) return p.url;
    if (p.doi) return "https://doi.org/" + p.doi;
    return null;
  }

  function el(tag, className, text) {
    const e = document.createElement(tag);
    if (className) e.className = className;
    if (text != null) e.textContent = text;
    return e;
  }

  function renderSelected(pubs) {
    selectedEl.replaceChildren();
    const highlighted = pubs
      .filter(function (p) { return p.highlighted; })
      .slice()
      .sort(function (a, b) {
        // Sort by selected_order asc; entries without the field sink to the end
        // in stable order.
        const ao = (a.selected_order == null) ? Infinity : a.selected_order;
        const bo = (b.selected_order == null) ? Infinity : b.selected_order;
        return ao - bo;
      })
      .slice(0, 5);

    highlighted.forEach(function (p, i) {
      const li = el("li", "pub-selected");

      const num = el("div", "pub-selected__num", String(i + 1).padStart(2, "0"));

      const content = el("div", "pub-selected__content");

      const titleP = el("p", "pub-selected__title");
      const em = el("em");
      em.textContent = p.title;
      const href = resolveHref(p);
      if (href) {
        const a = el("a", "inline-link");
        a.href = href;
        a.rel = "noopener";
        a.target = "_blank";
        a.textContent = p.title;
        em.replaceChildren(a);
      }
      titleP.appendChild(em);

      const metaParts = [p.authors, String(p.year)];
      if (p.venue) metaParts.push(p.venue);
      const metaP = el("p", "pub-selected__meta", metaParts.join(" · "));

      content.append(titleP, metaP);

      if (p.annotation) {
        content.append(el("p", "pub-selected__annotation", p.annotation));
      }

      li.append(num, content);
      selectedEl.append(li);
    });
  }

  function populateYearFilter(pubs) {
    if (!yearSelect) return;
    const years = Array.from(new Set(pubs.map(function (p) { return p.year; })))
      .sort(function (a, b) { return b - a; });
    years.forEach(function (y) {
      const opt = el("option", null, String(y));
      opt.value = String(y);
      yearSelect.appendChild(opt);
    });
  }

  function populateTypeFilter(pubs) {
    if (!typeSelect) return;
    // Only render options for types that actually exist in the data, in canonical order.
    const present = new Set(pubs.map(function (p) { return p.type; }).filter(Boolean));
    TYPE_ORDER.forEach(function (t) {
      if (!present.has(t)) return;
      const opt = el("option", null, TYPE_LABELS[t] || t);
      opt.value = t;
      typeSelect.appendChild(opt);
    });
    // Also render any unknown types that appear in the data but not in our canonical list.
    present.forEach(function (t) {
      if (TYPE_ORDER.indexOf(t) !== -1) return;
      const opt = el("option", null, TYPE_LABELS[t] || t);
      opt.value = t;
      typeSelect.appendChild(opt);
    });
  }

  function filterPubs() {
    const yearVal = yearSelect ? yearSelect.value : "";
    const typeVal = typeSelect ? typeSelect.value : "";
    const textVal = textInput ? normalize(textInput.value) : "";

    return publications.filter(function (p) {
      if (yearVal && String(p.year) !== yearVal) return false;
      if (typeVal && p.type !== typeVal) return false;
      if (textVal) {
        const haystack = normalize([p.title, p.authors, p.venue].filter(Boolean).join(" "));
        if (haystack.indexOf(textVal) === -1) return false;
      }
      return true;
    });
  }

  function renderFull() {
    const filtered = filterPubs();
    fullEl.replaceChildren();
    fullEl.setAttribute("aria-busy", "false");

    if (filtered.length === 0) {
      fullEl.appendChild(el("p", "pubs-empty", "No publications match the current filters."));
      return;
    }

    // Group by year, descending.
    const byYear = {};
    filtered.forEach(function (p) {
      const y = String(p.year);
      (byYear[y] = byYear[y] || []).push(p);
    });
    const years = Object.keys(byYear).sort(function (a, b) { return Number(b) - Number(a); });

    years.forEach(function (y) {
      const group = el("section", "pubs-year");
      group.setAttribute("aria-label", "Published " + y);

      const heading = el("h3", "pubs-year__label", y);
      group.appendChild(heading);

      const list = el("ol", "pubs-year__list");

      byYear[y].forEach(function (p) {
        const li = el("li", "pub");

        const titleP = el("p", "pub__title");
        const em = el("em");
        const href = resolveHref(p);
        if (href) {
          const a = el("a", "inline-link");
          a.href = href;
          a.rel = "noopener";
          a.target = "_blank";
          a.textContent = p.title;
          em.appendChild(a);
        } else {
          em.textContent = p.title;
        }
        titleP.appendChild(em);

        const metaParts = [p.authors];
        if (p.venue) metaParts.push(p.venue);
        metaParts.push(typeLabel(p.type));
        const metaP = el("p", "pub__meta", metaParts.join(" · "));

        li.append(titleP, metaP);
        list.appendChild(li);
      });

      group.appendChild(list);
      fullEl.appendChild(group);
    });
  }

  fetch("/data/publications.json", { cache: "no-cache" })
    .then(function (r) {
      if (!r.ok) throw new Error("HTTP " + r.status);
      return r.json();
    })
    .then(function (data) {
      publications = (data && data.publications) || [];
      renderSelected(publications);
      populateYearFilter(publications);
      populateTypeFilter(publications);
      renderFull();
    })
    .catch(function (err) {
      fullEl.replaceChildren(el("p", "pubs-empty", "Unable to load publications."));
      fullEl.setAttribute("aria-busy", "false");
      // eslint-disable-next-line no-console
      if (window.console && console.error) console.error("publications.json", err);
    });

  [yearSelect, typeSelect].forEach(function (elx) {
    if (elx) elx.addEventListener("change", renderFull);
  });
  if (textInput) {
    textInput.addEventListener("input", renderFull);
  }
})();
