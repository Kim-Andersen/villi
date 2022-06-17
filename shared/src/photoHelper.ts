import { PhotoSize } from './types';

class PhotoHelper {
  private readonly photoSizes: Record<PhotoSize, number> = {
    'xs': 75,
    'sm': 150,
    'md': 500,
    'lg': 800,
    'xl': 1200
  };

  public getPhotoUrl({ key, bucket, size }: { key: string; bucket: string; size: PhotoSize }): string {
    return `https://${bucket}.oss.nodechef.com/${this.formatKey(key, size)}`;
  }

  public formatKey(key: string, size: PhotoSize): string {
    return `${key}_${size}`;
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