import mongoose, { Schema } from "mongoose";

const supplierSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
        },
        contactNumeber: {
            type: Number,
            required: true,
        },
        contactEmail: {
            type: String,
            required: true,
        },
        phone: {
            type: Number,
            required: true,
        },
        address: {
            type: String,
            required: true,
        },
    },
    { timestamps: true }
);

export const Supplier = mongoose.model("Supplier", supplierSchema);
