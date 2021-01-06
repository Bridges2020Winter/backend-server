const express = require("express");
const foodDiarySchema = require("../../schemas/foodDiarySchema");
const router = express.Router();
const diaryModel = require("../../schemas/foodDiarySchema");
const authentication = require("../middleware/authentication");

router.get("/", (req, res) => {
    res.send("You've hit the food diary route");
});

router.post("/queryByDate", authentication, async (req, res) => {
    try {
        const query = await diaryModel.find({
            email: req.body.email,
            "diary.date": req.body.date,
        });

        let queryDate = [];
        for (let i = 0; i < query[0].diary.length; i++) {
            if (query[0].diary[i].date == req.body.date) {
                queryDate.push(query[0].diary[i]);
            }
        }
        res.send(queryDate);
    } catch (error) {
        res.status(500).send(error);
    }
});

router.post("/addFood", authentication, async (req, res) => {
    try {
        //Get the date and format it
        const date = new Date();
        const dd = String(date.getDate()).padStart(2, "0");
        const mm = String(date.getMonth() + 1).padStart(2, "0");
        const yyyy = date.getFullYear();
        const dateString = mm + "-" + dd + "-" + yyyy;

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
                        date: dateString,
                    },
                },
            }
        );
        res.status(200).send("Sucessfully inserted food into food diary");
    } catch (error) {
        res.status(500).send(error);
    }
});

/* JSON Format
{
    "email": "emial@email.email" ,
    "password": "password",
    "id": "ididididididididiid"
}
*/
router.post("/removeFood", authentication, async (req, res) => {
    try {
        var find = await diaryModel.findOne({
            email: req.body.email,
            diary: {
                _id: req.body.id,
            },
        });
        if (!find) {
            // no error here
            throw "No such element exist";
        }

        await diaryModel.updateOne(
            {
                email: req.body.email,
            },
            {
                $pull: {
                    diary: {
                        _id: req.body.id,
                    },
                },
            }
        );
        res.status(200).send("Successfully removed food");
    } catch (error) {
        res.status(500).send(error);
    }
});

module.exports = router;
