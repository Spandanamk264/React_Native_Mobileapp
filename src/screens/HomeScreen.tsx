import React, { useState, useCallback, useMemo } from 'react';
import { StyleSheet, Text, View, FlatList, TouchableOpacity, SafeAreaView, ActivityIndicator, StatusBar, Animated } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList, Session } from '../types';
import { StorageService } from '../storage/StorageService';
import { SessionItem } from '../components/SessionItem';
import { InfoModal } from '../components/InfoModal';
import { Info, Plus, TrendingUp, Calendar, BookOpen } from 'lucide-react-native';

type HomeScreenProp = NativeStackNavigationProp<RootStackParamList, 'Home'>;

export const HomeScreen: React.FC = () => {
    const navigation = useNavigation<HomeScreenProp>();

    // -- State --
    const [sessions, setSessions] = useState<Session[]>([]);
    const [loading, setLoading] = useState(true);
    const [infoVisible, setInfoVisible] = useState(false);

    // -- Data Fetching --
    const loadSessions = async () => {
        try {
            const data = await StorageService.getSessions();
            setSessions(data);
        } catch (e) {
            console.error('Failed to load sessions:', e);
        } finally {
            setLoading(false);
        }
    };

    useFocusEffect(
        useCallback(() => {
            loadSessions();
        }, [])
    );

    // -- Derived UI Data --
    const greeting = useMemo(() => {
        const hour = new Date().getHours();
        if (hour < 12) return 'Good Morning,';
        if (hour < 18) return 'Good Afternoon,';
        return 'Good Evening,';
    }, []);

    const stats = useMemo(() => {
        return {
            total: sessions.length,
            lastDate: sessions.length > 0 ? new Date(sessions[0].timestamp).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) : 'N/A'
        };
    }, [sessions]);

    // -- Animations --
    const fadeAnim = React.useRef(new Animated.Value(0)).current;
    const floatAnim = React.useRef(new Animated.Value(0)).current;

    React.useEffect(() => {
        // 1. Initial Fade In
        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 800,
            useNativeDriver: true,
        }).start();

        // 2. Continuous Floating Loop
        Animated.loop(
            Animated.sequence([
                Animated.timing(floatAnim, {
                    toValue: -10, // Slightly more float
                    duration: 2000, // Slower, smoother
                    useNativeDriver: true,
                }),
                Animated.timing(floatAnim, {
                    toValue: 0,
                    duration: 2000,
                    useNativeDriver: true,
                }),
            ])
        ).start();
    }, []);

    // -- Render Helpers --
    const renderEmptyState = () => (
        <View style={styles.emptyContainer}>
            <View style={styles.emptyIconContainer}>
                <Plus size={32} color="#FF6B6B" />
            </View>
            <Text style={styles.emptyTitle}>Start your journey</Text>
            <Text style={styles.emptySubtitle}>Track your baby's first movements.</Text>
        </View>
    );

    const renderHeader = () => (
        <View style={styles.headerContent}>
            {/* 3D Animated Title Section */}
            <View style={styles.titleContainer}>
                <Animated.Text
                    style={[
                        styles.appTitle,
                        {
                            opacity: fadeAnim,
                            transform: [{ translateY: floatAnim }] // Apply floating animation
                        }
                    ]}
                    numberOfLines={1}
                    adjustsFontSizeToFit={true}
                >
                    Daily Fetal Movement Tracker
                </Animated.Text>

                <View style={styles.greetingRow}>
                    <Text style={styles.greetingText}>{greeting} Mumma!</Text>
                    <TouchableOpacity
                        style={styles.infoButton}
                        onPress={() => setInfoVisible(true)}
                        accessibilityLabel="Open Guide"
                    >
                        <Info color="#555" size={24} />
                    </TouchableOpacity>
                </View>
            </View>

            {/* Quick Stats Overview */}
            <View style={styles.statsRow}>
                <View style={styles.statCard}>
                    <View style={[styles.statIcon, { backgroundColor: '#E3F2FD' }]}>
                        <TrendingUp size={20} color="#2196F3" />
                    </View>
                    <View>
                        <Text style={styles.statValue}>{stats.total}</Text>
                        <Text style={styles.statLabel}>Total Sessions</Text>
                    </View>
                </View>

                <View style={styles.statCard}>
                    <View style={[styles.statIcon, { backgroundColor: '#E8F5E9' }]}>
                        <Calendar size={20} color="#4CAF50" />
                    </View>
                    <View>
                        <Text style={styles.statValue}>{stats.lastDate}</Text>
                        <Text style={styles.statLabel}>Last Entry</Text>
                    </View>
                </View>
            </View>

            {/* Styled Tip Card */}
            <View style={styles.tipSection}>
                <Text style={styles.sectionHeader}>Insight</Text>
                <TouchableOpacity style={styles.articleCard} activeOpacity={0.9}>
                    <View style={styles.articleIcon}>
                        <BookOpen size={24} color="#FFF" />
                    </View>
                    <View style={styles.articleContent}>
                        <Text style={styles.articleTag}>TIP OF THE DAY</Text>
                        <Text style={styles.articleTitle}>Understanding your baby's sleep cycles</Text>
                    </View>
                </TouchableOpacity>
            </View>

            <Text style={[styles.sectionHeader, { marginTop: 24, marginBottom: 8 }]}>Recent History</Text>
        </View>
    );

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor="#FAFAFA" />

            <View style={styles.mainContainer}>
                {loading ? (
                    <ActivityIndicator size="large" color="#FF6B6B" style={{ marginTop: 50 }} />
                ) : (
                    <FlatList
                        data={sessions}
                        keyExtractor={(item) => item.id}
                        renderItem={({ item }) => <SessionItem session={item} />}
                        ListHeaderComponent={renderHeader}
                        ListEmptyComponent={renderEmptyState}
                        contentContainerStyle={styles.listContent}
                        showsVerticalScrollIndicator={false}
                    />
                )}
            </View>

            {/* Main Floating Action Button */}
            <TouchableOpacity
                style={styles.fab}
                onPress={() => navigation.navigate('Counter')}
                accessibilityRole="button"
                accessibilityLabel="Start Tracking"
            >
                <Plus color="white" size={32} />
            </TouchableOpacity>

            <InfoModal
                visible={infoVisible}
                onClose={() => setInfoVisible(false)}
            />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#E3F2FD', // Light blue background
    },
    mainContainer: {
        flex: 1,
    },
    listContent: {
        paddingHorizontal: 20,
        paddingBottom: 100,
    },
    headerContent: {
        marginBottom: 16,
        marginTop: 24,
        paddingTop: 8,
    },
    // Title & Header 3D
    titleContainer: {
        marginBottom: 28,
        alignItems: 'center',
        paddingHorizontal: 12,
        backgroundColor: 'rgba(255,255,255,0.7)',
        paddingVertical: 20,
        borderRadius: 24,
        marginHorizontal: 10,
        shadowColor: '#1976D2',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.15,
        shadowRadius: 16,
        elevation: 8,
    },
    appTitle: {
        fontSize: 26,
        fontWeight: '900',
        color: '#0D47A1',
        textAlign: 'center',
        textShadowColor: 'rgba(13, 71, 161, 0.15)',
        textShadowOffset: { width: 2, height: 3 },
        textShadowRadius: 5,
        marginBottom: 20,
        width: '100%',
        paddingHorizontal: 8,
    },
    greetingRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
        paddingHorizontal: 4,
    },
    greetingText: {
        fontSize: 16,
        color: '#1565C0',
        fontWeight: '700',
        letterSpacing: 0.3,
    },
    greetingContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 24,
    },
    greetingSub: {
        fontSize: 14,
        color: '#888',
        fontWeight: '500',
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    greetingTitle: {
        fontSize: 28,
        fontWeight: '800',
        color: '#1a1a1a',
    },
    infoButton: {
        padding: 12,
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        shadowColor: '#1976D2',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.12,
        shadowRadius: 8,
        elevation: 4,
    },
    // Stats
    statsRow: {
        flexDirection: 'row',
        gap: 14,
        marginBottom: 28,
    },
    statCard: {
        flex: 1,
        backgroundColor: 'rgba(255,255,255,0.9)',
        padding: 18,
        borderRadius: 20,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 14,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.5)',
        shadowColor: '#1976D2',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
        elevation: 5,
    },
    statIcon: {
        width: 48,
        height: 48,
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
    },
    statValue: {
        fontSize: 22,
        fontWeight: '900',
        color: '#0D47A1',
    },
    statLabel: {
        fontSize: 12,
        color: '#1976D2',
        fontWeight: '700',
        marginTop: 2,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    // Tip Card
    tipSection: {
        marginBottom: 14,
    },
    sectionHeader: {
        fontSize: 19,
        fontWeight: '900',
        color: '#0D47A1',
        marginBottom: 14,
        letterSpacing: 0.5,
        textTransform: 'uppercase',
    },
    articleCard: {
        backgroundColor: '#1E88E5',
        borderRadius: 24,
        padding: 24,
        flexDirection: 'row',
        alignItems: 'center',
        shadowColor: '#1976D2',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.35,
        shadowRadius: 16,
        elevation: 12,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.3)',
    },
    articleIcon: {
        backgroundColor: 'rgba(255,255,255,0.3)',
        width: 54,
        height: 54,
        borderRadius: 27,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 18,
        borderWidth: 2,
        borderColor: 'rgba(255,255,255,0.4)',
    },
    articleContent: {
        flex: 1,
    },
    articleTag: {
        color: 'rgba(255,255,255,0.95)',
        fontSize: 11,
        fontWeight: '900',
        marginBottom: 6,
        letterSpacing: 1.5,
    },
    articleTitle: {
        color: '#fff',
        fontSize: 17,
        fontWeight: '800',
        lineHeight: 24,
    },
    // Empty State
    emptyContainer: {
        alignItems: 'center',
        marginTop: 60,
        padding: 24,
        backgroundColor: 'rgba(255,255,255,0.7)',
        borderRadius: 24,
        marginHorizontal: 20,
    },
    emptyIconContainer: {
        width: 90,
        height: 90,
        borderRadius: 45,
        backgroundColor: '#BBDEFB',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 20,
    },
    emptyTitle: {
        fontSize: 22,
        fontWeight: '900',
        color: '#0D47A1',
        marginBottom: 10,
    },
    emptySubtitle: {
        fontSize: 15,
        color: '#1976D2',
        textAlign: 'center',
        fontWeight: '600',
    },
    // FAB
    fab: {
        position: 'absolute',
        bottom: 32,
        right: 24,
        width: 68,
        height: 68,
        borderRadius: 34,
        backgroundColor: '#FF6B6B',
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#FF6B6B',
        shadowOffset: { width: 0, height: 12 },
        shadowOpacity: 0.5,
        shadowRadius: 20,
        elevation: 14,
        zIndex: 100,
        borderWidth: 3,
        borderColor: 'rgba(255,255,255,0.9)',
    },
});
