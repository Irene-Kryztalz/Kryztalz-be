import { model, Schema, Types } from "mongoose";

const gemSchema = new Schema( {
    type:
    {
        type: String,
        required: true,
        lowercase: true

    },
    name:
    {
        type: String,
        required: true,
        lowercase: true
    },
    cutType: String,
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
