"use strict"

const mongoose = require("mongoose")
const os = require("os");
const process = require("process")

const _SECONDS = 5000 // 5 seconds

const countConnect = () => {
    const numConnection = mongoose.connections.length
    console.log(`Number of connections: ${numConnection}`)
}

const checkOverload = () => {
    setInterval(() => {
        const numConnection = mongoose.connections.length
        const numCores = os.cpus().length
        const memoryUsage = process.memoryUsage().rss
        const maxConnections = numCores * 5

        console.log(`Memory usage:: ${memoryUsage / 1024 / 1024} MB`)
        console.log(`Active connections:: ${numConnection}`)

        if (numConnection > maxConnections) {
            console.log("Connection overload detected!")
        }
    }, _SECONDS)
}

module.exports = {
    countConnect,
    checkOverload
}