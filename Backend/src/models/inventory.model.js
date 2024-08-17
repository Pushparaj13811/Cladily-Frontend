import mongoose, { Schema } from "mongoose";

const inventorySchema = new Schema(
    {
        productId: {
            type: Schema.Types.ObjectId,
            ref: "Product",
            required: true,
        },
        supplierId: {
            type: Schema.Types.ObjectId,
            ref: "Supplier",
            required: true,
        },
        quantity: {
            type: Number,
            required: true,
        },
    },
    { timestamps: true }
);

export const Inventory = mongoose.model("Inventory", inventorySchema);
