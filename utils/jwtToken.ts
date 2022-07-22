import { Response } from "express";

const sendToken = function (res: Response, user: any, statusCode: number, message: string) {
	const token = user.getJWTToken();

	const options = {
		httpOnly: true,
		expires: new Date(Date.now() + Number(process.env.COOKIE_EXPIRE) * 24 * 60 * 60 * 1000),
	};

	res.status(statusCode).cookie("token", token, options).json({ success: true, message });
};

export default sendToken;
