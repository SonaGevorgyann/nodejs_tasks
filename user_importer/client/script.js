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


function sendRequest(method, url, body, callback) {
    const request = new XMLHttpRequest();

    request.onload = function() {
        if (request.status < 200 || request.status >= 300) {
            callback(new Error("Request failed: " + request.status));
            return;
        }

        let data = null;

        if (request.responseText) {
            try {
                data = JSON.parse(request.responseText);
            } catch (e) {
                callback(new Error("Invalid response from server"));
                return;
            }
        }

        callback(null, data);
    };

    request.onerror = function() {
        callback(new Error("Network error"));
    };

    request.open(method, url);

    if (body !== undefined) {
        request.setRequestHeader("Content-Type", "application/json");
        request.send(JSON.stringify(body));
    } else {
        request.send();
    }
}


function deleteUser(id) {
    if (!confirm("Delete user " + id + "?")) return;

    usersError.hidden = true;

    sendRequest("DELETE", API_URL + "/users/" + id, undefined, function(error) {
        if (error) {
            showError(usersError, error.message);
            return;
        }
        loadUsers();
    });
}


function renderUsers(users) {
    clear(usersBox);

    users.forEach(function(user) {
        const div = document.createElement("div");

        const label = document.createElement("span");
        label.textContent = user.id + " - " + user.name;

        const deleteButton = document.createElement("button");
        deleteButton.textContent = "Delete";
        deleteButton.addEventListener("click", function() {
            deleteUser(user.id);
        });

        div.appendChild(label);
        div.appendChild(document.createTextNode(" "));
        div.appendChild(deleteButton);

        usersBox.appendChild(div);
    });
}


function loadUsers() {
    usersLoader.hidden = false;
    usersError.hidden = true;

    waitAsync(DELAY_MS, function() {
        sendRequest("GET", API_URL + "/users", undefined, function(error, users) {
            usersLoader.hidden = true;

            if(error)
            {
                showError(usersError, error.message);
                return;
            }
            renderUsers(users);
        });
    });
    
}
// CREATE DELETE UPDATE SAVE BUTTONS FOR USERS

















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
        sendRequest("Get", API_URL + "/audits", undefined, function(error, audits) {
            auditsLoader.hidden = true;

            if(error)  {
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

    clear(auditDetails);
    auditDetailsLoader.hidden = false;
    auditDetailsError.hidden = true;

    sendRequest("Get", url, undefined, function(error, audit) {
        //auditDetailsLoader.hidden = true;

        if(error)
        {
            showError(auditDetailsError, error.message);
        }
        else {
            waitAsync(DELAY_MS, function() {
                auditDetailsLoader.hidden = true;
                renderAuditDetails(audit);
            });
        }
    });
}



function loadAuditDetails2(filename) {
    const url = API_URL + "/audits/" + encodeURIComponent(filename);

    clear(auditDetails);
    auditDetailsLoader.hidden = false;
    auditDetailsError.hidden = true;

    waitAsync(DELAY_MS, function() {
        sendRequest("Get", url, undefined, function(error, audit) {
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
    if(!(auditSelect.value)){
        clear(auditDetails);
    } else {
      loadAuditDetails(auditSelect.value);
    }
  
}



auditSelect.addEventListener("change", handleAuditChange);
// 7. INITIALIZATION
// Start loading users and audits.

loadUsers();
loadAudits();