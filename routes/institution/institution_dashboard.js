const express = require('express');
const router = express.Router();
const sha256 = require('crypto-js/sha256');
const institutionVerificationModel = require('../../schemas/institutionVerificationModel');

router.post('/addPatient', async (req, res) => {
    try {
        //Generate unique code given first name + last name + institution name + SALT
        const code = sha256(req.body.firstName + req.body.lastName + req.body.institutionName + process.env.SALT);

        //Shorten string to 5 
        const shortenHash = code.toString().substring(0, 5);

        const model = new institutionVerificationModel({
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            institutionName: req.body.institutionName,
            code: shortenHash,
        })

        await model.save();

        res.status(200).send("Patient sucessfully added to database. Unique code is: " + shortenHash);

    } catch (error) {
        res.status(500).send(error);
    }
});
router.get('/', (req, res) => {
    res.send("You've hit the institution dashboard");
})

module.exports = router;