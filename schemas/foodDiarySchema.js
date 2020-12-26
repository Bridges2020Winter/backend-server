const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const foodDiary = new Schema({
    //Uses email to relate across databases
    email: {
        type: String,
        required: true,
    },
    firstName: {
        type: String,
        required: true,
    },
    lastName: {
        type: String,
        required: true,
    },
    diary: [
        {
            servingSize: Number,
            cholesterol: Number,
            fat: Number,
            carbohydrates: Number,
            sodium: Number,
            date: {
                type: Date,
                default: Date.now,
            }
            
        }
    ],
});
module.exports = mongoose.model('foodDiary', foodDiary);