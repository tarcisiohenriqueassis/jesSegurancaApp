import React from 'react';
import { View, Text, Image, Dimensions, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

export default function Layout() {
  const insets = useSafeAreaInsets(); // Captura as margens seguras (safe area)

  return (
    <Tabs
      screenOptions={{
        tabBarStyle: {
          position: 'absolute',
          bottom: insets.bottom, // respeita a área segura inferior
          left: 0,
          right: 0,
          height: Platform.OS === 'ios' ? 60 + insets.bottom : 70 + insets.bottom,
          backgroundColor: '#fff',
          borderTopWidth: 0,
          shadowColor: '#000',
          shadowOffset: {
            width: 0,
            height: -3,
          },
          shadowOpacity: 0.25,
          shadowRadius: 3.5,
          elevation: 5,
          paddingBottom: insets.bottom > 0 ? insets.bottom : 10, // segurança extra para Android
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
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Inicio',
          tabBarIcon: ({ color }) => <Ionicons name="home" size={30} color={color} />,
          headerTitleAlign: 'center',
          headerTitle: () => (
            <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', height: 35, justifyContent: 'center' }}>
              <Image source={require("../../assets/imagens/jes.png")} style={{ width: 35, height: 35, resizeMode: "contain" }} />
              <Text style={{ fontSize: width * 0.050, fontWeight: 'bold' }}>
                JES Segurança LTDA
              </Text>
            </View>
          ),
        }}
      />

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

      <Tabs.Screen
        name="cadastrarVigilante"
        options={{
          title: 'Cadastrar',
          tabBarIcon: ({ color }) => <Ionicons name="person-add" size={30} color={color} />,
          headerTitleAlign: 'center',
          headerTitleStyle: {
            fontSize: width * 0.050,
            fontWeight: 'bold',
            textTransform: 'uppercase',
          },
        }}
      />

      <Tabs.Screen
        name="equipamentos"
        options={{
          title: 'Equipamentos',
          tabBarIcon: ({ color }) => <Ionicons name="shirt" size={30} color={color} />,
          headerTitleAlign: 'center',
          headerTitleStyle: {
            fontSize: width * 0.050,
            fontWeight: 'bold',
            textTransform: 'uppercase',
          },
        }}
      />
    </Tabs>
  );
}
