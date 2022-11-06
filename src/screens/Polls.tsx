import { Octicons } from '@expo/vector-icons';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { FlatList, Icon, useToast, VStack } from 'native-base';
import React, { useCallback, useState } from 'react';
import { Button } from '../components/Button';
import { EmptyPoolList } from '../components/EmptyPoolList';
import { Header } from '../components/Header';
import { Loading } from '../components/Loading';
import { IPoolCardProps, PoolCard } from '../components/PoolCard';
import api from '../services/api';

export default function Polls() {
  const { navigate } = useNavigation();
  const toast = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [polls, setPolls] = useState<IPoolCardProps[]>([]);

  useFocusEffect(
    useCallback(() => {
      findPolls();
    }, [])
  );

  async function findPolls() {
    try {
      setIsLoading(true);
      const { data } = await api.get('/polls');
      setPolls(data);
    } catch (err) {
      console.log(err);
      toast.show({
        title: err.message,
        placement: 'top',
        bg: 'red.500',
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <VStack flex={1} bgColor="gray.900">
      <Header title="Meus bolões" />
      <VStack
        mt={6}
        mx={5}
        borderBottomWidth={1}
        borderBottomColor="gray.100"
        pb={4}
        mb={4}
      >
        <Button
          title="Buscar bolão por código"
          leftIcon={
            <Icon as={Octicons} name="search" color="black" size="md" />
          }
          onPress={() => navigate('find')}
        />
      </VStack>
      {isLoading ? (
        <Loading />
      ) : (
        <FlatList
          data={polls}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <PoolCard
              data={item}
              onPress={() => navigate('details', { id: item.id })}
            />
          )}
          px={5}
          showsVerticalScrollIndicator={false}
          _contentContainerStyle={{ pb: 10 }}
          ListEmptyComponent={<EmptyPoolList />}
        />
      )}
    </VStack>
  );
}
