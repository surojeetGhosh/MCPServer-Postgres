import { Router } from "express"
import { Utility } from "../controllers/index.js"

const router = Router()

router.get("/sse", Utility.getTools)
router.post("/message", Utility.postMessage)


export default router