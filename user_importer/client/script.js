const API_URL = "http://localhost:3000/api";
const SERVER_URL = "http://localhost:3000";
const DELAY_MS = 2000;

const usersBox = document.getElementById("users");
const usersLoader = document.getElementById("usersLoader");
const usersError = document.getElementById("usersError");

const searchInput = document.getElementById("searchInput");
const sortSelect = document.getElementById("sortSelect");

const auditSelect = document.getElementById("auditSelect");
const auditsLoader = document.getElementById("auditsLoader");
const auditsError = document.getElementById("auditsError");

const auditDetails = document.getElementById("auditDetails");
const auditDetailsLoader = document.getElementById("auditDetailsLoader");
const auditDetailsError = document.getElementById("auditDetailsError");

let allUsers = [];


// HELPER FUNCTIONS

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


// PICTURE

function getPictureUrl(picture) {
    let url = "";

    if (picture) {
        if (picture.startsWith("http")) {
            url = picture;
        } else {
            url = SERVER_URL + picture;
        }
    }

    return url;
}

function createAvatar(user) {
    let avatar;

    if (user.picture) {
        avatar = document.createElement("img");
        avatar.className = "avatar";
        avatar.src = getPictureUrl(user.picture);
        avatar.alt = user.name;
    } else {
        avatar = document.createElement("div");
        avatar.className = "avatar avatar-empty";
        avatar.textContent = user.name.charAt(0).toUpperCase();
    }

    return avatar;
}


// REQUEST

