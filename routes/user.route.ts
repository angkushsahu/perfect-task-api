import {
	userSignup,
	userLogin,
	userLogout,
	updateUser,
	deleteUser,
	getUser,
	forgotPassword,
	resetPassword,
} from "../controllers";
import {
	createNote,
	deleteNote,
	getAllImportantNotes,
	getAllNotes,
	getNote,
	markNote,
	updateNote,
} from "../controllers";
import express from "express";
import isUserAuthenticated from "../middleware/auth";
const router = express.Router();

// user
router.route("/signup").post(userSignup);
router.route("/login").post(userLogin);
router.route("/logout").get(isUserAuthenticated, userLogout);
router.route("/update/:id").put(updateUser);
router.route("/delete").delete(isUserAuthenticated, deleteUser);
router.route("/user").post(isUserAuthenticated, getUser);
router.route("/forgot-password").post(forgotPassword);
router.route("/reset-password").post(resetPassword);

// note
router.route("/note/create").post(isUserAuthenticated, createNote);
router.route("/note/update/:id").put(isUserAuthenticated, updateNote);
router.route("/note/delete/:id").delete(isUserAuthenticated, deleteNote);
router.route("/note/mark/:id").get(isUserAuthenticated, markNote);
router.route("/note/:id").post(isUserAuthenticated, getNote);
router.route("/notes").post(isUserAuthenticated, getAllNotes);
router.route("/notes/important").post(isUserAuthenticated, getAllImportantNotes);

export default router;
