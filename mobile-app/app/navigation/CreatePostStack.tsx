import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import { CreatePostDetailsScreen } from '../screens/create-post/CreatePostDetailsScreen';
import { CreatePostPreviewScreen } from '../screens/create-post/CreatePostPreviewScreen';
import { PreviewPhotoScreen } from '../screens/create-post/PreviewPhotoScreen';
import { SelectActionScreen } from '../screens/create-post/SelectActionScreen';
import { SelectHashtagScreen } from '../screens/create-post/SelectHashtagScreen';
import { StartScreen } from '../screens/create-post/StartScreen';
import { CreatePostProvider } from '../screens/create-post/state/CreatePostContext';

export type CreatePostStackParamList = {
  StartScreen: undefined;
  PreviewPhoto: undefined;
  CreatePostDetails: undefined;
  CreatePostPreview: undefined;
  SelectAction: undefined;
  SelectHashtag: undefined;
};

const Stack = createNativeStackNavigator<CreatePostStackParamList>();

export function CreatePostStack() {
  return (
    <CreatePostProvider>
      <Stack.Navigator initialRouteName="StartScreen">
        <Stack.Screen name="StartScreen" component={StartScreen} />
        <Stack.Screen name="PreviewPhoto" component={PreviewPhotoScreen} />
        <Stack.Screen name="CreatePostDetails" component={CreatePostDetailsScreen} />
        <Stack.Screen name="SelectAction" component={SelectActionScreen} />
        <Stack.Screen name="SelectHashtag" component={SelectHashtagScreen} />
        <Stack.Screen name="CreatePostPreview" component={CreatePostPreviewScreen} />
      </Stack.Navigator>
    </CreatePostProvider>
  );
}
