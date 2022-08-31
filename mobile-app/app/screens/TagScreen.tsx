import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Button, Text } from 'react-native-paper';
import { Divider } from '../components/Divider';
import { FeedStackParamList } from '../navigation/FeedStack';

type Props = NativeStackScreenProps<FeedStackParamList, 'Tag'>;

export function TagScreen({ route }: Props) {
  const { tag } = route.params;

  return (
    <View style={styles.container}>
      <View style={styles.titleRow}>
        <Text variant="titleMedium">{tag}</Text>
      </View>
      <View style={styles.followButtonRow}>
        <Button mode='contained' buttonColor='red' disabled>Follow</Button>
      </View>
      <Divider />
    </View>
  )   
}

const styles = StyleSheet.create({
  container: {
    paddingRight: 20,
    paddingLeft: 20,
    paddingTop: 10
  },
  title: { fontWeight: 'bold' },
  titleRow: {
    alignItems: 'center',
    marginBottom: 20
  },
  followButtonRow: {
    alignItems: 'center',
    marginBottom: 20
  }
});