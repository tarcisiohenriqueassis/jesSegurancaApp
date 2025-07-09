import { useLocalSearchParams, useRouter } from 'expo-router';
import { View, Text, TextInput, Button, Alert, StyleSheet } from 'react-native';
import React, { useState } from 'react';
import axios from 'axios';

export default function EditarFuncionario() {
  // Recebe os parâmetros da rota
  const { id, nome, cpf } = useLocalSearchParams();

  // Estados para armazenar os novos valores do formulário
  const [novoNome, setNovoNome] = useState(nome);
  const [novoCpf, setNovoCpf] = useState(cpf);
  const router = useRouter();

  // Função chamada ao pressionar o botão de salvar
  const salvarEdicao = async () => {
    try {
      const dadosAtualizados = {};

      // Adiciona apenas os campos modificados
      if (novoNome) dadosAtualizados.nome = novoNome;
      if (novoCpf) dadosAtualizados.cpf = novoCpf;

      if (Object.keys(dadosAtualizados).length === 0) {
        Alert.alert('Atenção', 'Preencha ao menos um campo para atualizar.');
        return;
      }

      // Requisição PUT para atualizar no backend
      await axios.put(`https://api-jesseguranca.onrender.com/funcionarios/${id}`, dadosAtualizados);

      Alert.alert('Sucesso', 'Funcionário atualizado com sucesso!');
      router.back(); // Volta para a tela anterior
    } catch (_error) {
      Alert.alert('Erro', 'Não foi possível atualizar os dados.');
    }
  };

  return (
    <View style={estilos.container}>
      <Text style={estilos.titulo}>Editar Funcionário</Text>

      {/* Campo Nome */}
      <Text style={estilos.label}>Nome</Text>
      <TextInput
        style={estilos.input}
        placeholder="Nome"
        value={novoNome}
        onChangeText={setNovoNome}
      />

      {/* Campo CPF */}
      <Text style={estilos.label}>CPF</Text>
      <TextInput
        style={estilos.input}
        keyboardType="numeric"
        maxLength={11}
        placeholder="CPF"
        value={novoCpf}
        onChangeText={setNovoCpf}
      />

      {/* Botões */}
      <View style={estilos.botoes}>
        <View style={{ marginBottom: 12 }}>
          <Button title="Salvar Alterações" onPress={salvarEdicao} />
        </View>
        <Button title="Cancelar" color="gray" onPress={() => router.replace('/vigilantes')} />
      </View>
    </View>
  );
}

// Estilos organizados
const estilos = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  titulo: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  label: {
    fontSize: 16,
    marginBottom: 4,
    fontWeight: '600',
  },
  input: {
    borderBottomWidth: 1,
    borderColor: '#ccc',
    marginBottom: 15,
    paddingVertical: 6,
    fontSize: 16,
  },
  botoes: {
    marginTop: 20,
  },
});
