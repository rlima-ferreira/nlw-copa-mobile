import { FlatList, useToast } from 'native-base';
import { useEffect, useState } from 'react';
import api from '../services/api';
import { EmptyMyPoolList } from './EmptyMyPoolList';
import { Game, GameProps } from './Game';
import { Loading } from './Loading';

interface Props {
  poolId: string;
  code: string;
}

export function Guesses({ poolId, code }: Props) {
  const toast = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [games, setGames] = useState<GameProps[]>([]);
  const [firstTeamPoints, setFirstTeamPoints] = useState('');
  const [secondTeamPoints, setSecondTeamPoints] = useState('');

  useEffect(() => {
    findGames();
  }, [poolId]);

  async function findGames() {
    try {
      const { data } = await api.get(`/games/polls/${poolId}`);
      setGames(data);
    } catch (err) {
      console.log(err);
    } finally {
      setIsLoading(false);
    }
  }

  async function handleGuessConfirm(gameId: string) {
    try {
      if (!firstTeamPoints.trim() || !secondTeamPoints.trim()) {
        throw new Error('Informe o placar do palpite');
      }
      await api.post(`/guesses/polls/${poolId}/games/${gameId}`, {
        firstTeamPoints: Number(firstTeamPoints),
        secondTeamPoints: Number(secondTeamPoints),
      });
      toast.show({
        title: 'Palpite realizado com sucesso',
        placement: 'top',
        bgColor: 'green.500',
      });
      findGames();
    } catch (err) {
      console.log(err);
      toast.show({
        title: err.message,
        placement: 'top',
        bgColor: 'red.500',
      });
    }
  }

  return isLoading ? (
    <Loading />
  ) : (
    <FlatList
      data={games}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <Game
          data={item}
          setFirstTeamPoints={setFirstTeamPoints}
          setSecondTeamPoints={setSecondTeamPoints}
          onGuessConfirm={() => handleGuessConfirm(item.id)}
        />
      )}
      _contentContainerStyle={{ pb: 10 }}
      ListEmptyComponent={<EmptyMyPoolList code={code} />}
    />
  );
}
