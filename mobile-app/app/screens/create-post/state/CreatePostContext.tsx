import { ImageInfo } from 'expo-image-picker';
import { createContext, useState } from 'react';
import { Action } from '../../../data/types';

export type CreatePostState = {
  image: Readonly<ImageInfo | null>;
  caption: Readonly<string>;
  action: Readonly<Action | null>;
  tags: Readonly<string[]>;
  setImage: (imageInfo: ImageInfo) => void;
  setCaption: (value: string) => void;
  setAction: (action: Action | null) => void;
  setTags: (tags: string[]) => void;
};

export const CreatePostContext = createContext<CreatePostState | null>(null);

export const CreatePostProvider = ({ children }: { children: any }) => {
  const [image, setImage] = useState<ImageInfo | null>(null);
  const [caption, setCaption] = useState<string>('');
  const [action, setAction] = useState<Action | null>(null);
  const [tags, setTags] = useState<string[]>([]);
  
  const state: CreatePostState = {
    image,
    caption,
    action,
    tags,
    setImage,
    setCaption,
    setAction,
    setTags
  };

  return (
    <CreatePostContext.Provider value={state}>
      {children}
    </CreatePostContext.Provider>
  ); 
}