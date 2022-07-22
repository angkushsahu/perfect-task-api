import { NextFunction, Request, Response } from "express";
import User from "../models/user.model";
import validateEmail from "../utils/validateEmail";
import catchAsyncErrors from "../middleware/catchAsyncErrors";
import ErrorHandler from "../utils/ErrorHandler";
import sendToken from "../utils/jwtToken";
import sendEmail from "../utils/sendEmail";

// user signup
export const userSignup = catchAsyncErrors(
	async (req: Request, res: Response, next: NextFunction) => {
		const { name, email, password }: { name: string; email: string; password: string } =
			req.body;

		if (!name && !email && !password) {
			return next(new ErrorHandler("Please validate all the required fields 😥", 400));
		}

		if (!validateEmail(email)) {
			return next(new ErrorHandler("Please enter a valid email 😥", 400));
		}

		const user = await User.create({ name, email, password });
		if (!user) {
			return next(new ErrorHandler("Unable to create user account 😥", 400));
		}

		user.password = "";
		sendToken(res, user, 201, "User created successfully 😄");
	},
);

// user login
export const userLogin = catchAsyncErrors(
	async (req: Request, res: Response, next: NextFunction) => {
		const { email, password }: { email: string; password: string } = req.body;

		if (!email && !password) {
			return next(new ErrorHandler("Please validate all the required fields 😥", 400));
		}

		const user = await User.findOne({ email });
		if (!user) {
			return next(new ErrorHandler("Invalid credentials 😥", 404));
		}

		const passwordComparison: boolean = await user.comparePassword(password);
		if (!passwordComparison) {
			return next(new ErrorHandler("Invalid credentials 😥", 404));
		}

		user.password = "";
		sendToken(res, user, 200, "User logged in successfully 😄");
	},
);

// get details about the user
export const getUser = catchAsyncErrors(async (req: Request, res: Response, next: NextFunction) => {
	const user = res.locals.user;
	if (!user) {
		return next(new ErrorHandler("No such user exists 😥", 404));
	}

	user.password = "";
	return res.status(200).json({ success: true, message: "User found successfully 😄", user });
});

// user logout
export const userLogout = catchAsyncErrors(
	async (req: Request, res: Response, next: NextFunction) => {
		res.clearCookie("token");

		res.status(200).json({ success: true, message: "User logout successful 😄" });
	},
);

// update user
export const updateUser = catchAsyncErrors(
	async (req: Request, res: Response, next: NextFunction) => {
		const { name, email }: { name: string; email: string } = req.body;

		const user = await User.findById(req.params.id);
		if (!user) {
			return next(new ErrorHandler("No such user exists 😥", 404));
		}

		if (name.length > 0) {
			user.name = name;
		}
		if (email.length > 0) {
			user.email = email;
		}
		await user.save();

		return res.status(200).json({ success: true, message: "User updated successfully 😄" });
	},
);

// delete user
export const deleteUser = catchAsyncErrors(
	async (req: Request, res: Response, next: NextFunction) => {
		const user = res.locals.user;
		if (!user) {
			return next(new ErrorHandler("No such user exists 😥", 404));
		}

		res.clearCookie("token");
		await user.remove();

		return res.status(200).json({ success: true, message: "User deleted successfully 😄" });
	},
);

// forgot password
export const forgotPassword = catchAsyncErrors(
	async (req: Request, res: Response, next: NextFunction) => {
		const { email } = req.body;
		const user = await User.findOne({ email });
		if (!user) {
			return next(new ErrorHandler("No account with this email-id exists 😥", 404));
		}

		const resetLink = user.setResetPasswordLink(String(user._id));
		const { success } = await sendEmail(email, resetLink);
		if (!success) {
			return next(new ErrorHandler("Unable to send e-mail 😥", 404));
		}

		await user.save();
		res.status(200).json({
			success: true,
			message: "Mail sent successfully, check your inbox 😄",
		});
	},
);

// reset password
export const resetPassword = catchAsyncErrors(
	async (req: Request, res: Response, next: NextFunction) => {
		const { password, id, token } = req.body;
		const user = await User.findById(id);
		if (!user) {
			return next(new ErrorHandler("No account with this email-id exists 😥", 404));
		}

		if (token !== user.resetLink) {
			return next(new ErrorHandler("Unauthorized 😥", 401));
		}

		user.password = password;
		user.resetLink = "";
		await user.save();

		res.status(200).json({
			success: true,
			message: "Password changed successfully, please login with your new password 😄",
		});
	},
);
