import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/server-api";

export default async function AuthLayout({ children }: { children: React.ReactNode }) {
  if (await getSessionUser()) redirect("/feed");
  return children;
}
