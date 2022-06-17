import Resizer from "react-image-file-resizer";


export type ImageFileResizerProps = {
  /**
   * New image max width (ratio is preserved).
   */
  maxWidth: number;
  /**
   * New image max height (ratio is preserved).
   */
  maxHeight: number;
  /**
   * New image min width (ratio is preserved, defaults to null).
   */
  minWidth?: number;
  /**
   * New image min height (ratio is preserved, defaults to null)
   */
  minHeight?: number;
  /**
   * Can be either 'JPEG', 'PNG' or 'WEBP'.
   */
  compressFormat: 'JPEG' | 'PNG' | 'WEBP';
  /**
   * A number between 0 and 100.
   * Used for the JPEG compression.
   * (if no compress is needed, just set it to 100)
   */
  quality: number;
  /**
   * Degree of clockwise rotation to apply to the image.
   * Rotation is limited to multiples of 90 degrees.
   * (if no rotation is needed, just set it to 0) (0, 90, 180, 270, 360).
   */
  rotation: number;
};

export async function resizeImageFile(
  file: File, 
  { maxWidth, maxHeight, compressFormat, quality, rotation, minWidth, minHeight }: ImageFileResizerProps): Promise<string> {
  return new Promise(resolve => {
    Resizer.imageFileResizer(
      file,
      maxWidth,
      maxHeight,
      compressFormat,
      quality,
      rotation,
      uri => resolve(uri as string),
      "base64",
      minWidth,
      minHeight
    );
  });
}