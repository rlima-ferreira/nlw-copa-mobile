import { NavigationContainer } from '@react-navigation/native';
import { Box } from 'native-base';
import React from 'react';
import AppRoutes from './app.routes';

export default function Routes() {
  return (
    <Box flex={1} bg="gray.900">
      <NavigationContainer>
        <AppRoutes />
      </NavigationContainer>
    </Box>
  );
}
