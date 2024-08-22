import express from "express";
import db from "@repo/db/client";
import { z } from "zod";

const app = express();
const webhooksecret = process.env.WEBHOOK_SECRET;

const bankWebhookSchema = z.object({
    token: z.string(),
    user_identifier: z.string(),
    amount: z.string()
});

app.use(express.json())

app.post("/bankWebhook", async (req, res) => {

    const signature = req.headers["x-bank-webhook-signature"];
    if (signature !== webhooksecret) {
        res.status(401).json({
            message: "Unauthorized"
        });
        return;
    }

    try {
        bankWebhookSchema.parse(req.body);
    } catch (e) {
        res.status(400).json({
            message: "Invalid request"
        });
        return;
    }

    const paymentInformation: {
        token: string;
        userId: string;
        amount: string
    } = {
        token: req.body.token,
        userId: req.body.user_identifier,
        amount: req.body.amount
    };

    try {
        await db.$transaction([
            db.balance.updateMany({
                where: {
                    userId: Number(paymentInformation.userId)
                },
                data: {
                    amount: {
                        increment: Number(paymentInformation.amount)
                    }
                }
            }),
            db.onRampTransaction.updateMany({
                where: {
                    token: paymentInformation.token
                },
                data: {
                    status: "Success",
                }
            })
        ]);

        res.json({
            message: "Captured"
        })
    } catch (e) {
        console.error(e);
        res.status(411).json({
            message: "Error while processing webhook"
        })
    }

})

app.listen(3003);