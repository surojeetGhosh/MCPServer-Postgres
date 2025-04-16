import express from "express";
import { Express } from "express";
// import bodyParser from "body-parser";
import router from "./routers";;

const app: Express = express()
const port = process.env.PORT || 3001


// app.use(bodyParser.json())
// app.use(bodyParser.urlencoded({ extended: true }))

app.use("/", router)

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`)
})




