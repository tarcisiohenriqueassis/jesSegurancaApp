import React from 'react';
import { View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';


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