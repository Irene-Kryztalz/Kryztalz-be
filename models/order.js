import { model, Schema, Types } from "mongoose";

const itemSchema = new Schema(
    {
        _id: false,
        quantity:
        {
            type: Number,
            required: true
        },
        price:
        {
            type: Types.Decimal128,
            required: true
        },
        cutType:
        {
            type: String,
            required: true
        },
        type:
        {
            type: String,
            required: true
        },
    }
);


const orderSchema = new Schema(
    {
        items: [ itemSchema ],
        total:
        {
            type: Types.Decimal128,
            required: true
        },
        orderedAt:
        {
            type: Date,
            required: true
        },
        userId:
        {
            type: Schema.Types.ObjectId,
            required: true,
            ref: 'User'
        }


    }
);

orderSchema.set( 'toJSON',
    {
        transform: ( doc, ret ) =>
        {
            ret.price = +ret.price.toString();
            ret.items.forEach( item => item.price = +item.price.toString() );
            ret.__v = undefined;
            return ret;
        },
    } );

export default model( 'Order', orderSchema );
