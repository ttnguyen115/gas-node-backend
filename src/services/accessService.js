"use strict"

const shopModel = require("../models/shopModel")
const bcrypt = require("bcrypt")
const crypto = require("crypto")

const RoleShop = {
    SHOP: '0001',
    WRITER: '0002',
    EDITOR: '0003',
    ADMIN: '0000'
}

class AccessService {
    static signUp = async ({name, email, password}) => {
        try {
            const holderShop = await shopModel.findOne({email}).lean()
            if (holderShop) {
                return {
                    code: 'xxx',
                    message: 'Shop already registered!'
                }
            }
            const hashPassword = await bcrypt.hash(password, 10)
            const newShop = await shopModel.create({name, email, password: hashPassword, roles: [RoleShop.SHOP]})
            if (newShop) {
                const {privateKey, publicKey} = crypto.generateKeyPair('rsa', {
                    modulusLength: 4096
                })
                console.log({privateKey, publicKey})
            }
        } catch (e) {
            return {
                code: 'xxx',
                message: e.message,
                status: 'error'
            }
        }
    }
}

module.exports = AccessService