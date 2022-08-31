import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { launchCameraAsync, launchImageLibraryAsync, requestCameraPermissionsAsync, requestMediaLibraryPermissionsAsync } from 'expo-image-picker';
import React, { useContext } from 'react';
import { StyleSheet, useWindowDimensions, View } from 'react-native';
import { Button } from 'react-native-paper';
import { CreatePostStackParamList } from '../../navigation/CreatePostStack';
import { CreatePostContext } from './state/CreatePostContext';

type Props = NativeStackScreenProps<CreatePostStackParamList, 'StartScreen'>;

export function StartScreen({ navigation }: Props) {
  const state = useContext(CreatePostContext)!;
  const windowDimensions = useWindowDimensions();

  const openImagePicker = async () => {
    let permissionResult = await requestMediaLibraryPermissionsAsync();

    if (permissionResult.granted === false) {
      alert("Permission to access camera roll is required!");
      return;
    }

    const result = await launchImageLibraryAsync({ aspect: [windowDimensions.width, windowDimensions.width] });
    if (!result.cancelled) {
      state.setImage(result);
      navigation.navigate('PreviewPhoto')
    }
  }

  const openCamera = async () => {
    const permissionResult = await requestCameraPermissionsAsync();
    if (permissionResult.granted === false) {
      alert("You've refused to allow this appp to access your camera!");
      return;
    }

    const result = await launchCameraAsync({ aspect: [windowDimensions.width, windowDimensions.width] });

    if (!result.cancelled) {
      state.setImage(result);
      navigation.navigate('PreviewPhoto')
    }
  };
  
  return (
    <View style={styles.container}>
      <View style={styles.buttons}>
        <Button mode='outlined' textColor='#fff' onPress={openCamera} style={styles.button}>
          Take a photo
        </Button>
        <Button mode='outlined' textColor='#fff' onPress={openImagePicker} style={styles.button} dark>
          Pick a photo
        </Button>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000'
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