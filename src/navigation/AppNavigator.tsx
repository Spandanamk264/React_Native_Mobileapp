import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { HomeScreen } from '../screens/HomeScreen';
import { CounterScreen } from '../screens/CounterScreen';
import { RootStackParamList } from '../types';

const Stack = createNativeStackNavigator<RootStackParamList>();

export const AppNavigator: React.FC = () => {
    return (
        <NavigationContainer>
            <Stack.Navigator
                initialRouteName="Home"
                screenOptions={{
                    headerShown: false, // We use custom headers in screens
                    contentStyle: { backgroundColor: '#fff' },
                    animation: 'slide_from_right',
                }}
            >
                <Stack.Screen name="Home" component={HomeScreen} />
                <Stack.Screen
                    name="Counter"
                    component={CounterScreen}
                    options={{ gestureEnabled: false }} // Prevent swipe back during timer? Maybe safer to allow with alert handler, but native swipe bypasses handlers often. 'gestureEnabled: false' is safer for timer logic.
                />
            </Stack.Navigator>
        </NavigationContainer>
    );
};
