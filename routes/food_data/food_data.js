const express = require('express');
const router = express.Router();
const axios = require('axios')
require('dotenv').config()

router.get('/', async (req, res) => {
    try {
        const response = await axios.get('https://api.nal.usda.gov/fdc/v1/foods/search', {
            
            headers: {'X-Api-Key': process.env.FDC_API_KEY},
            params: {
                'query': req.body.query,
                'dataType': 'Survey (FNDDS)'
            }
            });
            console.log('Success')
            res.send(response.data.foods)
    } catch (error) {
        res.send(error);
    }
   
});

module.exports = router;