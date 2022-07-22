process.on("uncaughtException", error => {
	console.log("uncaughtException\n", error);
});
process.on("unhandledRejection", error => {
	console.log("unhandledRejection\n", error);
});

import dotenv from "dotenv";
dotenv.config({ path: "./config.env" });

console.log(process.env.PORT);

import "./database";

import app from "./app";

const port = process.env.PORT || 4000;

app.listen(port, () => console.log(`App listening at ${port}`));
