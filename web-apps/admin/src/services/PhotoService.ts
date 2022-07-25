import { IBackendAPI } from '../api/types';
import { Photo } from '../shared';

export default class PhotoService {
  public readonly isWorking = this.api.isWorking;

  constructor(private readonly api: IBackendAPI) {}

  public async uploadPhoto(file: File): Promise<Photo> {
    const formData: FormData = new FormData();
    formData.append('file', file);

    return this.api.post<Photo>('/photos', null, formData);
  }
}
