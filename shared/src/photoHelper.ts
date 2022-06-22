import { PhotoSize } from './types';

class PhotoHelper {
  public readonly photoSizes: Record<PhotoSize, number> = {
    'xs': 75,
    'sm': 150,
    'md': 500,
    'lg': 800,
    'xl': 1200
  };

  public getPhotoUrl(environment: 'development' | 'production' | 'test', { key, bucket, size }: { key: string; bucket: string; size: PhotoSize }): string {
    if (environment === 'production') {
      return `https://${bucket}.oss.nodechef.com/${this.getFileName(key, size)}`;
    } else {
      return `http://localhost:3001/public/${bucket}/${this.getFileName(key, size)}`;
    }
  }

  public getFileName(key: string, size: PhotoSize): string {
    return key.replace('.', `_${size}.`);
  }

  /**
   * Returns the corresponding pixel size.
   */
  public getPhotoSize(size: PhotoSize): number {
    return this.photoSizes[size];
  }
}

const photoHelper = new PhotoHelper();
export default photoHelper;