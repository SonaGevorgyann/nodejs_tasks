// 1. DOM ELEMENTS
// Find the HTML elements.
const API_URL = "http://localhost:3000/api";
const DELAY_MS = 2000;

const usersBox = document.getElementById("users");
const usersLoader = document.getElementById("usersLoader");
const usersError = document.getElementById("usersError");
const searchInput = document.getElementById("searchInput");

const auditSelect = document.getElementById("auditSelect");
const auditsLoader = document.getElementById("auditsLoader");
const auditsError = document.getElementById("auditsError");

const auditDetails = document.getElementById("auditDetails");
const auditDetailsLoader = document.getElementById("auditDetailsLoader");
const auditDetailsError = document.getElementById("auditDetailsError");

let allUsers = [];

// 2. HELPER FUNCTIONS
// Functions for displaying data and errors.

function showError(element, message) {
    element.textContent = message;
    element.hidden = false;
}

function clear(element) {
    element.innerHTML = "";
}


function waitAsync(ms, callback) {
    setTimeout(callback, ms);
}


function formatTimestamp(value) {
    const date = new Date(/^\d+$/.test(String(value)) ? Number(value) : value);

    if (isNaN(date.getTime())) {
        return String(value);
    }

    return date.toLocaleString("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit"
    });
}


// 3. LOAD USERS
// Fetch users from the backend.


function sendRequest(method, url, body, callback) {
    const request = new XMLHttpRequest();

    request.onload = function() {
        if (request.status < 200 || request.status >= 300) {
            callback(new Error("Request failed: " + request.status));
        } else {
            let data = null;

            if (request.responseText) {
                try {
                    data = JSON.parse(request.responseText);
                    callback(null, data);
                } catch (e) {
                    callback(new Error("Invalid response from server"));
                }
            } else {
                callback(null, data);
            }
        }
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
        }
        else {
            loadUsers();
        }
    });
}


function updateUser(id, name) {
    usersError.hidden = true;

    sendRequest("PUT", API_URL + "/users/" + id, { name: name }, function(error) {
        if (error) {
            showError(usersError, error.message);
        }
        else {
            loadUsers();
        }
    }); 
}



function renderUsers(users) {
    clear(usersBox);

    if (users.length === 0) {
        usersBox.textContent = "No users found";
        return;
}

    users.forEach(function(user) {
        const div = document.createElement("div");

        const label = document.createElement("span");
        label.textContent = user.id + " - " + user.name;
        
        const editButton = document.createElement("button");
        editButton.textContent= "Edit";

        editButton.addEventListener("click", function() {
            const input = document.createElement("input");
            input.value = user.name;

            const saveButton = document.createElement("button");
            saveButton.textContent = "Save";
            saveButton.addEventListener("click", function() {
                const name = input.value.trim();
                if (name) {
                    updateUser(user.id, name);
                };
            });

            const cancelButton = document.createElement("button");
            cancelButton.textContent = "Cancel";
            cancelButton.addEventListener("click", function() {
                showUsers();   // redraws the original rows
            });

            clear(div);
            div.append(user.id + " - ", input, " ", saveButton, " ", cancelButton);
        });


        const deleteButton = document.createElement("button");
        deleteButton.textContent = "Delete";
        deleteButton.addEventListener("click", function() {
            deleteUser(user.id);
        });



        div.appendChild(label);
        div.appendChild(editButton);
        div.appendChild(deleteButton);
        usersBox.appendChild(div);
    });
}

function showUsers() {
    const text = searchInput.value.trim().toLowerCase();

    const result = allUsers.filter(function(user) {
        return user.name.toLowerCase().includes(text);
    });

    renderUsers(result);
}


function loadUsers() {
    usersError.hidden = true;
    usersLoader.hidden = false;

    sendRequest("GET", API_URL + "/users", undefined, function(error, users) {
        
        if(error)
            {
                showError(usersError, error.message);
            }
            else {
                waitAsync(DELAY_MS, function() {
                    usersLoader.hidden = true;
                    allUsers = users;
                    showUsers();
            });
        }
    });
}


// 4. LOAD AUDITS
// Fetch audits and populate the dropdown.

function renderAuditOptions(audits) {
    audits.forEach(function(audit) {
        const option = document.createElement("option");
        option.value = audit.fileName;
        option.textContent = formatTimestamp(audit.timestamp);
        auditSelect.appendChild(option);
    });
}

function loadAudits() {
    auditsLoader.hidden = false;
    auditsError.hidden = true;

    sendRequest("Get", API_URL + "/audits", undefined, function(error, audits) {
        
        if(error)  {
            showError(auditsError, error.message);
        }
        else {
            waitAsync(DELAY_MS, function() {
                auditsLoader.hidden = true;
                renderAuditOptions(audits);
            });
        }
    });
}

// 5. LOAD AUDIT DETAILS
// Fetch details for the selected audit.


function renderAuditDetails(audit) {
    clear(auditDetails);

    ["timestamp", "imported", "skipped"].forEach(function(key) {
        const p = document.createElement("p");

        let value = audit[key];

        if (key === "timestamp") {
            value = formatTimestamp(value);
        }

        p.textContent = key + ": " + value;
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
searchInput.addEventListener("input", showUsers);
// 7. INITIALIZATION
// Start loading users and audits.

loadUsers();
loadAudits();