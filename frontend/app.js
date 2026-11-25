const API_BASE = (
  window.UNIPULSE_API_BASE ||
  (["localhost", "127.0.0.1"].includes(window.location.hostname) &&
  window.location.port !== "3000"
    ? "http://127.0.0.1:5000"
    : window.location.origin)
).replace(/\/$/, "");
const app = document.querySelector("#app");
const modal = document.querySelector("#registration-modal");
const registrationForm = document.querySelector("#registration-form");
let eventsCache = [];
let activeEvent = null;

function uuidFallback() {
  if (crypto.randomUUID) return crypto.randomUUID();
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, char => {
    const r = Math.random() * 16 | 0;
    return char === "x" ? r : (r & 0x3 | 0x8);
  });
}

function getUserId() {
  let id = localStorage.getItem("unipulse_user_id");
  if (!id) {
    id = uuidFallback();
    localStorage.setItem("unipulse_user_id", id);
  }
  return id;
}

function escapeHtml(value) {
  return String(value ?? "").replace(/[&<>"']/g, char => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;"
  })[char]);
}

function formatDate(value) {
  if (!value) return "Date to be announced";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return String(value);
  return new Intl.DateTimeFormat("en", { month: "short", day: "numeric", year: "numeric" }).format(date);
}

function formatDateBadge(value) {
  if (!value) return "TBA";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "TBA";
  return new Intl.DateTimeFormat("en", { month: "short", day: "numeric" }).format(date).toUpperCase();
}

function eventImage(event) {
  if (event.image_url) return event.image_url;
  const seed = encodeURIComponent(event.title || "campus event");
  return `https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=1400&q=82&sig=${seed}`;
}

function statusTag(status) {
  const value = String(status || "open").toLowerCase();
  if (value === "cancelled") return '<span class="tag" style="color:#ba1a1a;background:#ffdad6">Cancelled</span>';
  if (value === "draft") return '<span class="tag">Draft</span>';
  return '<span class="tag" style="color:#047857;background:#ecfdf5">Registration open</span>';
}

async function fetchEvents() {
  const response = await fetch(`${API_BASE}/api/events`, {
    headers: { "Accept": "application/json" },
    cache: "no-store"
  });
  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    throw new Error(body.error || `API returned ${response.status}`);
  }
  return response.json();
}

async function fetchEvent(id) {
  const response = await fetch(`${API_BASE}/api/events/${encodeURIComponent(id)}`);
  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    throw new Error(body.error || `API returned ${response.status}`);
  }
  return response.json();
}

function cardMarkup(event) {
  const capacity = event.capacity ? `${event.capacity} capacity` : "Capacity open";
  return `
    <article class="event-card">
      <a href="#event/${encodeURIComponent(event.id)}" aria-label="View ${escapeHtml(event.title)}">
        <div class="card-media" style="background-image:url('${escapeHtml(eventImage(event))}')">
          <span class="date-badge">${formatDateBadge(event.starts_at || event.date)}</span>
          ${statusTag(event.status)}
        </div>
        <div class="card-body">
          <div class="card-location">${escapeHtml(event.location || "Campus venue")}</div>
          <h3>${escapeHtml(event.title || "Untitled event")}</h3>
          <p>${escapeHtml(event.description || "Explore event details and reserve a student spot.")}</p>
          <div class="card-footer">
            <small>${escapeHtml(capacity)}</small>
            <span class="tag">View details →</span>
          </div>
        </div>
      </a>
    </article>`;
}

function renderHome(events) {
  const featured = events[0];
  const remaining = featured?.capacity ? Math.max(featured.capacity - 0, 0) : null;
  app.innerHTML = `
    <section class="hero">
      <div class="shell">
        <div class="hero-copy">
          <span class="live-pill">Campus event calendar live</span>
          <h1>Discover what's happening <span>across campus</span></h1>
          <p>Explore student events, university activities, talks, workshops and athletics.</p>
        </div>
        ${featured ? `
          <div class="featured">
            <div class="featured-media" style="background-image:url('${escapeHtml(eventImage(featured))}')">
              <div class="featured-media-content">
                ${statusTag(featured.status)}
                <h2>${escapeHtml(featured.title)}</h2>
                <div class="featured-meta">
                  <span>${formatDate(featured.starts_at || featured.date)}</span>
                  <span>${escapeHtml(featured.location || "Campus venue")}</span>
                </div>
              </div>
            </div>
            <div class="featured-panel">
              <div>
                <div class="status-row">
                  <div><span>Organized by</span><strong>${escapeHtml(featured.organizer_name || "Campus organization")}</strong></div>
                  <div><span>Entry</span><strong>Student pass</strong></div>
                </div>
                <div class="capacity">
                  <div class="capacity-head"><span>Venue capacity</span><strong>${escapeHtml(featured.capacity ? `${featured.capacity} seats` : "Open")}</strong></div>
                  ${featured.capacity ? `<div class="progress"><i style="width:60%"></i></div>` : ""}
                  ${remaining === 0 ? '<div class="capacity-warning">This event is currently full.</div>' : ""}
                </div>
              </div>
              <div class="feature-actions">
                <button class="button primary" type="button" data-register="${escapeHtml(featured.id)}">Reserve student spot</button>
                <a class="button secondary" href="#event/${encodeURIComponent(featured.id)}">Full details</a>
              </div>
            </div>
          </div>` : ""}
      </div>
    </section>
    <section class="catalog" id="events">
      <div class="shell">
        <div class="section-head">
          <div><span class="eyebrow">Campus directory</span><h2>Upcoming events &amp; assemblies</h2></div>
          <div class="filter-bar" id="filter-bar">
            <button class="filter-chip active" data-filter="all" type="button">All events</button>
            <button class="filter-chip" data-filter="open" type="button">Open</button>
            <button class="filter-chip" data-filter="draft" type="button">Draft</button>
          </div>
        </div>
        <div class="events-grid" id="events-grid">${events.map(cardMarkup).join("") || '<div class="empty-state">No events are available yet.</div>'}</div>
      </div>
    </section>`;
  bindEventActions();
  bindFilters(events);
}

