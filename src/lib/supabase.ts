import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';
import { AppState, Platform } from 'react-native';

{/* Crear un storage personalizado que solo funcione en el cliente
Este Custom Storages se hizo por incompatibilidad para la version Web
es una solucion temporal, creo que lo ideal seria hacer carpetas para controlar versiones 
multiplataformas, seguramente pase lo mismo al intentar abrir la aplicacion en IOS al no tenerlo
controlado con las versiones especificas de dicho dispositivo, igualmente es el mismo resultado
ya que tira de AsyncStorage*/}
const customStorage = {
  getItem: async (key: string) => {
    if (Platform.OS === 'web' && typeof window === 'undefined') {
      return null;
    }
    return AsyncStorage.getItem(key);
  },
  setItem: async (key: string, value: string) => {
    if (Platform.OS === 'web' && typeof window === 'undefined') {
      return;
    }
    return AsyncStorage.setItem(key, value);
  },
  removeItem: async (key: string) => {
    if (Platform.OS === 'web' && typeof window === 'undefined') {
      return;
    }
    return AsyncStorage.removeItem(key);
  },
};

{/* esto exporta las variables de entorno para permitir la conexion con supabase
  tener en cuenta que los archivos .env no se suben al repositorio asi que tocara crear el archivo
  nuevamente y colocar las variables de entorno cuando se cambie de dispositivo o se despliegue 
  la aplicacion, el auth se encarga de indicar donde se almacenaran los datos (local)
  si el token se autorefresca, si la sesion persiste y si detecta sesion por url */}
export const supabase = createClient(
  process.env.EXPO_PUBLIC_SUPABASE_URL!,
  process.env.EXPO_PUBLIC_SUPABASE_KEY!,
  {
    auth: {
      storage: customStorage,
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: false,
    },
  }
);

AppState.addEventListener('change', (state) => {
  if (state === 'active') {
    // Cuando volvemos a la app, forzamos a Supabase a despertar y chequear el token
    supabase.auth.startAutoRefresh();
  } else {
    // Cuando se va a segundo plano, le decimos que pare para no bugearse
    supabase.auth.stopAutoRefresh();
  }
});

