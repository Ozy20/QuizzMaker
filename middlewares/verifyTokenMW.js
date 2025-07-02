const jwt = require("jsonwebtoken");
const config = require("config")


const verifyToken = (req, res, next) => {
    const token = req.header("Authorization"); 
    if (!token) {
        res.status(401).send("Access denied");
    }

    try {
        const payload = jwt.verify(token, config.get("jwtsec"))
        req.user = payload;
        next();
    }
    catch (err) {
        res.status(400).send("invalid token")
    }
}
module.exports= verifyToken;