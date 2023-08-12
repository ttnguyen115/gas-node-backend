const app = require("./src/app")

const PORT = 3055

const server = app.listen(PORT, () => {
    console.log(`WSV eCommerce starts with port: ${PORT}`)
})

// SIGINT => on type Ctrl + C in IDE
process.on('SIGINT', () => {
    server.close(() => console.log("Exit server express"))
})