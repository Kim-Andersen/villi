import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useContext } from 'react';
import { ImageBackground, SafeAreaView, StyleSheet, View } from 'react-native';
import { Button } from 'react-native-paper';
import { CreatePostStackParamList } from '../../navigation/CreatePostStack';
import { CreatePostContext } from './state/CreatePostContext';

type Props = NativeStackScreenProps<CreatePostStackParamList, 'PreviewPhoto'>;

export function PreviewPhotoScreen({ navigation }: Props) {
  const { image } = useContext(CreatePostContext)!;
  if (image === null) {
    console.error('image missing in state.');
    navigation.goBack();
    return (<React.Fragment />);
  }

  return (
    <SafeAreaView style={styles.container}>
      <ImageBackground source={{ uri: image.uri }} resizeMode='cover' style={styles.backgroundImage} />
      <View style={styles.buttons}>
        <Button mode='outlined' textColor='#fff' onPress={() => navigation.navigate('CreatePostDetails')} style={styles.button}>
          Use photo
        </Button>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000'
  },
  backgroundImage: {
    flex: 1
  },
  buttons: {
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