import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";

const userSchema = new mongoose.Schema({
	name: { type: String, required: true },
	email: { type: String, required: true, unique: true },
	password: { type: String, required: true },
	notes: [
		{
			title: { type: String },
			description: { type: String },
			important: { type: Boolean, default: false },
			createdAt: { type: Date, default: Date.now() },
		},
	],
	resetLink: { type: String, default: "" },
});

// Hashing password
userSchema.pre("save", async function (next) {
	if (!this.isModified("password")) {
		next();
	}
	this.password = await bcrypt.hash(this.password, 10);
});

// Reset password link
userSchema.methods.setResetPasswordLink = function (id: string) {
	const cryptoString = crypto.randomBytes(32).toString("hex");
	const resetLink = `${process.env.BASE_URL}/user/password-reset/${id}/${cryptoString}`;
	if (this.resetLink.length > 0) {
		this.resetLength = "";
	}
	this.resetLink = cryptoString;
	return resetLink;
};

// Comparing password
userSchema.methods.comparePassword = async function (enteredPassword: string) {
	return await bcrypt.compare(enteredPassword, this.password);
};

// Creating JWT tokens
userSchema.methods.getJWTToken = function () {
	return jwt.sign({ id: this._id }, String(process.env.JWT_SECRET));
};

const User = mongoose.model("user", userSchema);
export default User;
