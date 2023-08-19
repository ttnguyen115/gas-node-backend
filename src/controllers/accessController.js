"use strict"

const AccessService = require("../services/accessService")

class AccessController {
    signUp = async (req, res, next) => {
        try {
            console.log(`[P]::signUp::${req.body}`);
            const accessServiceResponse = await AccessService.signUp(req.body);
            return res.status(201).json(accessServiceResponse)
        } catch (e) {
            next(e)
        }
    }
}

module.exports = new AccessController()