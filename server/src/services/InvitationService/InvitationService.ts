import debug from 'debug';
import { IInvitationModel } from '../../models';
import { Invitation, InvitationInput, invitationInputSchema } from '../../shared';
import { IInvitationService } from './types';

export class InvitationService implements IInvitationService {
  private readonly log = debug(InvitationService.name);
  
  constructor(private readonly invitationModel: IInvitationModel) {
    this.log('initialize');
  }

  public async create(input: InvitationInput): Promise<Invitation> {
    return this.invitationModel.insert(input);
  }

  public async findOneByEmail(email: string): Promise<Invitation> {
    return this.invitationModel.findOne(invitationInputSchema.parse({ email }));
  }
}