import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useContext, useState } from 'react';
import { Image, Platform, SafeAreaView, ScrollView, StyleSheet, View } from 'react-native';
import { Button, List, TextInput } from 'react-native-paper';
import { Divider } from '../../components/Divider';
import { CreatePostStackParamList } from '../../navigation/CreatePostStack';
import { translate } from '../../translations';
import { CreatePostContext } from './state/CreatePostContext';

type Props = NativeStackScreenProps<CreatePostStackParamList, 'CreatePostDetails'>;

export function CreatePostDetailsScreen({ navigation }: Props) {
  const { caption, image, action, setCaption, setTags } = useContext(CreatePostContext)!;
  if (image === null) {
    console.error('image missing in state.');
    navigation.goBack();
    return (<React.Fragment />);
  }
  const [showHashtags, setShowHashtags] = useState<boolean>(false);
  const [hashtagQuery, setHashtagQuery] = useState<string | null>(null);

  
  const onChangePhoto = () => navigation.navigate('StartScreen');
  const onAddAction = () => navigation.navigate('SelectAction');

  const onPreviewPesss = () => {
    navigation.navigate('CreatePostPreview');
  };

  const onCaptionChangeText = (text: string) => {
    setCaption(text);
    if (text.length === 0) {
      setShowHashtags(false);
      setHashtagQuery(null);
    } else if (text.length > 0) {
      const words = text.split(/\s/gm);
      const lastWord = words[words.length -1];
      const isEnteringHashtag = lastWord.startsWith('#');
      
      if (isEnteringHashtag && showHashtags === false) {
        setShowHashtags(true);
      } else if (showHashtags === true && !isEnteringHashtag) {
        setShowHashtags(false);
      }

      setHashtagQuery(isEnteringHashtag ? lastWord.replace('#', '') : null);
    }
  };

  const onSelectHashtag = (hashtag: string) => {
    const words = caption.split(/\s/gm);
    words.pop();
    words.push(`#${hashtag}`);
    setCaption(words.join(' ') + ' '); // Suffix a space so next word can be typed in immediately.
    setTags(caption.split(/\s/gm).filter(word => word.startsWith('#') && word.length > 1).map(h => h.replace('#', '')));
    setShowHashtags(false);
    setHashtagQuery(null);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.captionRow}>
        {/* <FormattedTextInput autoFocus placeholder='Describe your photo' style={{ minHeight: 80 }} /> */}
        <TextInput 
        value={caption} 
          autoFocus
          onChangeText={onCaptionChangeText} 
          placeholder='Describe your photo' 
          multiline
          style={styles.captionTextInput}
          keyboardType={Platform.OS === 'ios' ? 'twitter': 'default'}
          />
        {/* <Button mode='outlined' onPress={() => setShowHashtags(true)}>#hashtag</Button> */}
      </View>
      <View style={{ flex: 1, position: 'relative' }}>
        {showHashtags && <Hashtags query={hashtagQuery} onSelect={onSelectHashtag} />}
        <Divider />
        <List.Item title='Change photo' onPress={onChangePhoto} right={props => <Image {...props} source={{ uri: image.uri }} style={{ width: 40, height: 40 }} />} />
        <Divider />
        {/* <List.Item title='Add location' onPress={onAddLocation} disabled style={styles.listItem} right={props => <List.Icon {...props} icon='arrow-right' />} /> */}
        <List.Item title={translate(action ? action.title : 'createPost.addAction')} onPress={onAddAction} right={props => <List.Icon {...props} icon='arrow-right' />} />
        <Divider />
        <View style={styles.bottomButton}>
          <Button mode='outlined' disabled={caption.length === 0} onPress={onPreviewPesss} style={styles.button}>
            Preview
          </Button>
        </View>
      </View>
    </SafeAreaView>
  );
}

function Hashtags({query, onSelect}: { query?: string | null, onSelect: (hashtag: string) => void }) {
  const allHashtags = ['bio', 'farm', 'direct-sales', 'market'];
  const filtered = query ? allHashtags.filter(h => h.includes(query.toLowerCase())) : allHashtags;
  return (
    <ScrollView style={{ flex: 1, position: 'absolute', backgroundColor: '#fff', width: '100%', height: '100%', zIndex: 1 }}>
      {filtered.map(hashtag => <List.Item title={`#${hashtag}`} key={hashtag} onPress={() => onSelect(hashtag)} style={{ paddingVertical: 5 }} />)}
      <Divider />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  captionRow: {
    backgroundColor: '#fff'
  },
  captionTextInput: {
    backgroundColor: 'transparent',
    fontSize: 15,
    paddingBottom: 20,
    minHeight: 80
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
    marginTop: 10
  }
});