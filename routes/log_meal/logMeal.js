const { Readable } = require("stream");
const FileReader = require("filereader");
const formidable = require("formidable");
const FormData = require("form-data");
const axios = require("axios");
const fs = require("fs");
const https = require('https');
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

router.post("/getFoodData", (req, res) => {
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

var sendData = (response) => {
    var form = new FormData();
    
    form.append('image', fs.createReadStream('spag2.jpg'));//change to a file that makes sense

    var headers = form.getHeaders();
    headers['Authorization'] = 'Bearer e14ac579cf7305c55ab28845b2561e13010c87f6';
    const options = {
	hostname: 'api.logmeal.es',
	port: 443,
	path: '/v2/recognition/dish',
	method: 'POST',
	headers: headers,
    };
    

    const req = https.request(options, (res) => {
	console.log('statusCode:', res.statusCode);
	console.log('headers:', res.headers);

	res.on('data', (d) => {
	    let parsed = JSON.parse(d);
	    if (('recognition_results' in parsed) && (parsed.recognition_results != [])){
		let results = parsed.recognition_results;
		console.log(results[0]);
		//response.end("Food: " + results[0].name + " with prob: " + results[0].prob + "\n");
		stringResult = results[0].name;
		for (i = 1; i < 4 && i < results.length; ++i) {
                    stringResult += "/" + results[i].name;
		}
		
		response.end(stringResult + "\n");
            }
	    else {
		response.end('No food results returned!\n');
	    }
	});
    });
    form.pipe(req);
    req.on('error', (e) => {
	console.error(e);
    });
}

router.post("/imageRec", (req, res) => {
    
	console.log('statusCode:', res.statusCode);
	console.log('headers:', res.headers);
    var form = new formidable.IncomingForm();
    form.parse(req, function(err, fields, files) {
        if (err) {
            console.error(err.message);
            return;
	}
        console.log(files);
	if (files.foodpicture) {
            
            res.writeHead(200, {'content-type': 'text/plain'});
            var oldPath = files.foodpicture.path;
            var newPath = "spag2.jpg";
            fs.rename(oldPath, newPath, function (err) {
		if (err) {
                    
                    //res.writeHead(500, {'content-type': 'text/plain'});
                    throw err;
		}
		
		//res.writeHead(200, {'content-type': 'text/plain'});
		sendData(res);
            });
	}
    });
});

module.exports = router;
