const userModel = require("../../schemas/userSchema");
const bcrypt = require("bcrypt");

const signupAuthentication = async (req, res, next) => {
    try {
        const query = await userModel.findOne({ email: req.body.email });

        const match = await bcrypt.compare(req.body.password, query.password);
        if (!match) {
            throw "Authentication failed";
        }
        req.body.firstName = query.firstName; 
        req.body.lastName = query.lastName;
        next();
    } catch (error) {
        res.status(500).send(error);
    }
};

module.exports = signupAuthentication;
