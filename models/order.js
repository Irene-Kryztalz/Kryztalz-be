import { model, Schema, Types } from "mongoose";

const orderSchema = new Schema(
    {
        items:
            [
                {
                    _id: false,
                    gem: { type: Object, required: true },
                    quantity: { type: Number, required: true }
                }

            ],
        price:
        {
            type: Types.Decimal128,
            required: true
        },
        orderedAt:
        {
            type: Date,
            required: true
        },
        user:
        {
            userId:
            {
                type: Schema.Types.ObjectId,
                required: true,
                ref: 'User'
            }
        }

    }
);

export default model( 'Order', orderSchema );
