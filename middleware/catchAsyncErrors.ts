import { Request, Response, NextFunction } from "express";

function catchAsyncErrors(theFunc: Function) {
	return function (req: Request, res: Response, next: NextFunction) {
		Promise.resolve(theFunc(req, res, next)).catch(next);
	};
}

export default catchAsyncErrors;
