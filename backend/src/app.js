import { ConnectDB } from "./connections/ConnectDB.js";
import express from "express"
import cors from "cors"
import dotenv from "dotenv"
import { Route } from "./router/route.routes.js";
dotenv.config()
const app = express();
app.use(express.json())
app.use(cors())
ConnectDB();
app.use('/', Route());
const PORT = process.env.PORT
app.listen(PORT, () => console.log(`Server berjalan di port ${PORT}`))