import { useRoute } from '@react-navigation/native';
import { HStack, VStack } from 'native-base';
import React, { useEffect, useState } from 'react';
import { Share } from 'react-native';
import { EmptyMyPoolList } from '../components/EmptyMyPoolList';
import { Guesses } from '../components/Guesses';
import { Header } from '../components/Header';
import { Loading } from '../components/Loading';
import { Option } from '../components/Option';
import { IPoolCardProps } from '../components/PoolCard';
import { PoolHeader } from '../components/PoolHeader';
import api from '../services/api';

interface IRouteParams {
  id: string;
}

export default function Details() {
  const route = useRoute();
  const { id } = route.params as IRouteParams;
  const [isLoading, setIsLoading] = useState(false);
  const [poll, setPoll] = useState<IPoolCardProps>({} as IPoolCardProps);
  const [optionSelected, setOptionSelected] = useState<'guesses' | 'ranking'>(
    'guesses'
  );

  useEffect(() => {
    setIsLoading(true);
    api
      .get(`/polls/${id}`)
      .then(({ data }) => setPoll(data))
      .catch((err) => console.log(err))
      .finally(() => setIsLoading(false));
  }, [id]);

  async function handleCodeShare() {
    await Share.share({ message: poll.code });
  }

  return isLoading ? (
    <Loading />
  ) : (
    <VStack flex={1} bgColor="gray.900">
      <Header
        title="title"
        showBackButton
        showShareButton
        onShare={handleCodeShare}
      />
      {poll._count?.participants > 0 ? (
        <VStack px={5} flex={1}>
          <PoolHeader data={poll} />
          <HStack bgColor="gray.800" p={1} rounded="sm" mb={5}>
            <Option
              title="Seus palpites"
              isSelected={optionSelected === 'guesses'}
              onPress={() => setOptionSelected('guesses')}
            />
            <Option
              title="Ranking do grupo"
              isSelected={optionSelected === 'ranking'}
              onPress={() => setOptionSelected('ranking')}
            />
          </HStack>
          <Guesses poolId={poll.id} code={poll.code} />
        </VStack>
      ) : (
        <EmptyMyPoolList code={poll.code} />
      )}
    </VStack>
  );
}
