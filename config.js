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
    origin = process.env.ALLOWED_ORIGIN;

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
    dbUrlTest
};
