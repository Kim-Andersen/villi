import debug from 'debug';
import nodeMailer from "nodemailer";
import config from '../../config';
import { IEmailerService } from './types';

export class EmailerService implements IEmailerService {
  private readonly log = debug(EmailerService.name);
  private readonly transporter: nodeMailer.Transporter;
  
  constructor() {
    this.log('initialize');

    const { host, port, user, password } = config.email;
    this.transporter = nodeMailer.createTransport({
      host,
      port,
      auth: { user, pass: password }
    });
    this.log('mail transporter initialized', { host, port, user });
  }

  public async send(options: Omit<nodeMailer.SendMailOptions, 'from'>): Promise<void> {
    this.log('send', { options });

    try {
      const result = await this.transporter.sendMail(options);
      this.log('email sent', { result });
    } catch(error) {
      this.log('Failed to send email', { error });
      console.error(`Failed to send email`, error, options);
      throw error;
    }
  }
}