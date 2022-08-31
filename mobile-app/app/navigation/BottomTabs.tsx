import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { CreatePostStack } from './CreatePostStack';
import { FeedStack } from './FeedStack';

const Tab = createBottomTabNavigator();

export function BottomTabs() {
  return (
    <Tab.Navigator>
      <Tab.Screen name="FeedStack" component={FeedStack} options={{ headerShown: false, title: 'Feed' }} />
      <Tab.Screen name="CreatePostStack" component={CreatePostStack} options={{ headerShown: false, title: 'Post' /* , tabBarStyle: { display: 'none' }*/ }}  />
    </Tab.Navigator>
  );
}