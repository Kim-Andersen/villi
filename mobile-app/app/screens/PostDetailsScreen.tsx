import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React from 'react';
import { FlatList, ListRenderItem, RefreshControl } from 'react-native';
import { useQuery } from 'react-query';
import { CommentListItem } from '../components/CommentListItem';
import { Divider } from '../components/Divider';
import { ErrorMessage } from '../components/ErrorMessage';
import { LoadingIndicator } from '../components/LoadingIndicator';
import { useRefreshByUser } from '../hooks/useRefreshByUser';
import { useRefreshOnFocus } from '../hooks/useRefreshOnFocus';
import { ApiError, fetchPostComments } from '../lib/api';
import { FeedStackParamList } from '../navigation/FeedStack';
import { Comment } from '../shared/types';

type Props = NativeStackScreenProps<FeedStackParamList, 'PostDetails'>;

export function PostDetailsScreen({ route, navigation }: Props) {
  const { post } = route.params;
  const { isLoading, error, data, refetch } = useQuery<Comment[], ApiError>(['posts', post.id, 'comments'], () => fetchPostComments(post.id));
  const { isRefetchingByUser, refetchByUser } = useRefreshByUser(refetch);
  useRefreshOnFocus(refetch);

  const onViewProfilePress = React.useCallback(
    (profile_id: number) => navigation.navigate('Profile', { profile_id }),
    [navigation]
  );

  const renderCommentItem: ListRenderItem<Comment> = ({ item: comment }) => <CommentListItem comment={comment} onViewProfilePress={onViewProfilePress} />;

  if (isLoading) {
    return <LoadingIndicator />;
  }

  if (error) {
    return <ErrorMessage message={error.message}></ErrorMessage>;
  }

  return (
    <FlatList
      data={data}
      renderItem={renderCommentItem}
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
