import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Clock, Calendar } from 'lucide-react-native';
import { Session } from '../types';
import { formatDuration, formatSessionDate } from '../utils/timeUtils';

interface SessionItemProps {
    session: Session;
}

export const SessionItem: React.FC<SessionItemProps> = ({ session }) => {
    return (
        <View style={styles.card}>
            <View style={styles.header}>
                <View style={styles.dateContainer}>
                    <Calendar size={16} color="#666" style={styles.icon} />
                    <Text style={styles.dateText}>{formatSessionDate(session.timestamp)}</Text>
                </View>
            </View>

            <View style={styles.divider} />

            <View style={styles.statsContainer}>
                <View style={styles.statItem}>
                    <Text style={styles.statLabel}>Duration</Text>
                    <View style={styles.statValueContainer}>
                        <Clock size={16} color="#FF6B6B" style={styles.icon} />
                        <Text style={styles.statValue}>{formatDuration(session.durationInSeconds)} min</Text>
                    </View>
                </View>

                <View style={styles.statItem}>
                    <Text style={styles.statLabel}>Kicks</Text>
                    <Text style={styles.statValue}>{session.kickCount}</Text>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    card: {
        backgroundColor: 'white',
        borderRadius: 16,
        padding: 16,
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
        borderWidth: 1,
        borderColor: '#f0f0f0',
    },
    header: {
        marginBottom: 12,
    },
    dateContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    dateText: {
        fontSize: 14,
        color: '#666',
        fontWeight: '500',
        marginLeft: 6,
    },
    divider: {
        height: 1,
        backgroundColor: '#f0f0f0',
        marginBottom: 12,
    },
    statsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    statItem: {
        flex: 1,
    },
    statLabel: {
        fontSize: 12,
        color: '#999',
        marginBottom: 4,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    statValueContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    statValue: {
        fontSize: 18,
        fontWeight: '700',
        color: '#333',
        marginLeft: 0,
    },
    icon: {
        marginRight: 6,
    },
});
