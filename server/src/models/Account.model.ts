import { debug } from 'debug';
import { sql } from 'kysely';
import type { Database } from '../database';
import { Account, AccountId, AccountInput, AccountPatch, AccountSearch } from '../shared';
import { ModelBase } from './ModelBase';
import { IAccountModel } from './types';

export default class AccountModel extends ModelBase implements IAccountModel {
  private readonly log = debug(AccountModel.name);

  constructor(private readonly db: Database) {
    super();
  }

  public async findOne(search: AccountSearch): Promise<Account | undefined> {
    this.log('findOne', { search });

    let query = this.db
      .selectFrom('account');

    query = search.id ? query.where('id', '=', search.id) : query;
    query = search.email ? query.where(sql`LOWER(email)`, '=', search.email.toLowerCase()) : query;

    return query
      .selectAll()
      .executeTakeFirst();
  }

  public async insert(input: AccountInput): Promise<Account> {
    this.log('insert', { input });

    return await this.db
      .insertInto('account')
      .values(input)
      .returningAll()
      .executeTakeFirstOrThrow();
  }

  public async patch(id: AccountId, patch: AccountPatch): Promise<void> {
    this.log('patch', { id, patch });

    await this.db
      .updateTable('account')
      .set(patch)
      .where('id', '=', id)
      .executeTakeFirstOrThrow();
  }
}
