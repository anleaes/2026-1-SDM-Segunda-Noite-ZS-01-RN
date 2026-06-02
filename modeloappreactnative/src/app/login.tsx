import { useRouter } from 'expo-router';
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
import { useAuth } from '@/contexts/AuthContext';

export default function LoginScreen() {
  const router = useRouter();
  const { setUser } = useAuth();
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email.trim() || !senha.trim()) {
      Alert.alert('Atenção', 'Preencha e-mail e senha.');
      return;
    }

    setLoading(true);
    try {
      const formBody = new URLSearchParams({ email: email.trim(), senha }).toString();
      const res = await fetch(`${API_URL}/usuarios/login/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          Accept: 'application/json',
        },
        body: formBody,
        credentials: 'include',
        redirect: 'manual',
      });

      const data = await res.json().catch(() => null);
      if (data?.success) {
        const userData = data.usuario ?? {};
        const rawTipo = String(userData.tipo ?? data.usuario_tipo ?? data.tipo ?? 'cliente').toLowerCase();
        const tipo = rawTipo === 'administrador' ? 'administrador' : 'cliente';

        setUser({
          tipo,
          nome: userData.nome,
          email: userData.email,
          token: data.token,
        });

        const destination = tipo === 'administrador'
          ? '/(drawer)/admin/listar-filmes'
          : '/(drawer)/cliente/listar-filmes';

        Alert.alert('Sucesso', 'Login realizado.');
        router.replace(destination);
        return;
      }

      const errorMessage = data?.detail || 'E-mail ou senha incorretos.';
      Alert.alert('Erro', errorMessage);
    } catch (error) {
      Alert.alert('Erro', 'Sem conexão com o servidor.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <Text style={styles.title}>Entrar</Text>

      <Text style={styles.label}>E-mail</Text>
      <TextInput
        value={email}
        onChangeText={setEmail}
        style={styles.input}
        placeholder="seu@exemplo.com"
        placeholderTextColor="#555"
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <Text style={styles.label}>Senha</Text>
      <TextInput
        value={senha}
        onChangeText={setSenha}
        style={styles.input}
        placeholder="••••••••"
        placeholderTextColor="#555"
        secureTextEntry
      />

      {loading ? (
        <ActivityIndicator size="large" color="#ff2d2d" style={styles.loading} />
      ) : (
        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>Entrar</Text>
        </TouchableOpacity>
      )}

      <TouchableOpacity style={styles.linkButton} onPress={() => router.push('/register')}>
        <Text style={styles.linkText}>Não tem conta? Cadastre-se</Text>
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
