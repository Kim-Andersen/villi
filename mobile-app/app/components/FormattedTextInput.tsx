import React, { useRef, useState } from 'react';
import { StyleSheet, Text, TextInput, TextInputProps, TextStyle, View } from 'react-native';

const validateMention = (word: string): boolean => {
  var format = /[ !#@$%^&*()_+\-=\[\]{};':"\\|,.<>\/?\n]/;
  if (
      (word.startsWith('@') && !format.test(word.substr(1))) ||
      (word.startsWith('#') && !format.test(word.substr(1)))
  ) {
      return true;
  }
  return false;
};

type Props = {
  style?: TextStyle;
} & TextInputProps;

export function FormattedTextInput(props: Props) {
  const [formattedText, setFormattedText] = useState<string>('');
  const textInputRef = useRef<TextInput>(null);

  const onChangeText = (text: string) => {
    const retLines = text.split('\n');
    const formattedText = [];
    retLines.forEach((retLine, index) => {
      if (index !== 0) formattedText.push('\n');
      const words = retLine.split(' ');
      const contentLength = words.length;
      words.forEach((word, index) => {
          if (validateMention(word)) {
              const mention = (
                  <Text key={index} style={{ color: 'red' }}>
                      {word}
                  </Text>
              );
              if (index !== contentLength - 1)
                  formattedText.push(mention, ' ');
              else formattedText.push(mention);
          } else {
              if (index !== contentLength - 1)
                  return formattedText.push(word, ' ');
              else return formattedText.push(word);
          }
      });
  });

    setFormattedText(text);
  };

  return (
    <View style={[styles.container, props.style]} onTouchStart={() => textInputRef.current?.focus()}>
      <Text style={styles.text}>{formattedText}</Text>
      <TextInput
        ref={textInputRef}
        onChangeText={onChangeText} 
        style={styles.textInput}
        // multiline
        {...props}
        />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative'
  },
  textInput: {
    color: 'green',
    position: 'absolute',
    width: '100%',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0
  },
  text: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0
  }
});
