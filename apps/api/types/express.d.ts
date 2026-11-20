import type { AuthSession } from "../auth/auth";

declare global {
  namespace Express {
    interface Locals {
      user: AuthSession["user"];
    }
  }
}
