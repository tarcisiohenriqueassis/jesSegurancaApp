import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet, FlatList } from 'react-native';
import axios from 'axios';

export default function CadastrarVigilante() {

  const [nome, setNome] = useState('');
  const [cpf, setCpf] = useState('');
  const [usuarios, setUsuarios] = useState([]);

  const cadastrarUsuario = async () => {
    if (!nome || !cpf) {
      Alert.alert('Erro', 'Preencha todos os campos');
      return;
    }

    try {
      // Remove caracteres não numéricos do CPF
      if (!/^\d{11}$/.test(cpf.replace(/\D/g, ''))) {
        Alert.alert('Erro', 'CPF inválido. Deve conter 11 dígitos numéricos.');
        return;
      }
      // Envia os dados para a API
      // Certifique-se de que a API está configurada para aceitar o formato correto
      // Aqui, estamos enviando o CPF sem formatação, apenas números
      const cpfNumeros = cpf.replace(/\D/g, '');

      await axios.post('https://api-jesseguranca.onrender.com/funcionarios', { nome, cpf: cpfNumeros });
      
      Alert.alert('Sucesso', 'Usuário cadastrado com sucesso!');
      
      setUsuarios((prev) => [...prev, { nome, cpf: cpfNumeros }]);
      setNome('');
      setCpf('');

    } 
    catch (_error) {
      Alert.alert('Erro', 'Não foi possível cadastrar o usuário');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Cadastro de Vigilante</Text>

      <TextInput
        placeholder="Nome"
        style={styles.input}
        value={nome}
        onChangeText={setNome}
      />

      <TextInput
        placeholder="CPF"
        style={styles.input}
        keyboardType="numeric"
        value={cpf}
        onChangeText={setCpf}
      />

      <TouchableOpacity style={styles.botao} onPress={cadastrarUsuario}>
        <Text style={styles.botaoTexto}>Cadastrar</Text>
      </TouchableOpacity>

      <FlatList
        data={usuarios}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <View style={styles.usuario}>
            <Text>Nome: {item.nome}</Text>
            <Text>CPF: {item.cpf}</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  titulo: { fontSize: 22, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
  input: { borderWidth: 1, borderColor: '#ccc', padding: 10, marginBottom: 12, borderRadius: 5 },
  botao: { backgroundColor: '#007AFF', padding: 15, borderRadius: 5, alignItems: 'center' },
  botaoTexto: { color: '#fff', fontWeight: 'bold' },
  usuario: { marginTop: 20, padding: 10, borderWidth: 1, borderColor: '#ddd', borderRadius: 5 },
});