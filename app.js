(() => {
  "use strict";

  const STORAGE_KEY = "airline-job-tracker";
  const STATUSES = ["Wishlist", "Applied", "Interviewing", "Offer", "Rejected", "No Response"];

  /** @type {Array<{id:string, airline:string, position:string, location:string, date:string, status:string, link:string, notes:string}>} */
  let applications = load();

  // ---------- Elements ----------
  const listEl = document.getElementById("app-list");
  const emptyEl = document.getElementById("empty-state");
  const overlayEl = document.getElementById("modal-overlay");
  const formEl = document.getElementById("app-form");
  const modalTitleEl = document.getElementById("modal-title");
  const searchEl = document.getElementById("search");
  const filterEl = document.getElementById("filter-status");
  const sortEl = document.getElementById("sort-by");
  const importFileEl = document.getElementById("import-file");

  const fields = {
    id: document.getElementById("edit-id"),
    airline: document.getElementById("f-airline"),
    position: document.getElementById("f-position"),
    location: document.getElementById("f-location"),
    date: document.getElementById("f-date"),
    status: document.getElementById("f-status"),
    link: document.getElementById("f-link"),
    notes: document.getElementById("f-notes"),
  };

  // ---------- Storage ----------
  function load() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    } catch {
      return [];
    }
  }

  function save() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(applications));
  }

  function uid() {
    return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
  }

  // ---------- Rendering ----------
  function render() {
    const query = searchEl.value.trim().toLowerCase();
    const statusFilter = filterEl.value;

    let visible = applications.filter((a) => {
      const matchesQuery =
        !query ||
        [a.airline, a.position, a.location, a.notes]
          .join(" ")
          .toLowerCase()
          .includes(query);
      const matchesStatus = !statusFilter || a.status === statusFilter;
      return matchesQuery && matchesStatus;
    });

    visible = sortApps(visible, sortEl.value);

    listEl.innerHTML = "";
    visible.forEach((a) => listEl.appendChild(renderCard(a)));

    emptyEl.classList.toggle("hidden", applications.length > 0);
    renderStats();
  }

  function sortApps(apps, mode) {
    const copy = [...apps];
    switch (mode) {
      case "date-asc":
        return copy.sort((a, b) => (a.date || "9999") < (b.date || "9999") ? -1 : 1);
      case "airline":
        return copy.sort((a, b) => a.airline.localeCompare(b.airline));
      case "status":
        return copy.sort((a, b) => STATUSES.indexOf(a.status) - STATUSES.indexOf(b.status));
      case "date-desc":
      default:
        return copy.sort((a, b) => (a.date || "") > (b.date || "") ? -1 : 1);
    }
  }

  function renderCard(app) {
    const card = document.createElement("article");
    card.className = "app-card";
    card.dataset.status = app.status;

    const badgeClass = "badge-" + app.status.replace(/\s+/g, "");

    const metaParts = [];
    if (app.location) metaParts.push(`<span>📍 ${escapeHtml(app.location)}</span>`);
    if (app.date) metaParts.push(`<span>🗓 ${formatDate(app.date)}</span>`);
    if (app.link) {
      metaParts.push(
        `<a href="${escapeAttr(app.link)}" target="_blank" rel="noopener noreferrer">🔗 Job posting</a>`
      );
    }

    card.innerHTML = `
      <div class="card-top">
        <div>
          <h3 class="card-airline">${escapeHtml(app.airline)}</h3>
          <p class="card-position">${escapeHtml(app.position)}</p>
        </div>
        <span class="badge ${badgeClass}">${escapeHtml(app.status)}</span>
      </div>
      ${metaParts.length ? `<div class="card-meta">${metaParts.join("")}</div>` : ""}
      ${app.notes ? `<p class="card-notes">${escapeHtml(app.notes)}</p>` : ""}
      <div class="card-actions">
        <button class="btn btn-ghost" data-action="edit">Edit</button>
        <button class="btn btn-danger" data-action="delete">Delete</button>
      </div>
    `;

    card.querySelector('[data-action="edit"]').addEventListener("click", () => openModal(app));
    card.querySelector('[data-action="delete"]').addEventListener("click", () => {
      if (confirm(`Delete the ${app.airline} — ${app.position} application?`)) {
        applications = applications.filter((a) => a.id !== app.id);
        save();
        render();
      }
    });

    return card;
  }

  function renderStats() {
    document.getElementById("stat-total").textContent = applications.length;
    document.getElementById("stat-applied").textContent = applications.filter(
      (a) => a.status === "Applied"
    ).length;
    document.getElementById("stat-interview").textContent = applications.filter(
      (a) => a.status === "Interviewing"
    ).length;
    document.getElementById("stat-offer").textContent = applications.filter(
      (a) => a.status === "Offer"
    ).length;
  }

  function formatDate(iso) {
    const [y, m, d] = iso.split("-").map(Number);
    if (!y || !m || !d) return iso;
    return new Date(y, m - 1, d).toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  }

  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function escapeAttr(str) {
    const s = String(str);
    return /^https?:\/\//i.test(s) ? escapeHtml(s) : "#";
  }

  // ---------- Modal ----------
  function openModal(app) {
    modalTitleEl.textContent = app ? "Edit Application" : "Add Application";
    fields.id.value = app ? app.id : "";
    fields.airline.value = app ? app.airline : "";
    fields.position.value = app ? app.position : "";
    fields.location.value = app ? app.location : "";
    fields.date.value = app ? app.date : new Date().toISOString().slice(0, 10);
    fields.status.value = app ? app.status : "Applied";
    fields.link.value = app ? app.link : "";
    fields.notes.value = app ? app.notes : "";
    overlayEl.classList.remove("hidden");
    document.body.style.overflow = "hidden";
    fields.airline.focus();
  }

  function closeModal() {
    overlayEl.classList.add("hidden");
    document.body.style.overflow = "";
  }

  formEl.addEventListener("submit", (e) => {
    e.preventDefault();
    const data = {
      airline: fields.airline.value.trim(),
      position: fields.position.value.trim(),
      location: fields.location.value.trim(),
      date: fields.date.value,
      status: fields.status.value,
      link: fields.link.value.trim(),
      notes: fields.notes.value.trim(),
    };

    const id = fields.id.value;
    if (id) {
      const existing = applications.find((a) => a.id === id);
      if (existing) Object.assign(existing, data);
    } else {
      applications.push({ id: uid(), ...data });
    }

    save();
    render();
    closeModal();
  });

  document.getElementById("btn-add").addEventListener("click", () => openModal(null));
  document.getElementById("btn-close-modal").addEventListener("click", closeModal);
  document.getElementById("btn-cancel").addEventListener("click", closeModal);
  overlayEl.addEventListener("click", (e) => {
    if (e.target === overlayEl) closeModal();
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && !overlayEl.classList.contains("hidden")) closeModal();
  });

  // ---------- Search / filter / sort ----------
  searchEl.addEventListener("input", render);
  filterEl.addEventListener("change", render);
  sortEl.addEventListener("change", render);

  // ---------- CSV export ----------
  document.getElementById("btn-export").addEventListener("click", () => {
    const header = ["Airline", "Position", "Location", "Date Applied", "Status", "Link", "Notes"];
    const rows = applications.map((a) =>
      [a.airline, a.position, a.location, a.date, a.status, a.link, a.notes].map(csvCell).join(",")
    );
    const csv = [header.join(","), ...rows].join("\r\n");
    const blob = new Blob(["﻿" + csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "airline-job-applications.csv";
    link.click();
    URL.revokeObjectURL(url);
  });

  function csvCell(value) {
    const s = String(value ?? "");
    return /[",\r\n]/.test(s) ? '"' + s.replace(/"/g, '""') + '"' : s;
  }

  // ---------- CSV import ----------
  document.getElementById("btn-import").addEventListener("click", () => importFileEl.click());

  importFileEl.addEventListener("change", () => {
    const file = importFileEl.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const imported = parseCsv(String(reader.result));
        if (!imported.length) {
          alert("No rows found in that CSV.");
          return;
        }
        applications.push(...imported);
        save();
        render();
        alert(`Imported ${imported.length} application${imported.length === 1 ? "" : "s"}.`);
      } catch (err) {
        alert("Could not read that file as a CSV. Export your Excel sheet as CSV and try again.");
      }
      importFileEl.value = "";
    };
    reader.readAsText(file);
  });

  function parseCsv(text) {
    const rows = [];
    let row = [];
    let cell = "";
    let inQuotes = false;

    for (let i = 0; i < text.length; i++) {
      const ch = text[i];
      if (inQuotes) {
        if (ch === '"') {
          if (text[i + 1] === '"') { cell += '"'; i++; }
          else inQuotes = false;
        } else cell += ch;
      } else if (ch === '"') {
        inQuotes = true;
      } else if (ch === ",") {
        row.push(cell); cell = "";
      } else if (ch === "\n" || ch === "\r") {
        if (ch === "\r" && text[i + 1] === "\n") i++;
        row.push(cell); cell = "";
        if (row.some((c) => c.trim() !== "")) rows.push(row);
        row = [];
      } else {
        cell += ch;
      }
    }
    row.push(cell);
    if (row.some((c) => c.trim() !== "")) rows.push(row);

    if (!rows.length) return [];

    // Map columns by header names; fall back to positional order.
    const header = rows[0].map((h) => h.trim().toLowerCase().replace(/^﻿/, ""));
    const findCol = (...names) =>
      header.findIndex((h) => names.some((n) => h.includes(n)));

    let cols = {
      airline: findCol("airline", "company", "employer"),
      position: findCol("position", "title", "role", "job"),
      location: findCol("location", "city", "base"),
      date: findCol("date"),
      status: findCol("status", "stage", "result"),
      link: findCol("link", "url", "posting"),
      notes: findCol("note", "comment", "remark"),
    };

    const hasHeader = cols.airline !== -1 || cols.position !== -1;
    const dataRows = hasHeader ? rows.slice(1) : rows;
    if (!hasHeader) {
      cols = { airline: 0, position: 1, location: 2, date: 3, status: 4, link: 5, notes: 6 };
    }

    const pick = (r, idx) => (idx >= 0 && r[idx] !== undefined ? r[idx].trim() : "");

    return dataRows
      .map((r) => ({
        id: uid(),
        airline: pick(r, cols.airline),
        position: pick(r, cols.position),
        location: pick(r, cols.location),
        date: normalizeDate(pick(r, cols.date)),
        status: normalizeStatus(pick(r, cols.status)),
        link: pick(r, cols.link),
        notes: pick(r, cols.notes),
      }))
      .filter((a) => a.airline || a.position);
  }

  function normalizeDate(value) {
    if (!value) return "";
    if (/^\d{4}-\d{2}-\d{2}$/.test(value)) return value;
    const mdY = value.match(/^(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{2,4})$/);
    if (mdY) {
      let [, m, d, y] = mdY;
      if (y.length === 2) y = "20" + y;
      return `${y}-${m.padStart(2, "0")}-${d.padStart(2, "0")}`;
    }
    const parsed = new Date(value);
    return isNaN(parsed) ? "" : parsed.toISOString().slice(0, 10);
  }

  function normalizeStatus(value) {
    const v = value.trim().toLowerCase();
    if (!v) return "Applied";
    if (v.includes("wish") || v.includes("interested") || v.includes("plan")) return "Wishlist";
    if (v.includes("interview") || v.includes("phone") || v.includes("screen")) return "Interviewing";
    if (v.includes("offer") || v.includes("hired") || v.includes("accept")) return "Offer";
    if (v.includes("reject") || v.includes("declin") || v.includes("denied") || v.includes("no longer")) return "Rejected";
    if (v.includes("no resp") || v.includes("ghost") || v.includes("pending")) return "No Response";
    return "Applied";
  }

  // ---------- Init ----------
  render();
})();
