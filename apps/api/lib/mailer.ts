import { logger } from "./logger";

export interface MailMessage {
  to: string;
  subject: string;
  text: string;
  html: string;
}

export interface Mailer {
  send(message: MailMessage): Promise<void>;
}

class LogMailer implements Mailer {
  async send({ to, subject, text }: MailMessage): Promise<void> {
    logger.warn({ to, subject, text }, "Email transport not configured, message logged instead");
  }
}

export const mailer: Mailer = new LogMailer();
