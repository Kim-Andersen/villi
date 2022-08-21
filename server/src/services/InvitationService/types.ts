import { Invitation } from '../../shared';

export interface IInvitationService {
  findOneByEmail(email: string): Promise<Invitation>
}