function sendRequest(method, url, body, callback) {
    const request = new XMLHttpRequest();

    request.onload = function() {
        if (request.status < 200 || request.status >= 300) {
            callback(new Error("Request failed: " + request.status));
        } else if (!request.responseText) {
            callback(null, null);
        } else {
            let data = null;
            let parsed = true;

            try {
                data = JSON.parse(request.responseText);
            } catch (error) {
                parsed = false;
            }

            if (parsed) {
                callback(null, data);
            } else {
                callback(new Error("Invalid response from server"));
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

function uploadPicture(id, file, callback) {
    const formData = new FormData();
    formData.append("picture", file);

    const request = new XMLHttpRequest();

    request.onload = function() {
        if (request.status < 200 || request.status >= 300) {
            let message = "Upload failed: " + request.status;

            try {
                const response = JSON.parse(request.responseText);

                if (response.error) {
                    message = response.error;
                }
            } catch (error) {
                message = "Upload failed: " + request.status;
            }

            callback(new Error(message));
        } else {
            callback(null);
        }
    };

    request.onerror = function() {
        callback(new Error("Network error"));
    };

    request.open("POST", API_URL + "/users/" + id + "/picture");
    request.send(formData);
}


// USER FUNCTIONS

function deleteUser(id) {
    if (confirm("Delete user " + id + "?")) {
        usersError.hidden = true;

        sendRequest("DELETE", API_URL + "/users/" + id, undefined, function(error) {
            if (error) {
                showError(usersError, error.message);
            } else {
                loadUsers();
            }
        });
    }
}

function updateUser(id, name) {
    usersError.hidden = true;

    sendRequest("PUT", API_URL + "/users/" + id, { name: name }, function(error) {
        if (error) {
            showError(usersError, error.message);
        } else {
            loadUsers();
        }
    });
}

function renderUsers(users) {
    clear(usersBox);

    if (users.length === 0) {
        usersBox.textContent = "No users found";
    } else {
        users.forEach(function(user) {
            const div = document.createElement("div");
            div.className = "user";

            const label = document.createElement("span");
            label.className = "user-name";
            label.textContent = user.id + " - " + user.name;

            const editButton = document.createElement("button");
            editButton.textContent = "Edit";

            editButton.addEventListener("click", function() {
                const input = document.createElement("input");
                input.type = "text";
                input.className = "edit-input";
                input.value = user.name;

                const saveButton = document.createElement("button");
                saveButton.className = "btn-primary";
                saveButton.textContent = "Save";
                saveButton.addEventListener("click", function() {
                    const name = input.value.trim();

                    if (name) {
                        updateUser(user.id, name);
                    }
                });

                const cancelButton = document.createElement("button");
                cancelButton.textContent = "Cancel";
                cancelButton.addEventListener("click", function() {
                    showUsers();
                });

                clear(div);
                div.append(createAvatar(user), input, saveButton, cancelButton);
            });

            const fileInput = document.createElement("input");
            fileInput.type = "file";
            fileInput.accept = "image/*";
            fileInput.hidden = true;

            fileInput.addEventListener("change", function() {
                const file = fileInput.files[0];

                if (file) {
                    usersError.hidden = true;

                    uploadPicture(user.id, file, function(error) {
                        if (error) {
                            showError(usersError, error.message);
                        } else {
                            loadUsers();
                        }
                    });
                }
            });

            const pictureButton = document.createElement("button");
            pictureButton.textContent = "Change picture";
            pictureButton.addEventListener("click", function() {
                fileInput.click();
            });

            const deleteButton = document.createElement("button");
            deleteButton.className = "btn-danger";
            deleteButton.textContent = "Delete";
            deleteButton.addEventListener("click", function() {
                deleteUser(user.id);
            });

            div.appendChild(createAvatar(user));
            div.appendChild(label);
            div.appendChild(editButton);
            div.appendChild(pictureButton);
            div.appendChild(fileInput);
            div.appendChild(deleteButton);

            usersBox.appendChild(div);
        });
    }
}

function showUsers() {
    const text = searchInput.value.trim().toLowerCase();

    const result = allUsers.filter(function(user) {
        return user.name.toLowerCase().includes(text);
    });

    const sortBy = sortSelect.value;

    result.sort(function(a, b) {
        let order;

        if (sortBy === "name") {
            order = a.name.localeCompare(b.name);
        } else {
            order = Number(a.id) - Number(b.id);
        }

        return order;
    });

    renderUsers(result);
}

function loadUsers() {
    usersError.hidden = true;
    usersLoader.hidden = false;

    sendRequest("GET", API_URL + "/users", undefined, function(error, users) {
        if (error) {
            usersLoader.hidden = true;
            showError(usersError, error.message);
        } else {
            waitAsync(DELAY_MS, function() {
                usersLoader.hidden = true;
                allUsers = users;
                showUsers();
            });
        }
    });
}


// AUDITS

function renderAuditOptions(audits) {
    clear(auditSelect);

    const emptyOption = document.createElement("option");
    emptyOption.value = "";
    emptyOption.textContent = "Select audit";
    auditSelect.appendChild(emptyOption);

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

    sendRequest("GET", API_URL + "/audits", undefined, function(error, audits) {
        if (error) {
            auditsLoader.hidden = true;
            showError(auditsError, error.message);
        } else {
            waitAsync(DELAY_MS, function() {
                auditsLoader.hidden = true;
                renderAuditOptions(audits);
            });
        }
    });
}

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

    sendRequest("GET", url, undefined, function(error, audit) {
        if (error) {
            auditDetailsLoader.hidden = true;
            showError(auditDetailsError, error.message);
        } else {
            waitAsync(DELAY_MS, function() {
                if (auditSelect.value === filename) {
                    auditDetailsLoader.hidden = true;
                    renderAuditDetails(audit);
                }
            });
        }
    });
}

function handleAuditChange() {
    if (!auditSelect.value) {
        clear(auditDetails);
        auditDetailsLoader.hidden = true;
    } else {
        loadAuditDetails(auditSelect.value);
    }
}

auditSelect.addEventListener("change", handleAuditChange);
searchInput.addEventListener("input", showUsers);
sortSelect.addEventListener("change", showUsers);

loadUsers();
loadAudits();