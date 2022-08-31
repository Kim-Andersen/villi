import * as React from 'react';
import { StyleProp, ViewStyle } from 'react-native';
import { Avatar } from 'react-native-paper';

type Props = {
  uri: string;
  size?: number;
  style?: StyleProp<ViewStyle>
};

function handleError(error: any) {
  console.log('AvatarImage error', error);
}

const AvatarImage = ({ uri, size, style }: Props) => { 
  return (
    <Avatar.Image size={size ?? 24} source={{ uri }} style={style} onError={handleError} />
  );
};
export default AvatarImage;