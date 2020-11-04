import { model, Schema, Types } from "mongoose";
import { gemSchema } from "./gem";

const orderSchema = new Schema(
    {
        items:
            [
                {
                    _id: false,
                    gem: gemSchema,
                    quantity:
                    {
                        type: Number,
                        required: true
                    },
                    price:
                    {
                        type: Types.Decimal128,
                        required: true
                    }
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
