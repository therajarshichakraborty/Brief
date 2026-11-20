import { fromNodeHeaders } from "better-auth/node";
import type { RequestHandler } from "express";
import { auth } from "../auth/auth";
import { HttpError } from "../lib/http-error";

export const requireSession: RequestHandler = async (req, res, next) => {
  const session = await auth.api.getSession({ headers: fromNodeHeaders(req.headers) });
  if (!session) throw HttpError.unauthorized();

  res.locals.user = session.user;
  next();
};
