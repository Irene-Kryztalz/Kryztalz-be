import dotenv from "dotenv";

dotenv.config();

const port = process.env.PORT || 3001,
    jwtSecret = process.env.JWT_SECRET || 'secret',
    dbUrl = process.env.MONGODB_URI ||
        'mongodb://localhost:27017/krystalz',
    dbUrlTest = process.env.MONGODB_URI_TEST || 'mongodb://localhost:27017/krystalz';
export
{
    jwtSecret,
    port,
    dbUrl,
    dbUrlTest
};
