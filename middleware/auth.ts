import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import User from "../models/user.model";
import ErrorHandler from "../utils/ErrorHandler";
import catchAsyncErrors from "./catchAsyncErrors";

const isUserAuthenticated = catchAsyncErrors(async function (
	req: Request,
	res: Response,
	next: NextFunction,
) {
	const token = req.body.cookie || req.cookies.token;
	if (token === "unauthorized") {
		return next(new ErrorHandler("Please login to access this resource", 401));
	}

	const data: any = jwt.verify(token, String(process.env.JWT_SECRET));
	res.locals.user = await User.findById(data.id);

	next();
});

export default isUserAuthenticated;
