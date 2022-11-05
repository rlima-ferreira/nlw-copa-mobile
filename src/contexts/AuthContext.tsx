import * as AuthSession from 'expo-auth-session';
import * as Google from 'expo-auth-session/providers/google';
import * as WebBrowser from 'expo-web-browser';
import { createContext, ReactNode, useEffect, useState } from 'react';
import api from '../services/api';

WebBrowser.maybeCompleteAuthSession();

interface IUser {
  name: string;
  avatarUrl: string;
}

interface IContext {
  signed: boolean;
  user: IUser;
  signIn: () => Promise<void>;
  loading: boolean;
}

interface IProps {
  children: ReactNode;
}

export const AuthContext = createContext<IContext>({} as IContext);

export default function AuthProvider(props: IProps) {
  const [user, setUser] = useState<IUser>({} as IUser);
  const [isUserLoading, setIsUserLoading] = useState(false);
  const [request, response, promptAsync] = Google.useAuthRequest({
    clientId:
      '241048281773-cp2usm69u8m1oj8ljjv07rqoqoeu5odo.apps.googleusercontent.com',
    redirectUri: AuthSession.makeRedirectUri({ useProxy: true }),
    scopes: ['profile', 'email'],
  });

  useEffect(() => {
    if (response?.type === 'success' && response.authentication?.accessToken) {
      signInWithGoogle(response.authentication.accessToken);
    }
  }, [response]);

  async function signIn() {
    try {
      setIsUserLoading(true);
      await promptAsync();
    } catch (err) {
      console.log(err);
      throw err;
    } finally {
      setIsUserLoading(false);
    }
  }

  async function signInWithGoogle(access_token: string) {
    try {
      setIsUserLoading(true);
      const { data } = await api.post('/users', { access_token });
      api.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
      const userInfoResponse = await api.get('/me');
      setUser(userInfoResponse.data);
    } catch (err) {
      console.log(err);
      throw err;
    } finally {
      setIsUserLoading(false);
    }
  }

  return (
    <AuthContext.Provider
      value={{ signed: !user, user, signIn, loading: isUserLoading }}
    >
      {props.children}
    </AuthContext.Provider>
  );
}
