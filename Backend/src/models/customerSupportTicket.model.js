import { text } from "express";
import mongoose, { Schema } from "mongoose";

const customerSupportTicketSchema = new Schema(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        issue: {
            type: text,
            required: true,
        },
        status: {
            type: String,
            required: true,
        },
    },
    { timeseries: true }
);

export const CustomerSuppotTicket = mongoose.model(
    "CustomerSupportTicket",
    customerSupportTicketSchema
);
