import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet, FlatList } from 'react-native';
import axios from 'axios';

// Importa o componente Carregando para exibir um indicador de carregamento
// Este componente pode ser usado para mostrar que os dados estão sendo carregados
import Carregando from '../../utils/carregando';

export default function CadastrarVigilante() {

  // Define os estados para armazenar os dados do usuário, lista de usuários e estado de carregamento
  // Utiliza o hook useState do React para gerenciar os estados
  const [nome, setNome] = useState('');
  const [cpf, setCpf] = useState('');
  const [usuarios, setUsuarios] = useState([]);
  const [enviando, setEnviando] = useState(false);


const cadastrarUsuario = async () => {
  if (!nome || !cpf) {
    Alert.alert('Erro', 'Preencha todos os campos');
    return;
  }

  if (enviando) return; // impede clique duplo

  setEnviando(true); // bloqueia o botão

  try {
    const cpfNumeros = cpf.replace(/\D/g, '');

    if (!/^\d{11}$/.test(cpfNumeros)) {
      Alert.alert('Erro', 'CPF inválido. Deve conter 11 dígitos numéricos.');
      return;
    }

    await axios.post('https://api-jesseguranca.onrender.com/funcionarios', {
      nome,
      cpf: cpfNumeros,
    });

    Alert.alert('Sucesso', 'Usuário cadastrado com sucesso!');

    setUsuarios((prev) => [...prev, { nome, cpf: cpfNumeros }]);
    setNome('');
    setCpf('');
  } catch (_error) {
    Alert.alert('Erro', 'Não foi possível cadastrar o usuário');
  } finally {
    setEnviando(false); // libera o botão
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
    
      <TouchableOpacity
        style={[styles.botao, enviando && { backgroundColor: '#999' }]}
        onPress={cadastrarUsuario}
        disabled={enviando}
      >
        <Text style={styles.botaoTexto}>
          {enviando ? 'Cadastrando...' : 'Cadastrar'}
        </Text>
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