import * as React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export function ErrorMessage({ message }: { message: string }) {
  return (
    <View style={styles.fill}>
      <Text>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  fill: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
