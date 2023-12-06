import { Request, Response } from "express";
import GroupMessage from "../models/groupmessage";

function isInValidString(str: string) {
    return str === undefined || str.length === 0 ? true : false;
}

export const postCreateGroupMessage = async (req: Request, res: Response) => {
    try {
        const group_id = parseInt(req.params.groupId, 10);
        const {
            senderId: sender_id,
            message: message,
            message_type: message_type,
        } = req.body;

        if (
            isInValidString(sender_id) ||
            isInValidString(message) ||
            isInValidString(message_type)) {
            return res
                .status(204)
                .json({ err: "Message not sent" });
        }
        const response = await GroupMessage.create({
            sender_id: sender_id,
            group_id: group_id,
            message: message,
            message_type: message_type,
        });
        return res.status(201).json({ Success: "Message sent", message: response });

    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}

export const getGroupMessages = async (req: Request, res: Response) => {
    try {
        const groupId = req.params.groupId;
        const response = await GroupMessage.findAll({ where: { group_id: groupId } });
        res.status(200).json({ message: response })
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}