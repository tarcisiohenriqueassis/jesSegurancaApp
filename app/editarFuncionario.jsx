import { useLocalSearchParams, useRouter } from 'expo-router';
import { View, Text, TextInput, Button, Alert, StyleSheet } from 'react-native';
import React,{ useState } from 'react';
import axios from 'axios';


export default function EditarFuncionario() {

  const { id, nome, cpf } = useLocalSearchParams();
  const [novoNome, setNovoNome] = useState(nome);
  const [novoCpf, setNovoCpf] = useState(cpf);
  const router = useRouter();

 const salvarEdicao = async () => {
  try {
    // Monta dinamicamente os campos a serem enviados
    const dadosAtualizados = {};
    if (novoNome) dadosAtualizados.nome = novoNome;
    if (novoCpf) dadosAtualizados.cpf = novoCpf;

    if (Object.keys(dadosAtualizados).length === 0) {
      Alert.alert('Atenção', 'Preencha ao menos um campo para atualizar.');
      return;
    }

    await axios.put(`https://api-jesseguranca.onrender.com/funcionarios/${id}`, dadosAtualizados);

    Alert.alert('Sucesso', 'Funcionário atualizado!');
    router.back(); // volta para tela anterior
  } catch (_error) {
    Alert.alert('Erro', 'Não foi possível atualizar');
  }
};


  return (
    < View style={estilos.container}>
      <Text style={estilos.titulo}>Editar Funcionário</Text>
      <View style={{ height: 20 }} />
      <Text style={estilos.titulo}>Nome</Text>
      <TextInput
        style={estilos.input}
        placeholder="Nome"
        value={novoNome}
        onChangeText={setNovoNome}
      />
      <Text style={estilos.titulo}>CPF</Text>
      <TextInput
        style={estilos.input}
        keyboardType="numeric"
        maxLength={11}
        placeholder="CPF"
        value={novoCpf}
        onChangeText={setNovoCpf}
        />
      <View style={estilos.container}>

      <Button title="Salvar Alterações" style={estilos.Btn} onPress={salvarEdicao} />
      <View style={{ height: 20 }} />
      <Button title="Cancelar" style={estilos.Btn}  onPress={() => router.replace('/vigilantes')} />

      </View>
    </View>
  );
}

const estilos = StyleSheet.create({
  container: {
    padding: 20,
  },
  titulo: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  input: {
    borderBottomWidth: 1,
    marginBottom: 15,
    paddingBottom: 5,
  },
  Btn: {
    backgroundColor: '#007AFF',
    color: '#FFF',
  },
});
