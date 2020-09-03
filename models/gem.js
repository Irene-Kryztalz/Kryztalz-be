import { model, Schema, Types } from "mongoose";

const gemSchema = new Schema( {
    type:
    {
        type: String,
        required: true,
    },
    name:
    {
        type: String,
        required: true,
    },
    isRough: Boolean,
    cutType: String,
    weight:
    {
        type: Types.Decimal128,
        required: true
    },
    price:
    {
        type: Types.Decimal128,
        required: true,
    },
    imageUrls:
        [
            {
                _id: false,
                type: String,
                required: true,
            }

        ],
    description:
    {
        type: String,
        required: true,
    }
} );

export default model( "Gems", gemSchema );
