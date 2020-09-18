import dotenv from "dotenv";

dotenv.config();

const port = process.env.PORT || 3001,
    jwtSecret = process.env.JWT_SECRET || 'secret',
    dbUrl = process.env.MONGODB_URI ||
        'mongodb://localhost:27017/kryztalz',
    dbUrlTest = process.env.MONGODB_URI_TEST || 'mongodb://localhost:27017/kryztalz',
    sender = process.env.EMAIL,
    sgKey = process.env.SENDGRID_API_KEY;
export
{
    jwtSecret,
    port,
    sgKey,
    dbUrl,
    sender,
    dbUrlTest
};
