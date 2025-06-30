import React from 'react';
import { View} from 'react-native';

import FuncionariosScreen from "../../components/listaFuncionarios/FuncionariosScreen.js";


export default function Vigilantes() {
  return (
   
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        {/* Você pode adicionar outros componentes aqui, se necessário */}
      <FuncionariosScreen/>
      </View>
   
  );
}