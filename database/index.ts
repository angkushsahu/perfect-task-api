import mongoose from "mongoose";

// let DB: string = String(process.env.DB_URI_LOCAL);
let DB: string = String(process.env.DB_URI);

mongoose.connect(DB);
