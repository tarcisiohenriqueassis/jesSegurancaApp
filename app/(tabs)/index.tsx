import React from 'react';
import { View } from 'react-native';

// Importando o SafeAreaProvider para gerenciar as áreas seguras
import { SafeAreaProvider } from 'react-native-safe-area-context';

// Importando o componente Dashboard
import Dashboard from "../dashbord";

export default function App() {
  return(
     <SafeAreaProvider>
       <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
         <Dashboard />
       </View>
     </SafeAreaProvider>
  );
};