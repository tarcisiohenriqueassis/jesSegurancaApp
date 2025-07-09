import React from 'react';
import {
  View,
  Text,
  Image,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Drawer } from 'expo-router/drawer';

// Obtém a largura da tela para tornar o layout responsivo
const { width } = Dimensions.get('window');

export default function Layout() {
  return (
    <Drawer
      screenOptions={{
        // Estilo geral do menu lateral (drawer)
        drawerStyle: {
          backgroundColor: '#fff',
          width: width * 0.75, // 75% da largura da tela
        },

        // Centraliza o título do cabeçalho
        headerTitleAlign: 'center',

        // Customiza o conteúdo do cabeçalho
        headerTitle: () => (
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 10,
            }}
          >
            <Image
              source={require('../../assets/imagens/jes.png')} // Caminho do logo
              style={{ width: 35, height: 35, resizeMode: 'contain' }}
            />
            <Text style={{ fontSize: width * 0.045, fontWeight: 'bold' }}>
              JES Segurança LTDA
            </Text>
          </View>
        ),

        // Estilo dos itens do menu
        drawerActiveTintColor: '#007fFF', // Cor do item selecionado
        drawerInactiveTintColor: '#000',  // Cor dos demais itens
        drawerLabelStyle: {
          fontSize: width * 0.032, // Fonte adaptativa
          fontWeight: 'bold',
          textTransform: 'uppercase',
        },
      }}
    >
      {/* Tela inicial */}
      <Drawer.Screen
        name="index"
        options={{
          title: 'Início',
          drawerIcon: ({ color }) => (
            <Ionicons name="home" size={24} color={color} />
          ),
        }}
      />

      {/* Tela de vigilantes */}
      <Drawer.Screen
        name="vigilantes"
        options={{
          title: 'Vigilantes',
          drawerIcon: ({ color }) => (
            <Ionicons name="person" size={24} color={color} />
          ),
        }}
      />

      {/* Tela de coordenadores */}
      <Drawer.Screen
        name="coordenadores"
        options={{
          title: 'Coordenadores',
          drawerIcon: ({ color }) => (
            <Ionicons name="people" size={24} color={color} />
          ),
        }}
      />

      {/* Tela de cadastro de vigilante */}
      <Drawer.Screen
        name="cadastrarVigilante"
        options={{
          title: 'Cadastrar',
          drawerIcon: ({ color }) => (
            <Ionicons name="person-add" size={24} color={color} />
          ),
        }}
      />

      {/* Tela de equipamentos */}
      <Drawer.Screen
        name="equipamentos"
        options={{
          title: 'Equipamentos',
          drawerIcon: ({ color }) => (
            <Ionicons name="shirt" size={24} color={color} />
          ),
        }}
      />
    </Drawer>
  );
}
