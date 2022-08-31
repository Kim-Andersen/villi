import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useContext } from 'react';
import { SelectAction } from '../../components/SelectAction';
import { Action } from '../../data/types';
import { CreatePostStackParamList } from '../../navigation/CreatePostStack';
import { CreatePostContext } from './state/CreatePostContext';

type Props = NativeStackScreenProps<CreatePostStackParamList, 'SelectAction'>;

export function SelectActionScreen({ navigation }: Props) {
  const { setAction } = useContext(CreatePostContext)!;

  const onSelectAction = (action: Action) => {
    setAction(action);
    navigation.navigate('CreatePostDetails');
  };
  
  return (
    <SelectAction onSelect={onSelectAction} />
  );
}
