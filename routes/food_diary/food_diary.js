const express = require("express");
const foodDiarySchema = require("../../schemas/foodDiarySchema");
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


/* JSON Format
{
    "email": "emial@email.email" ,
    "password": "password",
    "id": "ididididididididiid"
}
*/
router.post("/removeFood", authentication, async (req, res) => {
    try {

        var find = await diaryModel.findOne(
            {
                email: req.body.email,
                diary: {
                    _id: req.body.id
                }
            }
        )
        if(!find) {
            // no error here
            throw "No such eleemnt exist"
        }

        await diaryModel.updateOne(
            {
                email: req.body.email
            },
            {
                $pull: {
                    diary: {
                        _id: req.body.id
                    }
                }
            }
        )
        res.status(200).send("Successfully removed food");

    } catch (error) {
        res.status(500).send(error);
    }
});

module.exports = router;
