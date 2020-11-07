import { model, Schema, Types } from "mongoose";

const itemSchema = new Schema(
    {
        _id: false,
        quantity:
        {
            type: Types.Decimal128,
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
        name:
        {
            type: String,
            required: true
        }
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
        discount:
        {
            type: Types.Decimal128,
            required: true,
            default: 0
        },
        amountDue:
        {
            type: Types.Decimal128,
            required: true
        },
        userCurrency:
        {
            type: String,
            default: "₦"
        },
        rateToCurr:
        {
            type: Types.Decimal128,
            required: true,
            default: 1
        },
        deliveryAddress:
            [
                {
                    _id: false,
                    type: String
                }
            ],
        description:
        {
            type: String,
            default: "No description"
        },
        orderedAt:
        {
            type: String,
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

            ret.total = +ret.total.toString();
            ret.discount = +ret.discount.toString();
            ret.amountDue = +ret.amountDue.toString();
            ret.rateToCurr = +ret.rateToCurr.toString();
            ret.items.forEach( item =>
            {
                item.price = +item.price.toString();
                item.quantity = +item.quantity.toString();

            } );
            ret.__v = undefined;
            return ret;
        },
    } );

export default model( 'Order', orderSchema );