function bindFilters(events) {
  document.querySelectorAll(".filter-chip").forEach(button => {
    button.addEventListener("click", () => {
      document.querySelectorAll(".filter-chip").forEach(item => item.classList.remove("active"));
      button.classList.add("active");
      const filter = button.dataset.filter;
      const filtered = filter === "all"
        ? events
        : events.filter(event => {
            const status = String(event.status || "open").toLowerCase();
            return filter === "open" ? ["open", "upcoming", "active"].includes(status) : status === filter;
          });
      const grid = document.querySelector("#events-grid");
      grid.innerHTML = filtered.map(cardMarkup).join("") || '<div class="empty-state">No events match this filter.</div>';
    });
  });
}

function bindEventActions() {
  document.querySelectorAll("[data-register]").forEach(button => {
    button.addEventListener("click", () => openRegistration(button.dataset.register));
  });
}

async function openRegistration(eventId) {
  activeEvent = eventId ? eventsCache.find(event => event.id === eventId) : null;
  if (!activeEvent && eventId) activeEvent = await fetchEvent(eventId).catch(() => null);
  document.querySelector("#registration-title").textContent = activeEvent?.title ? `Reserve: ${activeEvent.title}` : "Reserve your spot";
  document.querySelector("#user-id").value = getUserId();
  document.querySelector("#registration-error").hidden = true;
  modal.showModal();
}

async function renderDetail(id) {
  app.innerHTML = '<div class="detail-page"><div class="shell"><div class="loading">Loading event…</div></div></div>';
  try {
    const event = await fetchEvent(id);
    activeEvent = event;
    app.innerHTML = `
      <section class="detail-page">
        <div class="shell">
          <nav class="breadcrumbs"><a href="#events">Events</a><span>/</span><span>${escapeHtml(event.title || "Event details")}</span></nav>
          <div class="detail-grid">
            <article class="detail-card">
              <div class="detail-cover" style="background-image:url('${escapeHtml(eventImage(event))}')"></div>
              <div class="detail-content">
                ${statusTag(event.status)}
                <h1>${escapeHtml(event.title || "Untitled event")}</h1>
                <p class="description">${escapeHtml(event.description || "No description has been provided for this event.")}</p>
              </div>
            </article>
            <aside class="side-card">
              <h3>Event details</h3>
              ${statusTag(event.status)}
              <dl>
                <div><dt>Date</dt><dd>${formatDate(event.starts_at || event.date)}</dd></div>
                <div><dt>Location</dt><dd>${escapeHtml(event.location || "Campus venue")}</dd></div>
                <div><dt>Capacity</dt><dd>${escapeHtml(event.capacity ?? "Open")}</dd></div>
                <div><dt>Organizer</dt><dd>${escapeHtml(event.organizer_name || "Campus organization")}</dd></div>
              </dl>
              <button class="button primary full" type="button" data-register="${escapeHtml(event.id)}">Reserve student spot</button>
            </aside>
          </div>
        </div>
      </section>`;
    bindEventActions();
  } catch (error) {
    app.innerHTML = `<div class="detail-page"><div class="shell"><div class="error-state"><strong>Unable to load event</strong>${escapeHtml(error.message)}<br><br><a class="button secondary" href="#events">Back to events</a></div></div></div>`;
  }
}

