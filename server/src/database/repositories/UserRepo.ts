import debug from 'debug';
import { UserListItem } from '../../shared/types';
import { sql } from '../sql';
import { IDatabase } from '../types';

export interface IUserRepo {
  /**
   * Find all users.
   */
  find(): Promise<UserListItem[]>;
}

export default class UserRepo implements IUserRepo {
  private readonly log: debug.Debugger;

  constructor(private readonly db: IDatabase) {
    this.log = debug(UserRepo.name)
  }

  public async find(): Promise<UserListItem[]> {
    const result = await this.db.query<UserListItem>(sql`SELECT id FROM users`);
    return result.rows;
  }
}
