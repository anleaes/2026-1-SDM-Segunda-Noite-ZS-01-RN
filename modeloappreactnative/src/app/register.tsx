import { Href, useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import { API_URL } from '@/constants/api';

export default function RegisterScreen() {
  const router = useRouter();
  const [tipo, setTipo] = useState<'cliente' | 'administrador'>('cliente');
  const [nome, setNome] = useState('');
  const [cpf, setCpf] = useState('');
  const [email, setEmail] = useState('');
  const [telefone, setTelefone] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [nivelAcesso, setNivelAcesso] = useState('01');
  const [saving, setSaving] = useState(false);

  const handleRegister = async () => {
    if (!nome.trim() || !cpf.trim() || !email.trim() || !senha.trim()) {
      Alert.alert('Atenção', 'Preencha todos os campos obrigatórios.');
      return;
    }

    if (senha !== confirmarSenha) {
      Alert.alert('Atenção', 'As senhas não coincidem.');
      return;
    }

    setSaving(true);
    try {
      const endpoint = tipo === 'administrador'
        ? `${API_URL}/administrador/administrador/`
        : `${API_URL}/clientes/clientes/`;

      const body: any = { nome, cpf, email, telefone, senha };
      if (tipo === 'administrador') {
        body.nivel_acesso = nivelAcesso;
      }

      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      if (res.ok) {
        Alert.alert('Sucesso', `${tipo === 'administrador' ? 'Administrador' : 'Cliente'} cadastrado! Faça login para continuar.`);
        router.replace('/login' as Href);
        return;
      }

      const errorData = await res.json().catch(() => null);
      const message = errorData?.detail || errorData?.email || 'Não foi possível cadastrar.';
      Alert.alert('Erro', Array.isArray(message) ? message.join('\n') : String(message));
    } catch (error) {
      Alert.alert('Erro', 'Sem conexão com o servidor.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <Text style={styles.title}>Cadastro</Text>

      <Text style={styles.label}>Tipo de conta</Text>
      <View style={styles.roleRow}>
        <TouchableOpacity
          style={[styles.roleButton, styles.roleButtonFirst, tipo === 'cliente' && styles.roleButtonActive]}
          onPress={() => setTipo('cliente')}
        >
          <Text style={[styles.roleText, tipo === 'cliente' && styles.roleTextActive]}>Cliente</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.roleButton, tipo === 'administrador' && styles.roleButtonActive]}
          onPress={() => setTipo('administrador')}
        >
          <Text style={[styles.roleText, tipo === 'administrador' && styles.roleTextActive]}>Administrador</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.label}>Nome completo *</Text>
      <TextInput
        value={nome}
        onChangeText={setNome}
        style={styles.input}
        placeholder="Ex: João Silva"
        placeholderTextColor="#555"
      />

      <Text style={styles.label}>CPF *</Text>
      <TextInput
        value={cpf}
        onChangeText={setCpf}
        style={styles.input}
        placeholder="000.000.000-00"
        placeholderTextColor="#555"
        keyboardType="numeric"
      />

      <Text style={styles.label}>E-mail *</Text>
      <TextInput
        value={email}
        onChangeText={setEmail}
        style={styles.input}
        placeholder="seu@exemplo.com"
        placeholderTextColor="#555"
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <Text style={styles.label}>Telefone</Text>
      <TextInput
        value={telefone}
        onChangeText={setTelefone}
        style={styles.input}
        placeholder="(11) 99999-9999"
        placeholderTextColor="#555"
        keyboardType="phone-pad"
      />

      <Text style={styles.label}>Senha *</Text>
      <TextInput
        value={senha}
        onChangeText={setSenha}
        style={styles.input}
        placeholder="Mínimo 6 caracteres"
        placeholderTextColor="#555"
        secureTextEntry
      />

      <Text style={styles.label}>Confirmar senha *</Text>
      <TextInput
        value={confirmarSenha}
        onChangeText={setConfirmarSenha}
        style={styles.input}
        placeholder="Repita a senha"
        placeholderTextColor="#555"
        secureTextEntry
      />

      {tipo === 'administrador' && (
        <>
          <Text style={styles.label}>Nível de acesso *</Text>
          <TextInput
            value={nivelAcesso}
            onChangeText={setNivelAcesso}
            style={styles.input}
            placeholder="Ex: 01"
            placeholderTextColor="#555"
          />
        </>
      )}

      {saving ? (
        <ActivityIndicator size="large" color="#ff2d2d" style={styles.loading} />
      ) : (
        <TouchableOpacity style={styles.button} onPress={handleRegister}>
          <Text style={styles.buttonText}>Cadastrar</Text>
        </TouchableOpacity>
      )}

      <TouchableOpacity style={styles.linkButton} onPress={() => router.push('/login' as Href)}>
        <Text style={styles.linkText}>Já tem conta? Entrar</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f0f0f',
  },
  contentContainer: {
    padding: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#ff2d2d',
    marginBottom: 24,
  },
  label: {
    color: '#fff',
    fontWeight: '600',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#111',
    color: '#fff',
    borderWidth: 1,
    borderColor: '#333',
    borderRadius: 10,
    padding: 14,
    marginBottom: 16,
  },
  button: {
    backgroundColor: '#c40000',
    borderRadius: 10,
    padding: 16,
    alignItems: 'center',
    marginTop: 8,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
  },
  roleRow: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  roleButton: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#333',
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: 'center',
    backgroundColor: '#111',
  },
  roleButtonFirst: {
    marginRight: 8,
  },
  roleButtonActive: {
    backgroundColor: '#c40000',
    borderColor: '#c40000',
  },
  roleText: {
    color: '#fff',
    fontWeight: '600',
  },
  roleTextActive: {
    color: '#fff',
  },
  linkButton: {
    marginTop: 18,
    alignItems: 'center',
  },
  linkText: {
    color: '#ccc',
    fontSize: 15,
  },
  loading: {
    marginTop: 12,
  },
});
