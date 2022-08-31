import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React from 'react';
import { FlatList, ListRenderItem, RefreshControl } from 'react-native';
import { useQuery } from 'react-query';
import { Divider } from '../components/Divider';
import { ErrorMessage } from '../components/ErrorMessage';
import { LoadingIndicator } from '../components/LoadingIndicator';
import { PostListItem } from '../components/PostListItem';
import { useRefreshByUser } from '../hooks/useRefreshByUser';
import { useRefreshOnFocus } from '../hooks/useRefreshOnFocus';
import { ApiError, fetchPosts } from '../lib/api';
import { FeedStackParamList } from '../navigation/FeedStack';
import { Post } from '../shared/types';

type Props = NativeStackScreenProps<FeedStackParamList, 'PostList'>;

export function PostListScreen({ navigation }: Props) {
  const { isLoading, error, data, refetch } = useQuery<Post[], ApiError>(['posts'], fetchPosts);
  const { isRefetchingByUser, refetchByUser } = useRefreshByUser(refetch);
  useRefreshOnFocus(refetch);

  const onViewPostCommentsPress = React.useCallback(
    (post: Post) => navigation.navigate('PostDetails', { post }),
    [navigation]
  );

  const onViewProfilePress = React.useCallback(
    (profile_id: number) => navigation.navigate('Profile', { profile_id }),
    [navigation]
  );

  const onPostTagPress = React.useCallback(
    (tag: string) => navigation.navigate('Tag', { tag }),
    [navigation]
  );

  const renderPostItem: ListRenderItem<Post> = React.useCallback(
    ({ item: post }) => <PostListItem 
      post={post} 
      onViewProfilePress={onViewProfilePress} 
      onTagPress={onPostTagPress}
      onViewCommentsPress={onViewPostCommentsPress} 
      />,
    [onViewPostCommentsPress]
  );

  if (isLoading) {
    return <LoadingIndicator />;
  }

  if (error) {
    return <ErrorMessage message={error.message}></ErrorMessage>;
  }

  return (
    <FlatList
      data={data}
      renderItem={renderPostItem}
      keyExtractor={(item) => `${item.id}`}
      ItemSeparatorComponent={() => <Divider />}
      refreshControl={
        <RefreshControl
          refreshing={isRefetchingByUser}
          onRefresh={refetchByUser}
        />
      }
      ></FlatList>
  );
}
