import express from "express";
const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

import cors from "cors";
app.use(cors({ credentials: true, origin: true }));

import cookieParser from "cookie-parser";
app.use(cookieParser());

import router from "./routes/user.route";
app.use("/api", router);

import error from "./middleware/error";
app.use(error);

export default app;
