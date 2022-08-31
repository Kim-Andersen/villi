import * as React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { Paragraph } from 'react-native-paper';
import { Comment } from '../shared/types';
import AvatarImage from './AvatarImage';

type Props = {
  comment: Comment;
  onViewProfilePress: (profile_id: number) => void;
};

export function CommentListItem({ comment, onViewProfilePress }: Props) {
  return (
    <View style={styles.item}>
      <TouchableOpacity onPress={() => onViewProfilePress(comment.profile_id)}>
        <View style={styles.firstRow}>
          <AvatarImage uri={comment.profile_pic} size={24} style={styles.avatarImage} />
          <Paragraph style={styles.title}>{comment.full_name}</Paragraph>
        </View>
      </TouchableOpacity>
      <View style={styles.secondRow}>
        <Paragraph>{comment.text}</Paragraph>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  item: {
    paddingRight: 20,
    paddingLeft: 20,
    paddingTop: 10,
    paddingBottom: 0,
    marginBottom: 0,
  },
  firstRow: {
    flexDirection: 'row',
    marginTop: 5,
    marginBottom: 5,
  },
  secondRow: {
    marginBottom: 10,
  },
  title: { fontWeight: 'bold' },
  avatarImage: {
    marginRight: 10
  }
});
