import { useNavigation } from '@react-navigation/native';
import { Heading, useToast, VStack } from 'native-base';
import React, { useState } from 'react';
import { Button } from '../components/Button';
import { Header } from '../components/Header';
import { Input } from '../components/Input';
import api from '../services/api';

export default function Find() {
  const toast = useToast();
  const { navigate } = useNavigation();
  const [isLoading, setIsLoading] = useState(false);
  const [code, setCode] = useState('');

  async function handleJoinPoll() {
    try {
      setIsLoading(true);
      if (!code.trim()) throw new Error('Informe o código');
      await api.post('/polls/join', { code });
      toast.show({
        title: 'Você entrou para o bolão com sucesso!',
        placement: 'top',
        bgColor: 'green.500',
      });
      navigate('polls');
    } catch (err) {
      console.log(err);
      setIsLoading(false);
      // if (err.response?.data?.message === '') {

      // }
      toast.show({
        title: err.message,
        placement: 'top',
        bgColor: 'red.500',
      });
    }
  }

  return (
    <VStack flex={1} bgColor="gray.900">
      <Header title="Buscar por código" showBackButton />
      <VStack mt={8} mx={5} alignItems="center">
        <Heading
          fontFamily="heading"
          color="white"
          fontSize="xl"
          mb={8}
          textAlign="center"
        >
          Encontrar um bolão através {'\n'} de seu código único
        </Heading>
        <Input
          mb={2}
          placeholder="Qual o código do bolão?"
          autoCapitalize="characters"
          onChangeText={setCode}
        />
        <Button title="Buscar bolão" onPress={handleJoinPoll} />
      </VStack>
    </VStack>
  );
}
