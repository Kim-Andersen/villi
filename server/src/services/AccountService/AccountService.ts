import debug from 'debug';
import { IAccountModel } from '../../models';
import { Account, AccountId } from '../../shared';
import { IAccountService } from './types';

export class AccountService implements IAccountService {
  private readonly log = debug(AccountService.name);
  
  constructor(private readonly accountModel: IAccountModel) {
    this.log('initialize');
  }

  public async findOneByEmail(email: string): Promise<Account | undefined> {
    return this.accountModel.findOne({ email });
  }

  public async findOneById(id: AccountId): Promise<Account | undefined> {
    return this.accountModel.findOne({ id });
  }

  public async registerLastLogin(id: AccountId): Promise<void> {
    return this.accountModel.patch(id, { lastlogin_at: new Date() })
  }
}