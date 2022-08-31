import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useContext } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, View } from 'react-native';
import { Button } from 'react-native-paper';
import { PostListItem } from '../../components/PostListItem';
import { CreatePostStackParamList } from '../../navigation/CreatePostStack';
import { CreatePostContext } from './state/CreatePostContext';

type Props = NativeStackScreenProps<CreatePostStackParamList, 'CreatePostPreview'>;

export function CreatePostPreviewScreen() {
  const { caption, image, tags } = useContext(CreatePostContext)!;
  const post = {
    id: 0,
    profile_id: 0,
    profile_pic: 'https://s3.us-west-2.amazonaws.com/images.unsplash.com/small/photo-1645075960701-573cbc669de6',
    full_name: 'Jane Doe',
    created_at: new Date().toString(),
    caption,
    comment_count: 0,
    photos: image ? [image.uri] : [],
    tags: tags as string[]
  };

  const onPost = () => {};
  const noop = () => {};
  
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <PostListItem post={post} onTagPress={noop} onViewCommentsPress={noop} onViewProfilePress={noop} />
      </ScrollView>
      <View style={styles.bottomButton}>
          <Button mode='elevated' onPress={onPost} style={styles.button}>
            Post
          </Button>
        </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  scrollView: {
    paddingBottom: 100
  },
  bottomButton: {
    position: 'absolute',
    bottom: 20,
    left: 0,
    right: 0,
    alignItems: 'center',
    paddingHorizontal: 10
  },
  button: {
    alignSelf: 'stretch',
    marginTop: 10,
    borderColor: '#fff'
  }
});