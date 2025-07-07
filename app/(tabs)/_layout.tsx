import React from 'react';
import {
  View,
  Text,
  Image,
  Dimensions,
  Platform,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Drawer } from 'expo-router/drawer';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

export default function Layout() {
  const insets = useSafeAreaInsets();

  // Botão customizado sem feedback visual (opcional)
  const NoRippleButton = ({ onPress, children, style, ...rest }) => (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={1}
      style={[{ flex: 1 }, style]}
      {...rest}
    >
      {children}
    </TouchableOpacity>
  );

  return (
    <Drawer
      screenOptions={{
        drawerStyle: {
          backgroundColor: '#fff',
          width: width * 0.75, // Largura do drawer
        },
        headerTitleAlign: 'center',
        headerTitle: () => (
          <View
            style={{
              flex: 1,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Image
              source={require('../../assets/imagens/jes.png')}
              style={{ width: 35, height: 35, resizeMode: 'contain' }}
            />
            <Text style={{ fontSize: width * 0.05, fontWeight: 'bold' }}>
              JES Segurança LTDA
            </Text>
          </View>
        ),
        drawerActiveTintColor: '#007fFF',
        drawerInactiveTintColor: '#000',
        drawerLabelStyle: {
          fontSize: width * 0.024,
          fontWeight: 'bold',
          textTransform: 'uppercase',
        },
        // Pode personalizar o drawer item button se quiser usar NoRippleButton
        // drawerItemStyle: { ... },
      }}
    >
      <Drawer.Screen
        name="index"
        options={{
          title: 'Inicio',
          drawerIcon: ({ color }) => <Ionicons name="home" size={24} color={color} />,
        }}
      />
      <Drawer.Screen
        name="vigilantes"
        options={{
          title: 'Vigilantes',
          drawerIcon: ({ color }) => <Ionicons name="person" size={24} color={color} />,
        }}
      />
      <Drawer.Screen
        name="cadastrarVigilante"
        options={{
          title: 'Cadastrar',
          drawerIcon: ({ color }) => <Ionicons name="person-add" size={24} color={color} />,
        }}
      />
      <Drawer.Screen
        name="equipamentos"
        options={{
          title: 'Equipamentos',
          drawerIcon: ({ color }) => <Ionicons name="shirt" size={24} color={color} />,
        }}
      />
    </Drawer>
  );
}
