const { Readable } = require("stream");
const FileReader = require("filereader");
const formidable = require("formidable");
const FormData = require("form-data");
const axios = require("axios");
const fs = require("fs");

const fetch = require("node-fetch");
const express = require("express");
const router = express.Router();
require("dotenv").config();

function getFoodData(foodName) {
    const params = {
        api_key: "z9COYvsFzYhdkffIEPHzZPrRSX88TGuWjJsBblxm", //https://fdc.nal.usda.gov/api-key-signup.html This link will give you your api key
        query: foodName,
        dataType: ["Survey (FNDDS)"],
        pagesize: 5,
    };

    const api_url = `https://api.nal.usda.gov/fdc/v1/foods/search?api_key=${encodeURIComponent(
        params.api_key
    )}&query=${encodeURIComponent(params.query)}&dataType=${encodeURIComponent(
        params.dataType
    )}&pageSize=${encodeURIComponent(params.pagesize)}`;

    return fetch(api_url).then((response) => response.json());
}

router.get("/getFoodData", (req, res) => {
    getFoodData(req.body.foodName).then((data) => {
        if (data.foods.length == 0) {
            res.send("Nothing found!");
        } else {
            let nameMappings = {
                //"Protein":"Protein",
                //"Total lipid (fat)":"fat",
                "Carbohydrate, by difference": "carbohydrates",
                //"Energy":"Calories",
                //"Sugars, total including NLEA":"Sugars",
                //"Fiber, total dietary":"Fiber",
                Cholesterol: "cholesterol",
                "Sodium, Na": "sodium",
            };
            let nutrientResults = {};
            for (nutrientIndex in data.foods[0].foodNutrients) {
                let nutrient = data.foods[0].foodNutrients[nutrientIndex];
                let shortName = nameMappings[nutrient.nutrientName];
                if (shortName) {
                    nutrientResults[shortName] = {
                        rawValue: nutrient.value,
                        unit: nutrient.unitName,
                    };
                }
            }
            res.json(nutrientResults);
        }
    });
});

module.exports = router;
