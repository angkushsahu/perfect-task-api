import { NextFunction, Request, Response } from "express";
import catchAsyncErrors from "../middleware/catchAsyncErrors";
import ErrorHandler from "../utils/ErrorHandler";

// create note
export const createNote = catchAsyncErrors(async (req: any, res: Response, next: NextFunction) => {
	const {
		title,
		description,
		important,
	}: { title: string; description: string; important: boolean } = req.body;
	const newNote = { title, description, important };

	const user = res.locals.user;
	if (!user) {
		return next(new ErrorHandler("No such account exists 😥", 404));
	}
	user.notes.push(newNote);
	await user.save();

	res.status(201).json({ success: true, message: "Note added successfully 😄" });
});

// get all notes
export const getAllNotes = catchAsyncErrors(
	async (req: Request, res: Response, next: NextFunction) => {
		const user = res.locals.user;
		if (!user) {
			return next(new ErrorHandler("No such user exists 😥", 404));
		}

		const notes = user.notes;

		return res.status(200).json({
			success: true,
			message: "Notes fetched successfully 😄",
			notes: user.notes,
		});
	},
);

// get all notes with important fields (marked as important)
export const getAllImportantNotes = catchAsyncErrors(
	async (req: Request, res: Response, next: NextFunction) => {
		const user = res.locals.user;
		if (!user) {
			return next(new ErrorHandler("No such user exists 😥", 404));
		}

		const notes = user.notes;
		let importantNotes: any[] = [];
		Array.from(notes).forEach((note: any) => {
			if (note.important === true) {
				importantNotes.push(note);
			}
		});

		return res.status(200).json({
			success: true,
			message: "Notes fetched successfully 😄",
			notes: importantNotes,
		});
	},
);

// get note
export const getNote = catchAsyncErrors(async (req: Request, res: Response, next: NextFunction) => {
	const user = res.locals.user;
	if (!user) {
		return next(new ErrorHandler("No such user exists 😥", 404));
	}

	const id = req.params.id;
	const notes = user.notes;
	let condition: boolean = false;
	let requiredNote;

	Array.from(notes).forEach((note: any) => {
		if (String(note._id) === id) {
			condition = true;
			requiredNote = note;
		}
	});

	if (condition) {
		return res
			.status(200)
			.json({ success: true, message: "Note found successfully 😄", requiredNote });
	} else {
		return res.status(200).json({ success: false, message: "No such note exists 😄" });
	}
});

// mark note as important
export const markNote = catchAsyncErrors(
	async (req: Request, res: Response, next: NextFunction) => {
		const user = res.locals.user;
		if (!user) {
			return next(new ErrorHandler("No such user exists 😥", 404));
		}

		const id = req.params.id;
		const notes = user.notes;

		Array.from(notes).forEach((note: any) => {
			if (String(note._id) === id) {
				note.important = true;
			}
		});

		user.notes = notes;
		await user.save();

		return res.status(200).json({ success: true, message: "Note marked as important 😄" });
	},
);

// update note
export const updateNote = catchAsyncErrors(
	async (req: Request, res: Response, next: NextFunction) => {
		const {
			title,
			description,
			important,
		}: { title: string; description: string; important: boolean } = req.body;
		const user = res.locals.user;
		if (!user) {
			return next(new ErrorHandler("No such user exists 😥", 404));
		}

		const id = req.params.id;
		const notes = user.notes;

		Array.from(notes).forEach((note: any) => {
			if (String(note._id) === id) {
				note.title = title;
				note.description = description;
				note.important = important;
			}
		});

		user.notes = notes;
		await user.save();

		return res.status(200).json({ success: true, message: "Note updated successfully 😄" });
	},
);

// delete note
export const deleteNote = catchAsyncErrors(
	async (req: Request, res: Response, next: NextFunction) => {
		const user = res.locals.user;
		if (!user) {
			return next(new ErrorHandler("No such user exists 😥", 404));
		}

		const id = req.params.id;
		const notes = user.notes;
		const updatedNotes: any[] = [];

		Array.from(notes).forEach((note: any) => {
			if (String(note._id) !== id) {
				updatedNotes.push(note);
			}
		});

		user.notes = updatedNotes;
		await user.save();

		return res.status(200).json({ success: true, message: "Note deleted successfully 😄" });
	},
);
