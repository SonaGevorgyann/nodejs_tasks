// 1. DOM ELEMENTS
// Find the HTML elements.
const API_URL = "http://localhost:3000/api";
const DELAY_MS = 2000;

const usersBox = document.getElementById("users");
const usersLoader = document.getElementById("usersLoader");
const usersError = document.getElementById("usersError");

const auditSelect = document.getElementById("auditSelect");
const auditsLoader = document.getElementById("auditsLoader");
const auditsError = document.getElementById("auditsError");

const auditDetails = document.getElementById("auditDetails");
const auditDetailsLoader = document.getElementById("auditDetailsLoader");
const auditDetailsError = document.getElementById("auditDetailsError");


// 2. HELPER FUNCTIONS
// Functions for displaying data and errors.

function showError(element, message) {
    element.textContent = message;
    element.hidden = false;
}

function clear(element) {
    element.innerHTML = "";
}

// 3. LOAD USERS
// Fetch users from the backend.

function renderUSers(users) {
    users.forEach(function(user) {
        const div = document.createElement("div");

        div.textContent = user.id + '-' + user.name;
        usersBox.appendChild(div);
    });
}

function getJson(url, callback) {
    const request = new XMLHttpRequest();

    request.onload = function() {
        if(request.status < 200 || request.status >= 300 )
        {
            callback(new Error("Request failed: " + request.status));
            return;
        }
        const data = JSON.parse(request.responseText);
        callback(null, data);
    };

    request.open("GET", url);
    request.send();
}

function loadUsers() {
    usersLoader.hidden = false;
    usersError.hidden = true;

    waitAsync(DELAY_MS, function() {
        getJson(API_URL + "/users", function(error, users) {
            usersLoader.hidden = true;

            if(error)
            {
                showError(usersError, error.message);
                return;
            }
            renderUSers(users);
        });
    });
    
}

// 4. LOAD AUDITS
// Fetch audits and populate the dropdown.

function renderAuditOptions(audits) {
    audits.forEach(function(audit) {
        const option = document.createElement("option");
        option.value = audit.fileName;
        option.textContent = audit.timestamp;
        auditSelect.appendChild(option);
    });
}

function loadAudits() {
    auditsLoader.hidden = false;
    auditsError.hidden = true;

    waitAsync(DELAY_MS, function() {
        getJson(API_URL + "/audits", function(error, audits) {
            auditsLoader.hidden = true;

            if(error)
            {
                showError(auditsError, error.message);
                return;
            }
            renderAuditOptions(audits);
        });
    });
    
}

function waitAsync(ms, callback) {
    setTimeout(callback, ms);
}
// 5. LOAD AUDIT DETAILS
// Fetch details for the selected audit.


function renderAuditDetails(audit) {
    clear(auditDetails);

    ["timestamp", "imported", "skipped"].forEach(function(key) {
        const p = document.createElement("p");
        p.textContent = key + ":" + audit[key];
        auditDetails.appendChild(p);
    });
}


function loadAuditDetails(filename) {
    const url = API_URL + "/audits/" + encodeURIComponent(filename);

    auditDetailsLoader.hidden = false;
    auditDetailsError.hidden = true;

    waitAsync(DELAY_MS, function() {
            getJson(url, function(error, audit) {
            auditDetailsLoader.hidden = true;

            if(error)
            {
                showError(auditDetailsError, error.message);
                return;
            }
            renderAuditDetails(audit);
        });
    });

}

// 6. EVENT LISTENERS
// React to user interactions.


function handleAuditChange() {
    if(!(auditSelect.value))
    {
        clear(auditDetails);
        return;
    }
    loadAuditDetails(auditSelect.value);
}



auditSelect.addEventListener("change", handleAuditChange);
// 7. INITIALIZATION
// Start loading users and audits.

loadUsers();
loadAudits();