import nodeMailer from "nodemailer";

export interface IEmailerService {
  send(mailOptions: Omit<nodeMailer.SendMailOptions, 'from'>): Promise<void>;
}