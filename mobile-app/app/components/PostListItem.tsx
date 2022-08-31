import * as React from 'react';
import { Image, StyleSheet, TouchableOpacity, useWindowDimensions, View } from 'react-native';
import { Paragraph, Text } from 'react-native-paper';
import { Post } from '../shared/types';
import AvatarImage from './AvatarImage';

type Props = {
  post: Post;
  onViewCommentsPress: (post: Post) => void;
  onViewProfilePress: (profile_id: number) => void;
  onTagPress: (tag: string) => void;
};

export function PostListItem({ post, onViewProfilePress, onTagPress, onViewCommentsPress }: Props) {
  const windowDimensions = useWindowDimensions();

  const renderTag = (tag: string) => (
    <TouchableOpacity key={tag} onPress={() => onTagPress(tag)} style={styles.tag}>
      <Text variant="labelMedium">#{tag} </Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.item}>
      <TouchableOpacity onPress={() => onViewProfilePress(post.profile_id)}>
        <View style={[styles.firstRow, styles.contentPaddingHorizontal]}>
          <AvatarImage uri={post.profile_pic} size={24} style={styles.avatarImage} />
          <Paragraph style={styles.title}>{post.full_name}</Paragraph>
        </View>
      </TouchableOpacity>
      <Image source={{ uri: post.photos[0] }} resizeMode='cover' style={{ width: windowDimensions.width, height: windowDimensions.width }} />
      <View style={styles.contentPaddingHorizontal}>
        <View style={styles.captionRow}>
          <Paragraph>
            {post.caption} 
          </Paragraph>
          <View style={styles.tags}>
            {post.tags.map(tag => renderTag(tag))}
          </View>
        </View>
        <TouchableOpacity style={styles.commentsButton} onPress={() => onViewCommentsPress(post)}>
          <Text variant="labelMedium">View comments</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  item: {
    paddingTop: 10,
    paddingBottom: 10,
    marginBottom: 0,
  },
  contentPaddingHorizontal: {
    paddingRight: 20,
    paddingLeft: 20
  },
  firstRow: {
    flexDirection: 'row',
    marginTop: 5,
    marginBottom: 5,
  },
  captionRow: {
    marginTop: 10,
    marginBottom: 10,
  },
  title: { fontWeight: 'bold' },
  avatarImage: {
    marginRight: 10
  },
  tags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 5
  },
  tag: {
    color: 'darkblue',
    marginRight: 2
  },
  commentsButton: {
    
  }
});
