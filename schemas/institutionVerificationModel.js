const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const institutionVerificationModel = new Schema({
    firstName: {
        type: String,
        required: true,
    },
    lastName: {
        type: String,
        required: true,
    },
    institutionName: {
        type: String,
        required: true,
    },
    code: {
        type: String,
        required: true,
    },
});

module.exports = mongoose.model('institutions', institutionVerificationModel);