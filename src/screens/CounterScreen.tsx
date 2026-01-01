import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Alert, SafeAreaView, Animated, ScrollView, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList, Session } from '../types';
import { StorageService } from '../storage/StorageService';
import { formatDuration } from '../utils/timeUtils';
import { Footprints, CheckCircle, X } from 'lucide-react-native';
import Svg, { Circle } from 'react-native-svg';

type CounterScreenProp = NativeStackNavigationProp<RootStackParamList, 'Counter'>;

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

export const CounterScreen: React.FC = () => {
    const navigation = useNavigation<CounterScreenProp>();

    // -- State Management --
    const [seconds, setSeconds] = useState(0);
    const [isActive, setIsActive] = useState(false);
    const [kicks, setKicks] = useState(0);
    const [isCompleted, setIsCompleted] = useState(false);

    // -- Animation Values --
    const kickScale = useRef(new Animated.Value(1)).current;
    const progressAnim = useRef(new Animated.Value(0)).current;
    const pulseAnim = useRef(new Animated.Value(1)).current;
    const intervalRef = useRef<NodeJS.Timeout | null>(null);

    // -- Constants for Progress Circle --
    const CIRCLE_RADIUS = 100;
    const CIRCLE_CIRCUMFERENCE = 2 * Math.PI * CIRCLE_RADIUS;

    // -- Timer Logic --
    useEffect(() => {
        startTimer();
        return () => stopTimer();
    }, []);

    // Animate progress when kicks change
    useEffect(() => {
        const progress = kicks / 10;
        Animated.spring(progressAnim, {
            toValue: progress,
            useNativeDriver: true,
            friction: 8,
            tension: 40,
        }).start();
    }, [kicks]);

    // Pulse animation for active tracking
    useEffect(() => {
        if (isActive && !isCompleted) {
            const pulseAnimation = Animated.loop(
                Animated.sequence([
                    Animated.timing(pulseAnim, {
                        toValue: 1.05,
                        duration: 1000,
                        useNativeDriver: true,
                    }),
                    Animated.timing(pulseAnim, {
                        toValue: 1,
                        duration: 1000,
                        useNativeDriver: true,
                    }),
                ])
            );
            pulseAnimation.start();
            return () => pulseAnimation.stop();
        }
    }, [isActive, isCompleted]);

    const startTimer = () => {
        setIsActive(true);
        intervalRef.current = setInterval(() => {
            setSeconds(prev => prev + 1);
        }, 1000);
    };

    const stopTimer = () => {
        setIsActive(false);
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
        }
    };

    // -- Interaction Handlers --
    const handleKick = () => {
        if (isCompleted) return;

        // Animate button press
        Animated.sequence([
            Animated.spring(kickScale, {
                toValue: 0.92,
                useNativeDriver: true,
                friction: 4,
            }),
            Animated.spring(kickScale, {
                toValue: 1,
                useNativeDriver: true,
                friction: 4,
            }),
        ]).start();

        const newKicks = kicks + 1;
        setKicks(newKicks);

        if (newKicks >= 10) {
            stopTimer();
            setIsCompleted(true);
        }
    };

    const handleManualStop = () => {
        stopTimer();
        setIsCompleted(true);
    };

    const handleSave = async () => {
        try {
            const newSession: Session = {
                id: Date.now().toString(),
                timestamp: new Date().toISOString(),
                durationInSeconds: seconds,
                kickCount: kicks,
            };

            await StorageService.saveSession(newSession);
            navigation.goBack();
        } catch (error) {
            Alert.alert('Error', 'Failed to save session. Please try again.');
        }
    };

    const handleDiscard = () => {
        // If the user hasn't really started (0 kicks), just go back.
        // If completed, let them discard if they really want to.
        if (kicks > 0 && !isCompleted) {
            Alert.alert(
                "Discard Session?",
                "You have tracking in progress. Are you sure you want to discard?",
                [
                    { text: "Cancel", style: "cancel" },
                    {
                        text: "Discard",
                        style: "destructive",
                        onPress: () => navigation.goBack()
                    }
                ]
            );
        } else {
            navigation.goBack();
        }
    };

    // Calculate stroke dash offset for progress circle
    const strokeDashoffset = progressAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [CIRCLE_CIRCUMFERENCE, 0],
    });

    return (
        <SafeAreaView style={styles.container}>
            {/* Gradient Background Effect */}
            <View style={styles.gradientTop} />

            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity
                    onPress={handleDiscard}
                    style={styles.backButton}
                    hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
                >
                    <X size={24} color="#666" />
                </TouchableOpacity>
                <Text style={styles.title}>Fetal Movement Tracking</Text>
                <View style={{ width: 40 }} />
            </View>

            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                {/* Timer Display with Enhanced Typography */}
                <View style={styles.timerContainer}>
                    <Text style={styles.timerLabel}>TIME ELAPSED</Text>
                    <Text style={styles.timerText}>{formatDuration(seconds)}</Text>
                </View>

                {/* Advanced Circular Progress Indicator */}
                <Animated.View style={[styles.kickCounterContainer, { transform: [{ scale: pulseAnim }] }]}>
                    <View style={styles.progressCircleContainer}>
                        {/* Background Circle */}
                        {/* Background Circle & Progress - Commented out for debugging
                        <Svg width={CIRCLE_RADIUS * 2 + 30} height={CIRCLE_RADIUS * 2 + 30}>
                             ...
                        </Svg>
                        */}<View style={{ height: 260, justifyContent: 'center' }}><Text>Loading Chart...</Text></View>

                        {/* Center Content */}
                        <View style={styles.centerContent}>
                            {isCompleted ? (
                                <CheckCircle size={52} color="#4CAF50" />
                            ) : (
                                <Footprints size={52} color="#1E88E5" />
                            )}
                            <Text style={styles.kickCount}>{kicks}</Text>
                            <Text style={styles.kickLabel}>of 10 kicks</Text>
                            <View style={styles.progressBar}>
                                <View style={[styles.progressFill, { width: `${Math.min((kicks / 10) * 100, 100)}%` }]} />
                            </View>
                        </View>
                    </View>
                </Animated.View>

                {!isCompleted ? (
                    <View style={styles.buttonContainer} key={`buttons-${kicks}`}>
                        <Animated.View style={{ transform: [{ scale: kickScale }], width: '100%', alignItems: 'center' }}>
                            <TouchableOpacity
                                style={styles.kickButton}
                                onPress={handleKick}
                                activeOpacity={0.85}
                            >
                                <View style={styles.kickButtonContent}>
                                    <Footprints size={28} color="white" />
                                    <Text style={styles.kickButtonText}>RECORD KICK</Text>
                                </View>
                            </TouchableOpacity>
                        </Animated.View>

                        {/* Stop & Save Button - Allows saving early */}
                        {kicks > 0 && (
                            <TouchableOpacity
                                style={styles.stopButton}
                                onPress={handleManualStop}
                                activeOpacity={0.8}
                            >
                                <Text style={styles.stopButtonText}>Stop & Save</Text>
                            </TouchableOpacity>
                        )}
                    </View>
                ) : (
                    <View style={styles.actionButtons}>
                        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
                            <CheckCircle size={22} color="white" />
                            <Text style={styles.saveButtonText}>Save Session</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.discardButton} onPress={handleDiscard}>
                            <Text style={styles.discardButtonText}>Discard</Text>
                        </TouchableOpacity>
                    </View>
                )}
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#E3F2FD', // Light blue background
    },
    gradientTop: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: 350,
        backgroundColor: '#BBDEFB',
        opacity: 0.5,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 12, // Reduced from 18
        borderBottomWidth: 1,
        borderBottomColor: '#BBDEFB',
        backgroundColor: 'rgba(255,255,255,0.85)',
        zIndex: 10,
    },
    title: {
        fontSize: 18, // Reduced from 19
        fontWeight: '800',
        color: '#0D47A1',
        letterSpacing: 0.5,
    },
    backButton: {
        padding: 8, // Reduced from 10
        borderRadius: 12,
        backgroundColor: 'rgba(255,255,255,0.9)',
        borderWidth: 1,
        borderColor: '#BBDEFB',
    },
    backButtonText: {
        fontSize: 16,
        color: '#1976D2',
        fontWeight: '700',
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        alignItems: 'center',
        paddingVertical: 15, // Reduced from 30
        paddingHorizontal: 20,
        minHeight: '100%',
        justifyContent: 'space-between', // Ensures content is spread out but scrolls if needed
    },
    timerContainer: {
        alignItems: 'center',
        marginTop: 5, // Reduced from 10
        backgroundColor: 'rgba(255,255,255,0.6)',
        paddingHorizontal: 30, // Reduced from 40
        paddingVertical: 10, // Reduced from 16
        borderRadius: 20,
        marginBottom: 10, // Reduced from 20
    },
    timerLabel: {
        fontSize: 11, // Reduced from 12
        color: '#1976D2',
        fontWeight: '800',
        letterSpacing: 2,
        marginBottom: 4,
    },
    timerText: {
        fontSize: 48, // Reduced from 56
        fontWeight: '300',
        color: '#0D47A1',
        fontVariant: ['tabular-nums'],
        letterSpacing: 2,
    },
    kickCounterContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        marginVertical: 10, // Reduced from 20
    },
    progressCircleContainer: {
        position: 'relative',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(255,255,255,0.5)',
        borderRadius: 150,
        padding: 10, // Reduced from 15
    },
    centerContent: {
        position: 'absolute',
        alignItems: 'center',
        justifyContent: 'center',
    },
    kickCount: {
        fontSize: 60, // Reduced from 68
        fontWeight: '900',
        color: '#0D47A1',
        marginTop: 8,
        marginBottom: 2,
    },
    kickLabel: {
        fontSize: 13, // Reduced from 15
        color: '#1976D2',
        fontWeight: '700',
        marginBottom: 10,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    progressBar: {
        width: 80, // Reduced from 100
        height: 5,
        backgroundColor: '#E3F2FD',
        borderRadius: 3,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: '#BBDEFB',
    },
    progressFill: {
        height: '100%',
        backgroundColor: '#1E88E5',
        borderRadius: 2,
    },
    buttonContainer: {
        width: '100%',
        alignItems: 'center',
        gap: 10, // Reduced from 14
        paddingBottom: 20, // Extra padding at bottom for scroll
    },
    kickButton: {
        backgroundColor: '#FF6B6B',
        width: '90%', // Increased width slightly
        paddingVertical: 18, // Reduced from 22
        borderRadius: 30,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#FF6B6B',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.4,
        shadowRadius: 14,
        elevation: 10,
        borderWidth: 3,
        borderColor: 'rgba(255,255,255,0.9)',
    },
    kickButtonContent: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    kickButtonText: {
        color: 'white',
        fontSize: 19, // Reduced from 20
        fontWeight: '900',
        letterSpacing: 1.2,
    },
    stopButton: {
        backgroundColor: 'rgba(255,255,255,0.95)',
        width: '90%',
        paddingVertical: 15, // Reduced from 18
        borderRadius: 26,
        alignItems: 'center',
        borderWidth: 2.5, // Reduced from 3
        borderColor: '#4CAF50',
        shadowColor: '#4CAF50',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.25,
        shadowRadius: 8,
        elevation: 5,
    },
    stopButtonText: {
        color: '#4CAF50',
        fontSize: 16,
        fontWeight: '800',
        letterSpacing: 0.5,
    },
    stopButtonDisabled: {
        opacity: 0.4,
        borderColor: '#BBDEFB',
    },
    stopButtonTextDisabled: {
        color: '#90CAF9',
    },
    actionButtons: {
        width: '100%',
        paddingHorizontal: 20,
        gap: 10,
        marginTop: 10,
        paddingBottom: 20,
    },
    saveButton: {
        flexDirection: 'row',
        backgroundColor: '#4CAF50',
        width: '100%',
        paddingVertical: 18, // Reduced from 22
        borderRadius: 22,
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        shadowColor: '#4CAF50',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.4,
        shadowRadius: 10,
        elevation: 8,
        borderWidth: 3,
        borderColor: 'rgba(255,255,255,0.8)',
    },
    saveButtonText: {
        color: 'white',
        fontSize: 18,
        fontWeight: '900',
        letterSpacing: 0.8,
    },
    discardButton: {
        backgroundColor: 'rgba(255,255,255,0.9)',
        width: '100%',
        paddingVertical: 15, // Reduced from 18
        borderRadius: 18,
        alignItems: 'center',
        borderWidth: 2,
        borderColor: '#BBDEFB',
        shadowColor: '#1976D2',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 4,
        elevation: 2,
    },
    discardButtonText: {
        color: '#1976D2',
        fontSize: 16, // Reduced from 17
        fontWeight: '700',
    },
});
