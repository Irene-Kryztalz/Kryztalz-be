import dotenv from "dotenv";

dotenv.config();

const port = process.env.PORT || 7272,
    jwtSecret = process.env.JWT_SECRET || 'secret',
    dbUrl = process.env.MONGODB_URI ||
        'mongodb://localhost:27017/kryztalz',
    dbUrlTest = process.env.MONGODB_URI_TEST || 'mongodb://localhost:27017/kryztalz',
    sender = process.env.EMAIL,
    sgKey = process.env.SENDGRID_API_KEY,
    email_trouble_template = process.env.EMAIL_TROUBLE_TEMPLATE,
    email_confirm_template = process.env.EMAIL_C0NFIRM_TEMPLATE,
    admin_origin = process.env.ALLOWED_ORIGIN_ADMIN,
    origin = process.env.ALLOWED_ORIGIN,
    cloudinary_name = process.env.CLOUDINARY_NAME,
    cloudinary_key = process.env.CLOUDINARY_API_KEY,
    cloudinary_secret = process.env.CLOUDINARY_SECRET,
    exchange = process.env.EXCHANGE;

export
{
    origin,
    admin_origin,
    email_confirm_template,
    email_trouble_template,
    jwtSecret,
    port,
    sgKey,
    dbUrl,
    sender,
    dbUrlTest,
    cloudinary_key,
    cloudinary_name,
    cloudinary_secret,
    exchange
};
