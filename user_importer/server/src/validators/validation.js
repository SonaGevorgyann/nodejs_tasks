function validateRecord(record) {
    if (!record || typeof record !== "object") {
        return {
            valid: false,
            reason: "Record is not an object"
        };
    }

    if (!Number.isInteger(record.id) || record.id <= 0) {
        return {
            valid: false,
            reason: "ID must be a positive integer"
        };
    }

    if (typeof record.name !== "string" || record.name.trim().length === 0) {
        return {
            valid: false,
            reason: "Name must contain more than whitespace"
        };
    }

    return {
        valid: true
    };
}

module.exports = {
    validateRecord
};