import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Button, Text } from 'react-native-paper';
import { useQuery } from 'react-query';
import AvatarImage from '../components/AvatarImage';
import { Divider } from '../components/Divider';
import { ErrorMessage } from '../components/ErrorMessage';
import { LoadingIndicator } from '../components/LoadingIndicator';
import { ApiError, fetchProfile } from '../lib/api';
import { FeedStackParamList } from '../navigation/FeedStack';
import { Profile } from '../shared/types';

type Props = NativeStackScreenProps<FeedStackParamList, 'Profile'>;

export function ProfileScreen({ route }: Props) {
  const { profile_id } = route.params;
  const { isLoading, error, data: profile } = useQuery<Profile, ApiError>(['profiles', profile_id], () => fetchProfile(profile_id));

  if (isLoading || !profile) {
    return <LoadingIndicator />;
  }

  if (error) {
    return <ErrorMessage message={error.message}></ErrorMessage>;
  }

  return (
    <View style={styles.container}>
      <View style={styles.avatarImageRow}>
        <AvatarImage uri={profile.profile_pic} size={100} />
      </View>
      <View style={styles.titleRow}>
        <Text variant="titleMedium">{profile.full_name}</Text>
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
  avatarImageRow: {
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 10
  },
  titleRow: {
    alignItems: 'center',
    marginBottom: 20
  },
  followButtonRow: {
    alignItems: 'center',
    marginBottom: 20
  }
});