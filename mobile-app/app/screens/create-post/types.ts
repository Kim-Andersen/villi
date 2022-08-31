import { ImageInfo } from 'expo-image-picker';

export type CreatePostInput = {
  imageInfo: ImageInfo;
  caption: string;
};