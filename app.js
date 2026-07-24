(() => {
  "use strict";

  const STORAGE_KEY = "airline-job-tracker";
  const SEED_VERSION = 1;
  const STATUSES = ["Not Started", "Applied", "Interviewing", "Offer", "Rejected", "No Response"];
  const GROUPS = ["Tampa Bay", "Orlando", "Other Florida", "National / Relocation"];
  const PRIORITY_ORDER = { High: 0, Medium: 1, Low: 2 };

  // All 34 verified jobs from Celjan's spreadsheet (researched July 23, 2026).
  // Every link is the official application page from the "Official Application Link" column.
  const SEED_JOBS = [
    { id: "s01", airline: "Breeze Airways", position: "Flight Attendant - Part Time", location: "Tampa, FL", group: "Tampa Bay", priority: "High", type: "Part-time", pay: "$25.00–$37.50 / flight hour", notes: "Age 21+; HS diploma/GED; passport with 6+ months validity; live within 2 hours of TPA. Only one Breeze FA application every 3 months—choose Tampa first.", link: "https://job-boards.greenhouse.io/breezeairways/jobs/7761949003" },
    { id: "s02", airline: "Allegiant Air", position: "Customer Service Agent", location: "Clearwater, FL", group: "Tampa Bay", priority: "High", type: "Part-time", pay: "$15.00 / hour", notes: "HS diploma/GED; 1+ year customer service; valid driver's license; flexible nights, weekends and holidays. Strong local pathway into aviation.", link: "https://jobs.lever.co/allegiantair/e5b5ff00-e5e5-46dc-8ae7-db35e54deccc" },
    { id: "s03", airline: "Menzies Aviation", position: "Passenger Service Agent (Part Time)", location: "Tampa, FL (TPA)", group: "Tampa Bay", priority: "High", type: "Part-time", pay: "$16.00 / hour", notes: "Computerized passenger check-in, seat assignments and travel assistance. Paid training, uniform and flight benefits listed.", link: "https://recruiting2.ultipro.com/MEN1002MENZI/JobBoard/c62dfe4d-64ad-4642-8cd0-17a30715a697/OpportunityDetail?opportunityId=48fe50fd-9e55-42aa-a021-5dbd4050d5f8" },
    { id: "s04", airline: "Menzies Aviation", position: "Passenger Service Agent — English/Spanish", location: "Tampa, FL (TPA)", group: "Tampa Bay", priority: "Medium", type: "Part-time", pay: "$16.00 / hour", notes: "Copa Airlines passenger-service assignment. Apply only if professionally fluent in both English and Spanish.", link: "https://recruiting2.ultipro.com/MEN1002MENZI/JobBoard/c62dfe4d-64ad-4642-8cd0-17a30715a697/OpportunityDetail?opportunityId=e933e4bf-7caa-4595-8d5c-69c531c2b8d2&postingId=a93dae80-71d7-4408-8ea2-5d904e4a4a0c" },
    { id: "s05", airline: "Allegiant Air", position: "Commissary Agent", location: "Clearwater, FL", group: "Tampa Bay", priority: "Medium", type: "Part-time", pay: "See official posting", notes: "Official Clearwater station opening. Builds airline experience through aircraft provisioning, organization and safety procedures.", link: "https://jobs.lever.co/allegiantair?location=Clearwater%2C+FL" },
    { id: "s06", airline: "JetBlue", position: "Inflight Crew Trainee", location: "Orlando, FL", group: "Orlando", priority: "High", type: "Full-time / trainee", pay: "$26.03–$69.90 / flight hour", notes: "Age 21+; HS diploma/GED; 2 years face-to-face customer service; passport with 12+ months validity; safety, teamwork and flexible scheduling.", link: "https://careers.jetblue.com/job/Orlando-Inflight-Crew-Trainee-FL-32827/1409071000/" },
    { id: "s07", airline: "Frontier Airlines", position: "Flight Attendant", location: "Multiple bases incl. Orlando, Tampa, Miami", group: "Orlando", priority: "High", type: "Full-time", pay: "See official posting", notes: "Age 20+; HS diploma/GED; passport with 14+ months validity; willing to relocate. Florida bases listed include MCO, TPA and MIA.", link: "https://recruiting2.ultipro.com/FRO1003FTAIR/JobBoard/1efcf859-1b48-4a31-b014-ef62bdcab988/OpportunityDetail?opportunityId=a0b7a22c-5ca9-4802-89a2-0edc6714c012" },
    { id: "s08", airline: "Breeze Airways", position: "Flight Attendant - Part Time", location: "Orlando, FL", group: "Orlando", priority: "High", type: "Part-time", pay: "$25.00–$37.50 / flight hour", notes: "Age 21+; HS diploma/GED; passport with 6+ months validity; live within 2 hours of MCO. Only one Breeze FA application every 3 months.", link: "https://job-boards.greenhouse.io/breezeairways/jobs/7785954003" },
    { id: "s09", airline: "Swissport", position: "Ramp Agent", location: "Orlando, FL", group: "Orlando", priority: "Medium", type: "Permanent part-time", pay: "$16.50 / hour", notes: "Valid driver's license; safety awareness; lift up to 70 lb; flexible shifts. Mechanic experience transfers well to equipment and ramp operations.", link: "https://careers.swissport.com/jobs/7938?lang=en-us" },
    { id: "s10", airline: "Swissport", position: "Passenger Service Agent — English/French", location: "Orlando, FL (MCO)", group: "Orlando", priority: "Medium", type: "Permanent part-time", pay: "$16.50 / hour", notes: "Check-in, ticketing, baggage, gate announcements and special-assistance duties. Apply only if fluent in English and French; posting also mentions Spanish.", link: "https://careers.swissport.com/jobs/7939?lang=en-us" },
    { id: "s11", airline: "Breeze Airways", position: "Flight Attendant - Part Time", location: "Fort Myers, FL", group: "Other Florida", priority: "Medium", type: "Part-time", pay: "$25.00–$37.50 / flight hour", notes: "Must live within 2 hours of RSW. Only one Breeze FA application every 3 months; do not submit if applying to Tampa.", link: "https://job-boards.greenhouse.io/breezeairways/jobs/7761946003" },
    { id: "s12", airline: "Breeze Airways", position: "Flight Attendant - Part Time", location: "Vero Beach, FL", group: "Other Florida", priority: "Medium", type: "Part-time", pay: "$25.00–$37.50 / flight hour", notes: "Must live within 2 hours of VRB. Only one Breeze FA application every 3 months; do not submit if applying to Tampa.", link: "https://job-boards.greenhouse.io/breezeairways/jobs/7761953003" },
    { id: "s13", airline: "Breeze Airways", position: "Flight Attendant - Part Time", location: "Fort Lauderdale, FL", group: "Other Florida", priority: "Medium", type: "Part-time", pay: "$25.00–$37.50 / flight hour", notes: "Must live within 2 hours of FLL. Only one Breeze FA application every 3 months; do not submit if applying to Tampa.", link: "https://job-boards.greenhouse.io/breezeairways/jobs/7761959003" },
    { id: "s14", airline: "Contour Airlines", position: "Flight Attendant - Charter Service", location: "Fort Lauderdale, FL", group: "Other Florida", priority: "Medium", type: "Full-time", pay: "$42,000–$52,452 / year", notes: "Charter cabin role emphasizing passenger safety, security, comfort and high-level customer service. High school education listed.", link: "https://www.paycomonline.net/v4/ats/web.php/portal/4E8FCB0F31AC88147F0DB7B85238B354/jobs/388772" },
    { id: "s15", airline: "Envoy Air", position: "Flight Attendant", location: "Bases include Miami, FL", group: "Other Florida", priority: "Medium", type: "Full-time", pay: "$29.73 / flight hour + possible bonus", notes: "Miami is a listed domicile; must accept base assignment/relocation. Official page advertises Apply Now and current enhanced entry pay.", link: "https://www.envoyair.com/careers/flight-attendants/" },
    { id: "s16", airline: "Avelo Airlines", position: "Airport Crewmember - PT", location: "Lakeland, FL", group: "Other Florida", priority: "Medium", type: "Part-time", pay: "$18.00 / hour", notes: "Combined customer-service and ramp role. HS diploma/GED, driver's license, background/drug screening and ability to lift up to 70 lb.", link: "https://recruiting.paylocity.com/recruiting/jobs/Details/3636532/Avelo-Airlines-Inc/Airport-Crewmember---PT" },
    { id: "s17", airline: "Delta Air Lines", position: "Flight Attendant - 2027 Classes", location: "Base assigned after training", group: "National / Relocation", priority: "High", type: "Full-time", pay: "See official posting", notes: "Age 21+; HS diploma/GED; valid passport required with 30 months remaining by training; 7-week training in Atlanta. Apply quickly—window may close without a set date.", link: "https://www.delta.com/us/en/careers/flight-attendant-careers" },
    { id: "s18", airline: "SkyWest Airlines", position: "Flight Attendant", location: "Multiple U.S. locations", group: "National / Relocation", priority: "High", type: "Full-time", pay: "See official posting", notes: "Official current posting. Base is assigned based on operational need; training is held in Salt Lake City.", link: "https://jobs.skywest.com/skywest-airlines/jobs/16704?lang=en-us" },
    { id: "s19", airline: "PSA Airlines", position: "Flight Attendant", location: "Bases: Charlotte, Dayton, Washington, Dallas, Philadelphia", group: "National / Relocation", priority: "High", type: "Full-time", pay: "$27.06 / flight hour", notes: "Age 20+; HS diploma plus 2 years customer-facing experience or college degree; passport; 4 weeks paid training in Charlotte; relocation may be required.", link: "https://psaairlines.com/flight-attendants/" },
    { id: "s20", airline: "Endeavor Air", position: "Flight Attendant", location: "Hubs incl. Atlanta, Cincinnati, Detroit, Minneapolis, New York, Raleigh-Durham", group: "National / Relocation", priority: "High", type: "Full-time", pay: "See official posting", notes: "Official page says apply today. Safety-focused regional role operating as Delta Connection; base assignment may require relocation.", link: "https://www.endeavorair.com/content/endeavor-air/en_us/careers/flight-attendants.html" },
    { id: "s21", airline: "Avelo Airlines", position: "Flight Attendant", location: "New Haven, CT", group: "National / Relocation", priority: "Medium", type: "Full-time", pay: "$28 / flight hour; 75-hour monthly guarantee", notes: "Age 21+; passport with 6+ months validity; must report to base within 2 hours; lifting/pushing requirements; relocation may be required.", link: "https://recruiting.paylocity.com/recruiting/jobs/Details/4280858/Avelo-Airlines-Inc/Flight-Attendant" },
    { id: "s22", airline: "Contour Airlines", position: "Flight Attendant", location: "Dallas/Fort Worth, TX", group: "National / Relocation", priority: "Medium", type: "Full-time", pay: "See official posting", notes: "Official Contour opening. Passenger safety, security, comfort and customer service; relocation required.", link: "https://www.paycomonline.net/v4/ats/web.php/portal/4E8FCB0F31AC88147F0DB7B85238B354/jobs/325324" },
    { id: "s23", airline: "Contour Airlines", position: "Flight Attendant", location: "Phoenix, AZ", group: "National / Relocation", priority: "Medium", type: "Full-time", pay: "See official posting", notes: "Official Contour opening. Passenger safety, security, comfort and customer service; relocation required.", link: "https://www.paycomonline.net/v4/ats/web.php/portal/4E8FCB0F31AC88147F0DB7B85238B354/jobs/322835" },
    { id: "s24", airline: "Piedmont Airlines", position: "Flight Attendant", location: "Bases: Charlotte, Philadelphia, Harrisburg", group: "National / Relocation", priority: "Medium", type: "Full-time", pay: "$28.08 / flight hour + $2.00 per diem", notes: "Age 21+; HS diploma/GED; passport and driver's license. Two years customer service preferred. Official page links to current Workday openings.", link: "https://piedmont-airlines.com/flight-attendant/" },
    { id: "s25", airline: "Sun Country Airlines", position: "Flight Attendant", location: "Bases: Minneapolis, Laughlin, Las Vegas, Gulfport", group: "National / Relocation", priority: "Medium", type: "Full-time", pay: "See official posting", notes: "Age 20+ by end of training; HS diploma; 2 years direct customer service; passport with 6+ months validity. Apply to a specific base when listed.", link: "https://careers.suncountry.com/flight-attendants" },
    { id: "s26", airline: "Contour Airlines", position: "Flight Attendant - Charter Service", location: "New York, NY", group: "National / Relocation", priority: "Low", type: "Full-time", pay: "See official posting", notes: "Official charter-service opening. Higher relocation cost from Florida; keep as a backup.", link: "https://www.paycomonline.net/v4/ats/web.php/portal/4E8FCB0F31AC88147F0DB7B85238B354/jobs/331558" },
    { id: "s27", airline: "Breeze Airways", position: "Flight Attendant - Part Time", location: "Charleston, SC", group: "National / Relocation", priority: "Low", type: "Part-time", pay: "$25.00–$37.50 / flight hour", notes: "Must live within 2 hours of base. Only one Breeze FA application every 3 months.", link: "https://job-boards.greenhouse.io/breezeairways/jobs/7792798003" },
    { id: "s28", airline: "Breeze Airways", position: "Flight Attendant - Part Time", location: "New Orleans, LA", group: "National / Relocation", priority: "Low", type: "Part-time", pay: "$25.00–$37.50 / flight hour", notes: "Must live within 2 hours of base. Only one Breeze FA application every 3 months.", link: "https://job-boards.greenhouse.io/breezeairways/jobs/7761927003" },
    { id: "s29", airline: "Breeze Airways", position: "Flight Attendant - Part Time", location: "Norfolk, VA", group: "National / Relocation", priority: "Low", type: "Part-time", pay: "$25.00–$37.50 / flight hour", notes: "Must live within 2 hours of base. Only one Breeze FA application every 3 months.", link: "https://job-boards.greenhouse.io/breezeairways/jobs/7761929003" },
    { id: "s30", airline: "Breeze Airways", position: "Flight Attendant - Part Time", location: "Providence, RI", group: "National / Relocation", priority: "Low", type: "Part-time", pay: "$25.00–$37.50 / flight hour", notes: "Must live within 2 hours of base. Only one Breeze FA application every 3 months.", link: "https://job-boards.greenhouse.io/breezeairways/jobs/7761932003" },
    { id: "s31", airline: "Breeze Airways", position: "Flight Attendant - Part Time", location: "Windsor Locks, CT", group: "National / Relocation", priority: "Low", type: "Part-time", pay: "$25.00–$37.50 / flight hour", notes: "BDL/HVN co-domicile may require seasonal work at both airports. Only one Breeze FA application every 3 months.", link: "https://job-boards.greenhouse.io/breezeairways/jobs/7761879003" },
    { id: "s32", airline: "Breeze Airways", position: "Flight Attendant - Part Time", location: "Akron, OH", group: "National / Relocation", priority: "Low", type: "Part-time", pay: "$25.00–$37.50 / flight hour", notes: "Must live within 2 hours of base. Only one Breeze FA application every 3 months.", link: "https://job-boards.greenhouse.io/breezeairways/jobs/7761906003" },
    { id: "s33", airline: "Breeze Airways", position: "Flight Attendant - Part Time", location: "Provo, UT", group: "National / Relocation", priority: "Low", type: "Part-time", pay: "$25.00–$37.50 / flight hour", notes: "Must live within 2 hours of base. Only one Breeze FA application every 3 months.", link: "https://job-boards.greenhouse.io/breezeairways/jobs/7761935003" },
    { id: "s34", airline: "Republic Airways", position: "Flight Attendant", location: "Multiple U.S. crew bases", group: "National / Relocation", priority: "Low", type: "Full-time", pay: "Starting above $27 / flight hour; 75-hour guarantee", notes: "Paid 19-day training with hotel and transportation. No live flight-attendant requisition was visible in the current job search, so monitor or join the talent community.", link: "https://careers.rjet.com/airline-careers/flight-attendant/" },
  ];

  // Airline Watchlist sheet — official career pages, even where no live opening was verified.
  // kind: "open" = verified opening / actively recruiting, "monitor" = watch the page / talent community.
  const WATCHLIST = [
    ["Delta Air Lines", "https://www.delta.com/us/en/careers/flight-attendant-careers", "open", "2027 classes accepting applications — apply now"],
    ["JetBlue", "https://careers.jetblue.com/job/Orlando-Inflight-Crew-Trainee-FL-32827/1409071000/", "open", "Open — Orlando Inflight Crew Trainee"],
    ["Frontier", "https://www.flyfrontier.com/careers/flight-attendant/", "open", "Open now — MCO/TPA/MIA bases listed"],
    ["Breeze Airways", "https://job-boards.greenhouse.io/breezeairways?departments%5B%5D=4057632003&keyword=Flight+Attendant", "open", "Multiple openings — ONE application per 3 months"],
    ["SkyWest", "https://jobs.skywest.com/skywest-airlines/jobs/16704?lang=en-us", "open", "Open now — multi-location posting"],
    ["Envoy Air", "https://www.envoyair.com/careers/flight-attendants/", "open", "Recruiting — Miami is a domicile"],
    ["PSA Airlines", "https://psaairlines.com/flight-attendants/", "open", "Recruiting — relocation required"],
    ["Endeavor Air", "https://www.endeavorair.com/content/endeavor-air/en_us/careers/flight-attendants.html", "open", "Recruiting — Delta Connection"],
    ["Contour", "https://www.careers.contourairlines.com/flight-attendant-careers", "open", "Multiple openings — FLL first"],
    ["Avelo", "https://recruiting.paylocity.com/recruiting/jobs/Details/4280858/Avelo-Airlines-Inc/Flight-Attendant", "open", "Open — New Haven"],
    ["Allegiant", "https://jobs.lever.co/allegiantair", "open", "Local CSA open; monitor FA"],
    ["American Airlines", "https://jobs.aa.com/go/Flight-Attendants/2537300/", "monitor", "No open trainee posting — monitor"],
    ["United", "https://careers.united.com/us/en/c/flight-attendant-jobs", "monitor", "2026 posting closed — monitor"],
    ["Southwest", "https://careers.southwestair.com/us/en/flight-attendants?form=MG0AV3", "monitor", "Applications only during hiring windows"],
    ["Alaska / Hawaiian / Horizon", "https://careers.alaskaair.com/career-opportunities/flight-attendants/", "monitor", "Talent community only"],
    ["Piedmont", "https://piedmont-airlines.com/flight-attendant/", "monitor", "Check current Workday openings"],
    ["Republic", "https://careers.rjet.com/airline-careers/flight-attendant/", "monitor", "Confirm a live requisition before applying"],
    ["Sun Country", "https://careers.suncountry.com/flight-attendants", "monitor", "Apply by base when listed"],
    ["GlobalX", "https://globalxair.com/careers/", "monitor", "Miami HQ — verify a specific opening"],
    ["EAS Charter", "https://eascharter.com/careers/", "monitor", "Miami-Opa Locka — career inquiries"],
  ];

  // Dashboard sheet: BEST APPLICATION ORDER
  const BEST_ORDER = [
    ["Breeze Airways", "Tampa Flight Attendant"],
    ["JetBlue", "Orlando Inflight Crew Trainee"],
    ["Frontier Airlines", "Flight Attendant — Florida bases"],
    ["Delta Air Lines", "Flight Attendant — 2027 classes"],
    ["Allegiant Air", "Clearwater Customer Service Agent"],
  ];

  /** @type {Array<{id:string, airline:string, position:string, location:string, group:string, priority:string, type:string, pay:string, date:string, status:string, link:string, notes:string}>} */
  let applications = load();

  // ---------- Elements ----------
  const listEl = document.getElementById("app-list");
  const emptyEl = document.getElementById("empty-state");
  const overlayEl = document.getElementById("modal-overlay");
  const formEl = document.getElementById("app-form");
  const modalTitleEl = document.getElementById("modal-title");
  const searchEl = document.getElementById("search");
  const filterEl = document.getElementById("filter-status");
  const groupEl = document.getElementById("filter-group");
  const sortEl = document.getElementById("sort-by");
  const importFileEl = document.getElementById("import-file");

  const fields = {
    id: document.getElementById("edit-id"),
    airline: document.getElementById("f-airline"),
    position: document.getElementById("f-position"),
    location: document.getElementById("f-location"),
    group: document.getElementById("f-group"),
    priority: document.getElementById("f-priority"),
    type: document.getElementById("f-type"),
    pay: document.getElementById("f-pay"),
    date: document.getElementById("f-date"),
    status: document.getElementById("f-status"),
    link: document.getElementById("f-link"),
    notes: document.getElementById("f-notes"),
  };

  // ---------- Storage ----------
  function normalizeApp(a) {
    return {
      id: a.id || uid(),
      airline: a.airline || "",
      position: a.position || "",
      location: a.location || "",
      group: a.group || "",
      priority: a.priority || "",
      type: a.type || "",
      pay: a.pay || "",
      date: a.date || "",
      status: STATUSES.includes(a.status) ? a.status : normalizeStatus(a.status || ""),
      link: a.link || "",
      notes: a.notes || "",
    };
  }

  function seedDefaults() {
    return SEED_JOBS.map((j) => normalizeApp({ ...j, status: "Not Started" }));
  }

  function load() {
    let stored = null;
    try {
      stored = JSON.parse(localStorage.getItem(STORAGE_KEY));
    } catch { /* corrupted storage — fall through to seed */ }

    if (!stored) return seedDefaults();

    // Older versions stored a bare array; current format is {seedVersion, apps}.
    const apps = (Array.isArray(stored) ? stored : stored.apps || []).map(normalizeApp);
    const seedVersion = Array.isArray(stored) ? 0 : stored.seedVersion || 0;

    if (seedVersion < SEED_VERSION) {
      const have = new Set(apps.map((a) => a.id));
      seedDefaults().forEach((j) => { if (!have.has(j.id)) apps.push(j); });
    }
    return apps;
  }

  function save() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ seedVersion: SEED_VERSION, apps: applications }));
  }

  function uid() {
    return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
  }

  // ---------- Rendering ----------
  function render() {
    const query = searchEl.value.trim().toLowerCase();
    const statusFilter = filterEl.value;
    const groupFilter = groupEl.value;

    let visible = applications.filter((a) => {
      const matchesQuery =
        !query ||
        [a.airline, a.position, a.location, a.notes, a.pay, a.type]
          .join(" ")
          .toLowerCase()
          .includes(query);
      const matchesStatus = !statusFilter || a.status === statusFilter;
      const matchesGroup = !groupFilter || a.group === groupFilter;
      return matchesQuery && matchesStatus && matchesGroup;
    });

    visible = sortApps(visible, sortEl.value);

    listEl.innerHTML = "";
    visible.forEach((a) => listEl.appendChild(renderCard(a)));

    emptyEl.classList.toggle("hidden", applications.length > 0);
    renderStats();
  }

  function seedIndex(a) {
    const i = SEED_JOBS.findIndex((j) => j.id === a.id);
    return i === -1 ? SEED_JOBS.length : i;
  }

  function sortApps(apps, mode) {
    const copy = [...apps];
    switch (mode) {
      case "date-desc":
        return copy.sort((a, b) => ((a.date || "") > (b.date || "") ? -1 : 1));
      case "airline":
        return copy.sort((a, b) => a.airline.localeCompare(b.airline));
      case "status":
        return copy.sort((a, b) => STATUSES.indexOf(a.status) - STATUSES.indexOf(b.status));
      case "best":
      default:
        // Spreadsheet strategy: Tampa Bay → Orlando → Other Florida → National, High before Low.
        return copy.sort((a, b) => {
          const g = GROUPS.indexOf(a.group) - GROUPS.indexOf(b.group);
          if (g !== 0) return g;
          const p = (PRIORITY_ORDER[a.priority] ?? 3) - (PRIORITY_ORDER[b.priority] ?? 3);
          if (p !== 0) return p;
          return seedIndex(a) - seedIndex(b);
        });
    }
  }

  function renderCard(app) {
    const card = document.createElement("article");
    card.className = "app-card";
    card.dataset.status = app.status;

    const badgeClass = "badge-" + app.status.replace(/\s+/g, "");

    const chips = [];
    if (app.priority) chips.push(`<span class="chip chip-${escapeHtml(app.priority)}">${escapeHtml(app.priority.toUpperCase())}</span>`);
    if (app.group) chips.push(`<span class="chip chip-group">${escapeHtml(app.group.toUpperCase())}</span>`);

    const metaParts = [];
    if (app.location) metaParts.push(`<span>📍 ${escapeHtml(app.location)}</span>`);
    if (app.pay) metaParts.push(`<span>💰 ${escapeHtml(app.pay)}</span>`);
    if (app.type) metaParts.push(`<span>🕒 ${escapeHtml(app.type)}</span>`);
    if (app.date) metaParts.push(`<span>🗓 Applied ${formatDate(app.date)}</span>`);

    const applyBtn =
      app.link && escapeAttr(app.link) !== "#"
        ? `<a class="btn-apply" href="${escapeAttr(app.link)}" target="_blank" rel="noopener noreferrer">APPLY →</a>`
        : "";

    card.innerHTML = `
      <div class="card-top">
        <div>
          <h3 class="card-airline">${escapeHtml(app.airline)}</h3>
          <p class="card-position">${escapeHtml(app.position)}</p>
        </div>
        <span class="badge ${badgeClass}">${escapeHtml(app.status)}</span>
      </div>
      ${chips.length ? `<div class="card-chips">${chips.join("")}</div>` : ""}
      ${metaParts.length ? `<div class="card-meta">${metaParts.join("")}</div>` : ""}
      ${app.notes ? `<details class="card-notes"><summary>Requirements &amp; notes</summary><p>${escapeHtml(app.notes)}</p></details>` : ""}
      <div class="card-actions">
        ${applyBtn}
        <button class="btn btn-ghost" data-action="edit">EDIT</button>
        <button class="btn btn-danger" data-action="delete">DELETE</button>
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

  // ---------- Strategy + Pit lane ----------
  function renderStrategy() {
    const wrap = document.getElementById("best-order");
    wrap.innerHTML = BEST_ORDER.map(
      ([airline, role], i) => `
        <li class="order-item">
          <span class="order-num">${i + 1}</span>
          <span class="order-text"><strong>${escapeHtml(airline)}</strong> — ${escapeHtml(role)}</span>
        </li>`
    ).join("");
  }

  function renderPitLane() {
    const wrap = document.getElementById("pit-links");
    wrap.innerHTML = WATCHLIST.map(
      ([name, url, kind, hint]) =>
        `<a class="pit-link pit-${kind}" href="${escapeAttr(url)}" target="_blank" rel="noopener noreferrer" title="${escapeHtml(hint)}">${escapeHtml(name)}</a>`
    ).join("");
  }

  // ---------- Modal ----------
  function openModal(app) {
    modalTitleEl.textContent = app ? "Edit Application" : "Add Application";
    fields.id.value = app ? app.id : "";
    fields.airline.value = app ? app.airline : "";
    fields.position.value = app ? app.position : "";
    fields.location.value = app ? app.location : "";
    fields.group.value = app ? app.group : "";
    fields.priority.value = app ? app.priority : "Medium";
    fields.type.value = app ? app.type : "";
    fields.pay.value = app ? app.pay : "";
    fields.date.value = app ? app.date : "";
    fields.status.value = app ? app.status : "Not Started";
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
      group: fields.group.value,
      priority: fields.priority.value,
      type: fields.type.value.trim(),
      pay: fields.pay.value.trim(),
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
  groupEl.addEventListener("change", render);
  sortEl.addEventListener("change", render);

  // ---------- CSV export ----------
  document.getElementById("btn-export").addEventListener("click", () => {
    const header = ["Airline", "Position", "Location", "Group", "Priority", "Employment Type", "Pay", "Date Applied", "Status", "Link", "Notes"];
    const rows = applications.map((a) =>
      [a.airline, a.position, a.location, a.group, a.priority, a.type, a.pay, a.date, a.status, a.link, a.notes]
        .map(csvCell)
        .join(",")
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
      group: findCol("group", "search order", "region"),
      priority: findCol("priority"),
      type: findCol("employment", "type"),
      pay: findCol("pay", "compensation", "salary", "wage"),
      date: findCol("date applied", "applied"),
      status: findCol("status", "stage", "result"),
      link: findCol("link", "url", "posting"),
      notes: findCol("note", "requirement", "comment", "remark"),
    };

    const hasHeader = cols.airline !== -1 || cols.position !== -1;
    const dataRows = hasHeader ? rows.slice(1) : rows;
    if (!hasHeader) {
      cols = { airline: 0, position: 1, location: 2, group: 3, priority: 4, type: 5, pay: 6, date: 7, status: 8, link: 9, notes: 10 };
    }

    const pick = (r, idx) => (idx >= 0 && r[idx] !== undefined ? r[idx].trim() : "");

    return dataRows
      .map((r) =>
        normalizeApp({
          id: uid(),
          airline: pick(r, cols.airline),
          position: pick(r, cols.position),
          location: pick(r, cols.location),
          group: pick(r, cols.group),
          priority: pick(r, cols.priority),
          type: pick(r, cols.type),
          pay: pick(r, cols.pay),
          date: normalizeDate(pick(r, cols.date)),
          status: normalizeStatus(pick(r, cols.status)),
          link: pick(r, cols.link),
          notes: pick(r, cols.notes),
        })
      )
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
    if (!v || v.includes("not started") || v.includes("wish") || v.includes("prepar") || v.includes("plan")) return "Not Started";
    if (v.includes("interview") || v.includes("assessment") || v.includes("phone") || v.includes("screen")) return "Interviewing";
    if (v.includes("offer") || v.includes("hired") || v.includes("accept")) return "Offer";
    if (v.includes("reject") || v.includes("declin") || v.includes("denied") || v.includes("withdraw") || v.includes("closed") || v.includes("expired")) return "Rejected";
    if (v.includes("no resp") || v.includes("ghost")) return "No Response";
    return "Applied";
  }

  // ---------- Init ----------
  renderStrategy();
  renderPitLane();
  render();
})();
