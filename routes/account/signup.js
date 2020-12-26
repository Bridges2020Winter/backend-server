//SIGN UP ROUTE
const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const sha256 = require("crypto-js/sha256");
const userModel = require("../../schemas/userSchema");
const userInformationModel = require("../../schemas/userInformationSchema");
const institutionVerificationModel = require("../../schemas/institutionVerificationModel");
const diaryModel = require("../../schemas/foodDiarySchema");
const signupAuthentication = require("../middleware/authentication");
const e = require("express");

router.get("/", (req, res) => {
    res.send("You've hit the /accounts route");
});
// STEP 1: User creates account
router.post("/signup", async (req, res) => {
    try {
        //Hash the password
        const hashedPassword = await bcrypt.hash(req.body.password, 6);
        //Create model
        const newUser = new userModel({
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email,
            password: hashedPassword,
        });
        //Save model to the databse
        await newUser.save();
        //Send 200 success response back to client
        res.status(200).send("account created");
    } catch (error) {
        //Error indicates duplicate email
        if (error.keyValue.email) {
            res.status(409).send("Duplicate email detected");
            return;
        }
        //Send back generic error response
        res.status(500).send(error);
    }
});

// STEP 2: User fills out information
router.post("/signup/information", signupAuthentication, async (req, res) => {
    try {
        //Check if information has already been filled out
        const query = await userInformationModel.findOne({email: req.body.email})
        if(query)
        {
            throw "Signup information has already been filled out";
        }

        //Check if user is a research participant
        if (req.body.research) {
            //Query institution database, check to see if code is valid
            const query = await institutionVerificationModel.findOne({
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                code: req.body.code,
            });

            if (!query) {
                throw "Research participant does not exist";
            }

            req.body.institutionName = query.institutionName;
        } else {
            req.body.code = -1;
            req.body.institutionName = "n/a";
        }

        const newUserInformation = new userInformationModel({
            dob: req.body.dob, //month.date.year
            weight: req.body.weight, //kilograms
            smoke: req.body.smoke, //true or false
            ethnicity: req.body.ethnicity, //single ethnicity
            sex: req.body.sex, //male or female
            diabetes: req.body.diabetes, //true or false
            status: req.body.status, //unemployed, employed, student
            institutionName: req.body.institutionName,
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            code: req.body.code, //5 digit code provided by instutiton
            email: req.body.email,

            //NEW STUFF
            calorieGoal: req.body.calorieGoal,
            weightManagementGoal: req.body.weightManagementGoal,
            activityLevel: req.body.activityLevel,
            country: req.body.country,
            height: req.body.height,
        });

        await newUserInformation.save();

        //Initialize document for food diary
        const foodDiaryInitialize = new diaryModel({
            email: req.body.email,
            firstName: req.body.firstName,
            lastName: req.body.lastName,
        });

        await foodDiaryInitialize.save();

        res.status(200).send("Sucessfully added information");
    } catch (error) {
        res.status(500).send(error);
    }
});

module.exports = router;
