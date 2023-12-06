import { Router } from "express";
import { getGroupMessages, postCreateGroupMessage } from "../controllers/groupmessage"
import authenticate from "../middleware/authentication";
const router = Router();

router.get('/groups/:groupId/messages', authenticate, getGroupMessages)


router.post('/groups/:groupId/messages', authenticate, postCreateGroupMessage)


export default router;