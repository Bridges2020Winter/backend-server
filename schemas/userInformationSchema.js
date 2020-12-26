const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userInformationSchema = new Schema({
    //Format: month.date.year
    dob: {
        type: String,
        required: true,
    },
    height:{
        type: Number,
        required: true,
    },
    //Kilograms
    weight: {
        type: Number,
        required: true,
    },
    //True, false
    smoke: {
        type: Boolean,
        required: true,
    },
    //Single ethnicity string
    ethnicity: {
        type: String,
        required: true,
    },
    //Male or female
    sex: {
        type: String,
        required: true,
    },
    //True or false
    diabetes: {
        type: Boolean,
        required: true,
    },
    country:{
        type: String,
        required: true,
    },
    activityLevel:{
        type: Number,
        required: true,
    },
    weightManagementGoal:{
        type: Number,
        required: true,
    },
    calorieGoal:{
        type: Number,
        required: true,
    },
    //Employed, unemployed, or student
    status: {
        type: String,
        required: true,
    },
    institutionName: {
        type: String,
        required: true,
    },
    //Patient code
    code:{
        type: String,
        required: true,
        unique: true,
    },
    firstName: {
        type: String,
        required: true,
    },
    lastName: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    }
});

module.exports = mongoose.model('userInformations', userInformationSchema);