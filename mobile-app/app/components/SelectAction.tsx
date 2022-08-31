import React from 'react';
import { SafeAreaView, ScrollView, StyleSheet, View } from 'react-native';
import { IconButton, List, Text } from 'react-native-paper';
import { actionTree } from '../data/actionTree';
import { Action } from '../data/types';
import { translate } from '../translations';
import { Divider } from './Divider';

type Props = {
  onSelect: (action: Action) => void;
};

export function SelectAction({ onSelect }: Props) {
  const [categoryIndex, setCategoryIndex] = React.useState<number>(0);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.categoriesRow}>
        {actionTree.categories.map(({ icon }, index) => (
          <IconButton 
            key={index} 
            mode='contained' 
            icon={icon} 
            size={40} 
            style={styles.categoryButton} 
            onPress={() => setCategoryIndex(index)}  />
        ))}
      </View>
      <Divider />
      <ScrollView style={styles.scrollView}>
        {actionTree.categories[categoryIndex].groups.map((group, index) => (
          <View style={styles.group} key={index}>
            <Text style={styles.groupName}>{translate(group.title)}</Text>
            {group.actions.map(action => (
              <View key={action.id}>
                <List.Item title={translate(action.title)} style={styles.listItem} onPress={() => onSelect(action)} />
                <Divider />
              </View>
            ))}
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  categoriesRow: {
    height: 100,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row'
  },
  categoryButton: {
    margin: 10
  },
  scrollView: {
    flex: 1
  },
  group: {
  },
  groupName: {
    opacity: 0.5,
    paddingHorizontal: 16,
    paddingVertical: 5
  },
  listItem: {
    backgroundColor: '#fff'
  }
});