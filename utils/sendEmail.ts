import nodemailer from "nodemailer";

export default async function sendEmail(email: string, resetLink: string) {
	try {
		const transporter = nodemailer.createTransport({
			service: process.env.MAIL_SERVICE,
			auth: {
				user: process.env.MAIL,
				pass: process.env.MAIL_PASS,
			},
		});

		const link = "Lorem ipsum dolor isit.";
		const text = `
	Click on the link below or copy paste it into your browser
	${resetLink}

	P.S.: Please do not reply to this e-mail.
	`;

		const mailOptions = {
			from: process.env.MAIL,
			to: email,
			subject: "Reset password link",
			text,
		};

		await transporter.sendMail(mailOptions);
		return { success: true, message: "Mail sent successfully 😄" };
	} catch (error) {
		return { success: false, message: "Unable to send e-mail 😥" };
	}
}
