import { useAuth } from '@/src/providers/AuthProvider';
import { ActivityIndicator, View } from 'react-native';

export default function Index() {
  const { loading } = useAuth();

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  // El AuthProvider ya maneja la redirección
  // Este componente solo muestra un loader mientras se decide
  return null;
}