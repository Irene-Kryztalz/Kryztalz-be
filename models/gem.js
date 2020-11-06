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
    cutType:
    {
        type: String,
        required: true,
        lowercase: true
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

    imageIds:
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

gemSchema.set( 'toJSON',
    {
        transform: ( doc, ret ) =>
        {
            ret.price = +ret.price.toString();
            ret.__v = undefined;
            return ret;
        },
    } );

gemSchema.index(
    {
        name: 'text',
        type: 'text',
        cutType: 'text'
    } );

export default model( "Gems", gemSchema );
