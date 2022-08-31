import { NavigationContainer } from '@react-navigation/native';
import { AppStateStatus, Platform } from 'react-native';
import { focusManager, QueryClient, QueryClientProvider } from 'react-query';
import { useAppState } from './app/hooks/useAppState';
import { useOnlineManager } from './app/hooks/useOnlineManager';
import { BottomTabs } from './app/navigation/BottomTabs';

function onAppStateChange(state: AppStateStatus) {
  // React Query already supports in web browser refetch on window focus by default
  if (Platform.OS !== 'web') {
    focusManager.setFocused(state === 'active');
  }
}

const queryClient = new QueryClient();

export default function App() {
  useOnlineManager();
  useAppState(onAppStateChange);

  return (
    <QueryClientProvider client={queryClient}>
      <NavigationContainer>
        <BottomTabs />
      </NavigationContainer>
    </QueryClientProvider>
  );
}