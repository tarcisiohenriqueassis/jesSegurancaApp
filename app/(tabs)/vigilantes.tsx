import React from 'react';
import { View} from 'react-native';

import FuncionariosScreen from "../../components/listaFuncionarios/FuncionariosScreen.jsx";


export default function Vigilantes() {
  return (
   
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <FuncionariosScreen/>
      </View>
   
  );
}