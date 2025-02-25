import express from "express";
import cookieParser from "cookie-parser";
import { PORT } from "./configs/env/env.js";


const app = express();
app.use(cookieParser());




app.listen(PORT, () => {
    console.log(`Server N-Hub is now starting on port ${PORT} ⚡`);
});