const API_URL = "http://localhost:3000/api";

const usersBox = document.getElementById("users");
const auditSelect = document.getElementById("auditSelect");
const auditDetails = document.getElementById("auditDetails");

// ---------- small helpers ----------

function fetchJson(url) {
    return fetch(url).then(response => {
        if (!response.ok) {
            throw new Error("Request failed: " + response.status);
        }
        return response.json();
    });
}

function show(id) {
    document.getElementById(id).hidden = false;
}

function hide(id) {
    document.getElementById(id).hidden = true;
}

function showError(id, message) {
    const element = document.getElementById(id);
    element.textContent = message;
    element.hidden = false;
}

// ---------- users ----------

function renderUsers(users) {
    usersBox.innerHTML = "";

    users.forEach(user => {
        const div = document.createElement("div");
        div.className = "user";
        div.textContent = `${user.id} - ${user.name}`;
        usersBox.appendChild(div);
    });
}

function loadUsers() {
    hide("usersError");
    show("usersLoader");

    fetchJson(`${API_URL}/users`)
        .then(renderUsers)
        .catch(() => showError("usersError", "Failed to load users."))
        .finally(() => hide("usersLoader"));
}

// ---------- audits list (the select) ----------

function renderAuditOptions(audits) {
    audits.forEach(audit => {
        const option = document.createElement("option");
        option.value = audit.fileName;
        option.textContent = audit.timestamp;
        auditSelect.appendChild(option);
    });
}

function loadAudits() {
    hide("auditsError");
    show("auditsLoader");
    auditSelect.disabled = true;

    fetchJson(`${API_URL}/audits`)
        .then(renderAuditOptions)
        .catch(() => showError("auditsError", "Failed to load audits."))
        .finally(() => {
            auditSelect.disabled = false;
            hide("auditsLoader");
        });
}

// ---------- one audit's details ----------

function renderAuditDetails(audit) {
    auditDetails.innerHTML = "";

    ["timestamp", "imported", "skipped"].forEach(key => {
        const p = document.createElement("p");
        p.textContent = `${key}: ${audit[key]}`;
        auditDetails.appendChild(p);
    });
}

function loadAuditDetails(fileName) {
    hide("auditDetailsError");
    auditDetails.innerHTML = "";
    show("auditDetailsLoader");

    fetchJson(`${API_URL}/audits/${encodeURIComponent(fileName)}`)
        .then(renderAuditDetails)
        .catch(() => showError("auditDetailsError", "Failed to load audit."))
        .finally(() => hide("auditDetailsLoader"));
}

auditSelect.addEventListener("change", () => {
    if (!auditSelect.value) {
        auditDetails.innerHTML = "";
        return;
    }
    loadAuditDetails(auditSelect.value);
});

// ---------- start ----------

loadUsers();
loadAudits();