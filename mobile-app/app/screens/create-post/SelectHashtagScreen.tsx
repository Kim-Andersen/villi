import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useContext } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, View } from 'react-native';
import { IconButton, List, Text } from 'react-native-paper';
import { Divider } from '../../components/Divider';
import { actionTree } from '../../data/actionTree';
import { Action } from '../../data/types';
import { CreatePostStackParamList } from '../../navigation/CreatePostStack';
import { translate } from '../../translations';
import { CreatePostContext } from './state/CreatePostContext';

type Props = NativeStackScreenProps<CreatePostStackParamList, 'SelectAction'>;

export function SelectHashtagScreen({ navigation }: Props) {
  const { setAction } = useContext(CreatePostContext)!;
  const [categoryIndex, setCategoryIndex] = React.useState<number>(0);

  const onSelectAction = (action: Action) => {
    setAction(action);
    navigation.navigate('CreatePostDetails');
  };
  
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
                <List.Item title={translate(action.title)} style={styles.listItem} onPress={() => onSelectAction(action)} />
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