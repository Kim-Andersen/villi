import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import { PostDetailsScreen } from '../screens/PostDetailsScreen';
import { PostListScreen } from '../screens/PostListScreen';
import { ProfileScreen } from '../screens/ProfileScreen';
import { TagScreen } from '../screens/TagScreen';
import { Post } from '../shared/types';

export type FeedStackParamList = {
  PostList: undefined;
  PostDetails: { post: Post };
  Profile: { profile_id: number };
  Tag: { tag: string };
};

const Stack = createNativeStackNavigator<FeedStackParamList>();

export function FeedStack() {
  return (
    <Stack.Navigator initialRouteName="PostList">
      <Stack.Screen name="PostList" component={PostListScreen} options={{ headerTitle: '' }} />
      <Stack.Screen name="PostDetails" component={PostDetailsScreen} options={{ title: 'Comments' }} />
      <Stack.Screen name="Profile" component={ProfileScreen} />
      <Stack.Screen name="Tag" component={TagScreen} />
    </Stack.Navigator>
  );
}
