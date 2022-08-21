import { debug } from 'debug';
import { sql } from 'kysely';
import type { Database } from '../database';
import { Invitation, InvitationInput, InvitationSearch } from '../shared';
import { ModelBase } from './ModelBase';
import { IInvitationModel } from './types';

export default class InvitationModel extends ModelBase implements IInvitationModel {
  private readonly log = debug(InvitationModel.name);

  constructor(private readonly db: Database) {
    super();
  }

  public async findOne(search: InvitationSearch): Promise<Invitation> {
    this.log('findOne', { search });
    
    let query = this.db
      .selectFrom('invitation');

    query = search.email ? query.where(sql`LOWER(email)`, '=', search.email.toLowerCase()) : query;
    
    return query
      .selectAll()
      .executeTakeFirstOrThrow();
  }

  public async insert(insert: InvitationInput): Promise<Invitation> {
    this.log('insert', { insert });

    return this.db
      .insertInto('invitation')
      .values({ email: insert.email.toLowerCase(), invited_by: insert.invited_by })
      .returningAll()
      .executeTakeFirstOrThrow();
  }
}
