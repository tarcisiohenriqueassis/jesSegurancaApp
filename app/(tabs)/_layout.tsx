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
import { Tabs } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

export default function Layout() {
  

  const insets = useSafeAreaInsets();

  // Botão customizado sem feedback visual
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
    <Tabs
      screenOptions={{
        tabBarStyle: {
          position: 'absolute',
          bottom: 50 - insets.bottom,
          left: 0,
          right: 0,
          height: Platform.OS === 'ios' ? 50 + insets.bottom : 60 + insets.bottom,
          backgroundColor: '#fff',
          borderTopWidth: 0,
          shadowColor: 'transparent',
          shadowOffset: { width: 0, height: 0 },
          shadowOpacity: 0,
          shadowRadius: 0,
          elevation: 0,
          paddingBottom: insets.bottom > 0 ? insets.bottom : 10,
        },
        tabBarLabelStyle: {
          fontSize: width * 0.024,
          textTransform: 'uppercase',
          fontWeight: 'bold',
        },
        tabBarActiveBackgroundColor: '#007fFF',
        tabBarInactiveBackgroundColor: '#fff',
        tabBarLabelPosition: 'below-icon',
        tabBarActiveTintColor: '#fff',
        tabBarInactiveTintColor: '#000',
        tabBarButton: (props) => <NoRippleButton {...props} />,
      }}
    >
      {/* Tela Inicial */}
      <Tabs.Screen
        name="index"
        options={{
          title: 'Inicio',
          tabBarIcon: ({ color }) => <Ionicons name="home" size={30} color={color} />,
          headerTitleAlign: 'center',
          headerTitle: () => (
            <View style={{
              flex: 1,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <Image
                source={require('../../assets/imagens/jes.png')}
                style={{ width: 35, height: 35, resizeMode: 'contain' }}
              />
              <Text style={{ fontSize: width * 0.05, fontWeight: 'bold' }}>
                JES Segurança LTDA
              </Text>
            </View>
          ),
        }}
      />

      {/* Tela de Vigilantes */}
      <Tabs.Screen
        name="vigilantes"
        options={{
          title: 'Vigilantes',
          tabBarIcon: ({ color }) => <Ionicons name="person" size={30} color={color} />,
          headerTitleAlign: 'center',
          headerTitleStyle: {
            fontSize: width * 0.049,
            fontWeight: 'bold',
            textTransform: 'uppercase',
          },
        }}
      />

      {/* Tela de Cadastro */}
      <Tabs.Screen
        name="cadastrarVigilante"
        options={{
          title: 'Cadastrar',
          tabBarIcon: ({ color }) => <Ionicons name="person-add" size={30} color={color} />,
          headerTitleAlign: 'center',
          headerTitleStyle: {
            fontSize: width * 0.05,
            fontWeight: 'bold',
            textTransform: 'uppercase',
          },
        }}
      />

      {/* Tela de Equipamentos */}
      <Tabs.Screen
        name="equipamentos"
        options={{
          title: 'Equipamentos',
          tabBarIcon: ({ color }) => <Ionicons name="shirt" size={30} color={color} />,
          headerTitleAlign: 'center',
          headerTitleStyle: {
            fontSize: width * 0.05,
            fontWeight: 'bold',
            textTransform: 'uppercase',
          },
        }}
      />
    </Tabs>
  );
}
