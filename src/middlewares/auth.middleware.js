const jwt = require('jsonwebtoken')


async function authTokenArtistCheck(req, res, next) {

    const token = req.cookies.token;
    if (!token) {
        return res.status(401).json({
            message: "unauthorized"
        })
    }

    try {

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        if (decoded.role !== "artist") {
            return res.status(403).json({
                message: "You don't have access to create an music"
            })
        }

        req.user = decoded;

        next()


    } catch (err) {
        console.log(err)
    }

}

async function authUser(req, res, next) {
    const token = req.cookies.token;

    if (!token) {
        return res.status(401).json({
            message: "unauthorized"
        })
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next()
    } catch (error) {
        console.log(error)
        return res.status(401).json({
            message: "invalid token"
        })
    }
}

module.exports = { authTokenArtistCheck , authUser }