function renderSubmit() {
  app.innerHTML = `
    <section class="submit-page">
      <div class="shell submit-layout">
        <div class="submit-head">
          <span class="eyebrow">Facility request</span>
          <h1>Submit a campus event</h1>
          <p>Prepare an event submission for review. Submission creation is not included in the current API.</p>
        </div>
        <form class="form-card form-grid" id="submit-form">
          <label>Event title <input name="title" required placeholder="Annual student innovation summit"></label>
          <label>Organization <input name="organization" required placeholder="Faculty or student organization"></label>
          <label>Event date <input name="date" type="datetime-local" required></label>
          <label>Campus venue <input name="location" required placeholder="Student Innovation Complex"></label>
          <label>Expected attendance <input name="capacity" type="number" min="1" placeholder="300"></label>
          <label>Category
            <select name="category"><option>Technology</option><option>Cultural & Arts</option><option>Athletics</option><option>Workshop</option><option>Guest Talk</option></select>
          </label>
          <label class="full">Event description <textarea name="description" required placeholder="Describe the event agenda and purpose"></textarea></label>
          <div class="api-note">This frontend can browse events and create registrations through the Flask API. The backend does not currently expose <strong>POST /api/events</strong>, so this form will save a draft locally rather than publishing an event.</div>
          <button class="button secondary" type="button" id="save-draft">Save draft</button>
          <button class="button primary" type="submit">Submit for review</button>
        </form>
      </div>
    </section>`;
  const form = document.querySelector("#submit-form");
  document.querySelector("#save-draft").addEventListener("click", () => {
    const draft = Object.fromEntries(new FormData(form));
    localStorage.setItem("unipulse_event_draft", JSON.stringify(draft));
    toast("Event draft saved locally");
  });
  form.addEventListener("submit", event => {
    event.preventDefault();
    toast("Submission recorded locally; the backend event-creation endpoint is not available");
  });
  const saved = JSON.parse(localStorage.getItem("unipulse_event_draft") || "null");
  if (saved) {
    for (const [key, value] of Object.entries(saved)) {
      if (form.elements[key]) form.elements[key].value = value;
    }
  }
}

registrationForm.addEventListener("submit", async event => {
  event.preventDefault();
  const submitButton = document.querySelector("#confirm-registration");
  const error = document.querySelector("#registration-error");
  submitButton.disabled = true;
  submitButton.textContent = "Confirming…";
  error.hidden = true;
  try {
    const userId = document.querySelector("#user-id").value.trim();
    localStorage.setItem("unipulse_user_id", userId);
    const response = await fetch(`${API_BASE}/api/registrations`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user_id: userId, event_id: activeEvent.id })
    });
    const body = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(body.error || `Registration failed (${response.status})`);
    modal.close();
    toast("Registration confirmed");
  } catch (err) {
    error.textContent = err.message;
    error.hidden = false;
  } finally {
    submitButton.disabled = false;
    submitButton.textContent = "Confirm registration";
  }
});

function toast(message) {
  const item = document.createElement("div");
  item.className = "toast";
  item.textContent = message;
  document.querySelector("#toast-region").appendChild(item);
  setTimeout(() => item.remove(), 4000);
}

async function route() {
  const hash = window.location.hash || "#home";
  document.querySelectorAll("[data-nav]").forEach(link => link.classList.toggle("active", hash.includes(link.dataset.nav)));
  if (hash.startsWith("#event/")) {
    await renderDetail(decodeURIComponent(hash.slice("#event/".length)));
  } else if (hash === "#submit") {
    renderSubmit();
  } else {
    app.innerHTML = '<section class="hero"><div class="shell"><div class="loading">Loading campus events…</div></div></section>';
    try {
      eventsCache = await fetchEvents();
      renderHome(eventsCache);
      if (hash === "#events") document.querySelector("#events")?.scrollIntoView();
    } catch (error) {
      const detail = error instanceof TypeError
        ? "The API request was blocked or the API route could not be reached."
        : error.message;
      app.innerHTML = `<section class="catalog"><div class="shell"><div class="error-state"><strong>Backend unavailable</strong>${escapeHtml(detail)}<br><br><button class="button secondary" type="button" onclick="location.reload()">Try again</button></div></div></section>`;
    }
  }
}

document.querySelector("#menu-button").addEventListener("click", () => {
  document.querySelector(".nav-links").classList.toggle("open");
});

document.querySelector("#global-search").addEventListener("input", event => {
  if (!window.location.hash.startsWith("#home") && window.location.hash !== "" && window.location.hash !== "#events") {
    window.location.hash = "#events";
  }
  const query = event.target.value.trim().toLowerCase();
  const grid = document.querySelector("#events-grid");
  if (!grid) return;
  const filtered = eventsCache.filter(item =>
    `${item.title || ""} ${item.description || ""} ${item.location || ""}`.toLowerCase().includes(query)
  );
  grid.innerHTML = filtered.map(cardMarkup).join("") || '<div class="empty-state">No events match your search.</div>';
});

window.addEventListener("hashchange", route);
route();
