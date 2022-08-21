import debug from 'debug';
import jwt from 'jsonwebtoken';
import { pick } from 'lodash';
import { z } from 'zod';
import config from '../../config';
import { BadRequestError } from '../../errors';
import { Account, AccountId } from '../../shared';
import { IAccountService } from '../AccountService/types';
import { ISessionAuthService } from './types';

export const sessionTokenPayload: z.ZodType<Pick<Account, 'id' | 'is_admin'>> = z.object({
  id: z.number().int(),
  is_admin: z.boolean()
});
export type SessionTokenPayload = z.infer<typeof sessionTokenPayload>;

export class SessionAuthService implements ISessionAuthService {
  private readonly log = debug(SessionAuthService.name);
  
  constructor(private readonly accountService: IAccountService) {
    this.log('initialize');
  }

  public async createSessionToken(account: Account): Promise<string> {
    this.log('createSessionToken', { account });
    const payload = sessionTokenPayload.parse(pick<SessionTokenPayload>(account, 'id', 'is_admin'));
    await this.accountService.registerLastLogin(account.id as AccountId);
    return jwt.sign(payload, config.auth.jwtSecretKey);
  }

  public async refreshSessionToken(token: string): Promise<string> {
    const payload = sessionTokenPayload.parse(await this.verifySessionToken(token));
    const account = await this.accountService.findOneById(payload.id as AccountId);
    if (!account) {
      throw new BadRequestError('Account not found.');
    }
    return this.createSessionToken(account);
  }

  private async verifySessionToken(token: string): Promise<SessionTokenPayload> {
    return new Promise((resolve, reject) => {
      jwt.verify(token, config.auth.jwtSecretKey, async (error, decoded) => {
        if (!error) {
          const result = sessionTokenPayload.safeParse(decoded);
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