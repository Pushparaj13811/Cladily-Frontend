import mongoose, { Schema } from "mongoose";

const statusSchema = new Schema(
    {
        statusName: {
            type: String,
            required: true,
        },
    },
    { timestamps: true }
);

export const Status = mongoose.model("Status", statusSchema);
