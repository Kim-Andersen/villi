import debug from 'debug';
import jwt from 'jsonwebtoken';
import { z } from 'zod';
import config from '../../config';
import { BadRequestError, ItemNotFoundError } from '../../errors';
import { Account, emailSchema } from '../../shared';
import { IAccountService } from '../AccountService/types';
import { IEmailerService } from '../EmailerService/types';
import { ISessionAuthService } from '../SessionAuthService/types';
import { IEmailAuthService } from './types';

export const emailTokenPayload: z.ZodType<Pick<Account, 'email'>> = z.object({
  email: z.string().email()
});
export type EmailTokenPayload = z.infer<typeof emailTokenPayload>;

export class EmailAuthService implements IEmailAuthService {
  private readonly log = debug(EmailAuthService.name);
  
  constructor(
    private readonly emailerService: IEmailerService,
    private readonly accountService: IAccountService,
    private readonly sessionAuthService: ISessionAuthService
    ) {
    this.log('initialize');
  }

  public async loginWithEmailToken(token: string): Promise<string> {
    this.log('loginWithEmailToken', token);

    let tokenPayload: EmailTokenPayload;
    try {
      tokenPayload = await this.verifyToken(token);
    } catch(error) {
      this.log(`Failed to verify email token`, error);
      throw new BadRequestError(`Invalid email token.`);
    }

    const account = await this.accountService.findOneByEmail(tokenPayload.email);
    if (!account) {
      this.log(`Accont not found for email ${tokenPayload.email}.`);
      throw new BadRequestError(`Invalid email token.`);
    }
    return await this.sessionAuthService.createSessionToken(account);
  }

  public async sendEmailWithLoginLink(email: string): Promise<void> {
    this.log('sendEmailWithLoginLink', { email });

    emailSchema.parse(email);

    /**
     * Only send email if an account with that email exists.
     */
    const account = await this.accountService.findOneByEmail(email);
    if (!account) {
      throw new ItemNotFoundError(`Account not found for ${email}.`);
    }
    this.log('Sending email login mail to', { account });
    
    const token = jwt.sign({ email }, config.auth.jwtSecretKey, { expiresIn: '1h' });
    const link = `http://localhost:${config.server.port}/login/email?token=${token}`;

    await this.emailerService.send({
      html: this.emailTemplate({ link }),
      subject: "Complete login for Villi",
      to: email,
    });

    this.log('Email login mail sent to', { account });
  }

  private emailTemplate({ link }: { link: string }): string {
    return `
      <h2>Hi!</h2>
      <p>Click the link below to complete the log in.</p>
      <p><a href="${link}">Click to log in</a></p>
      <p>To stay secure, the link works for one hour.</p>
    `;
  }

  private async verifyToken(token: string): Promise<EmailTokenPayload> {
    return new Promise((resolve, reject) => {
      jwt.verify(token, config.auth.jwtSecretKey, async (error, decoded) => {
        if (!error) {
          const result = emailTokenPayload.safeParse(decoded);
          this.log('email token parse result', result)
          if (result.success) {
            return resolve(result.data);
          }
        }
        this.log(`Invalid email login token.`, { token }, error);
        reject(`Invalid token.`);
      });
    });
  }
}