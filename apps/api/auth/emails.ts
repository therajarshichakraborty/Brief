import type { MailMessage } from "../lib/mailer";

interface PasswordResetEmailInput {
  to: string;
  name: string;
  url: string;
}

function escapeHtml(value: string): string {
  return value.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;");
}

export function passwordResetEmail({ to, name, url }: PasswordResetEmailInput): MailMessage {
  const greeting = `Hi ${name},`;
  const body = "We received a request to reset your password. The link below expires in one hour.";
  const footer = "If you did not request this, you can safely ignore this email.";

  return {
    to,
    subject: "Reset your password",
    text: [greeting, body, url, footer].join("\n\n"),
    html: [
      `<p>${escapeHtml(greeting)}</p>`,
      `<p>${body}</p>`,
      `<p><a href="${escapeHtml(url)}">Reset password</a></p>`,
      `<p>${footer}</p>`,
    ].join(""),
  };
}
