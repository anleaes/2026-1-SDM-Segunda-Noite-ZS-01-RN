import { useFocusEffect, useRouter } from 'expo-router';
import React, { useCallback, useState } from 'react';
import {
  ActivityIndicator, Alert, ScrollView,
  StyleSheet, Text, TextInput, TouchableOpacity,
} from 'react-native';

import { API_URL } from '@/constants/api';

export default function CadastrarUsuarioScreen() {
  const router = useRouter();
  const [nome, setNome] = useState('');
  const [cpf, setCpf] = useState('');
  const [email, setEmail] = useState('');
  const [telefone, setTelefone] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [saving, setSaving] = useState(false);

  useFocusEffect(useCallback(() => {
    setNome(''); setCpf(''); setEmail(''); setTelefone('');
    setSenha(''); setConfirmarSenha('');
  }, []));

  const handleSave = async () => {
    if (!nome.trim() || !cpf.trim() || !email.trim() || !senha.trim()) {
      Alert.alert('Atenção', 'Preencha todos os campos obrigatórios.'); return;
    }
    if (senha !== confirmarSenha) {
      Alert.alert('Atenção', 'As senhas não coincidem.'); return;
    }
    setSaving(true);
    try {
      const res = await fetch(`${API_URL}/clientes/clientes/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nome, cpf, email, senha, telefone }),
      });
      if (res.ok) {
        Alert.alert('Sucesso', 'Usuário cadastrado!');
        router.back();
      } else {
        Alert.alert('Erro', 'Não foi possível cadastrar.');
      }
    } catch {
      Alert.alert('Erro', 'Sem conexão com o servidor.');
    } finally { setSaving(false); }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Cadastrar Usuário</Text>

      <Text style={styles.label}>Nome completo *</Text>
      <TextInput value={nome} onChangeText={setNome} style={styles.input}
        placeholder="Ex: João Silva" placeholderTextColor="#555" />

      <Text style={styles.label}>CPF *</Text>
      <TextInput value={cpf} onChangeText={setCpf} style={styles.input}
        placeholder="Ex: 000.000.000-00" placeholderTextColor="#555"
        keyboardType="numeric" />

      <Text style={styles.label}>E-mail *</Text>
      <TextInput value={email} onChangeText={setEmail} style={styles.input}
        placeholder="Ex: joao@email.com" placeholderTextColor="#555"
        keyboardType="email-address" autoCapitalize="none" />

      <Text style={styles.label}>Telefone</Text>
      <TextInput value={telefone} onChangeText={setTelefone} style={styles.input}
        placeholder="Ex: (11) 99999-9999" placeholderTextColor="#555"
        keyboardType="phone-pad" />

      <Text style={styles.label}>Senha *</Text>
      <TextInput value={senha} onChangeText={setSenha} style={styles.input}
        secureTextEntry placeholder="Mínimo 6 caracteres" placeholderTextColor="#555" />

      <Text style={styles.label}>Confirmar senha *</Text>
      <TextInput value={confirmarSenha} onChangeText={setConfirmarSenha}
        style={styles.input} secureTextEntry
        placeholder="Repita a senha" placeholderTextColor="#555" />

      {saving
        ? <ActivityIndicator size="large" color="#ff2d2d" style={{ marginTop: 20 }} />
        : <TouchableOpacity style={styles.btnSalvar} onPress={handleSave}>
            <Text style={styles.btnTexto}>Cadastrar</Text>
          </TouchableOpacity>
      }
      <TouchableOpacity style={styles.btnVoltar} onPress={() => router.back()}>
        <Text style={[styles.btnTexto, { color: '#ccc' }]}>Voltar</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f0f0f', padding: 16 },
  title: { fontSize: 22, fontWeight: 'bold', color: '#ff2d2d', alignSelf: 'center', marginBottom: 16 },
  label: { fontWeight: '600', marginTop: 12, marginBottom: 4, color: '#fff' },
  input: { borderWidth: 1, borderColor: '#333', borderRadius: 8, padding: 10, color: '#fff', backgroundColor: '#111' },
  btnSalvar: { backgroundColor: '#c40000', padding: 14, borderRadius: 8, marginTop: 20, alignItems: 'center' },
  btnVoltar: { borderWidth: 1, borderColor: '#444', padding: 14, borderRadius: 8, marginTop: 10, alignItems: 'center', backgroundColor: '#2a2a2a' },
  btnTexto: { color: '#fff', fontWeight: '600', fontSize: 16 },
});