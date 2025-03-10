import { config } from "dotenv";

config({ path: `.env.${process.env.NODE_ENV || 'development'}.local` });

export const { PORT, 
    MONGO_URI,
    NODE_ENV ,
    JWT_SECRET,
    MAILTRAP_TOKEN,
    MAILTRAP_ENDPOINT,
    BASE_URL_CLIENT,
    ARCJET_KEY
} = process.env;