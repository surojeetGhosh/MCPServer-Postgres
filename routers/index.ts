import { Router } from "express"
import { Utility } from "../controllers/index.js"

const router = Router()

router.get("/sse", Utility.getTools)
router.post("/messages", Utility.postMessage)


export default router