const express = require("express");
const router = express.Router();
const diaryModel = require("../../schemas/foodDiarySchema");
const authentication = require("../middleware/authentication");

router.get("/", (req, res) => {
    res.send("You've hit the food diary route");
});

router.post("/addFood", authentication, async (req, res) => {
    try {
        await diaryModel.updateOne(
            { email: req.body.email },
            {
                $push: {
                    diary: {
                        servingSize: req.body.servingSize,
                        cholesterol: req.body.cholesterol,
                        fat: req.body.fat,
                        carbohydrates: req.body.carbohydrates,
                        sodium: req.body.sodium,
                    },
                },
            }
        );
        res.status(200).send("Sucessfully inserted food into food diary");
    } catch (error) {
        res.status(500).send(error);
    }
});

module.exports = router;
