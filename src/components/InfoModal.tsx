import React from 'react';
import { Modal, StyleSheet, Text, View, TouchableOpacity, ScrollView } from 'react-native';
import { X } from 'lucide-react-native';

interface InfoModalProps {
    visible: boolean;
    onClose: () => void;
}

export const InfoModal: React.FC<InfoModalProps> = ({ visible, onClose }) => {
    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={visible}
            onRequestClose={onClose}
        >
            <View style={styles.overlay}>
                <View style={styles.sheetContainer}>
                    <View style={styles.header}>
                        <Text style={styles.title}>How to Track Movements</Text>
                        <TouchableOpacity onPress={onClose} style={styles.closeButton} accessibilityLabel="Close information">
                            <X color="#333" size={24} />
                        </TouchableOpacity>
                    </View>

                    <ScrollView contentContainerStyle={styles.content}>
                        <Text style={styles.paragraph}>
                            Tracking fetal movements is an important way to monitor your baby's health. Follow these steps:
                        </Text>

                        <View style={styles.bulletPoint}>
                            <Text style={styles.bullet}>•</Text>
                            <Text style={styles.bulletText}>Choose a quiet time when your baby is usually active.</Text>
                        </View>

                        <View style={styles.bulletPoint}>
                            <Text style={styles.bullet}>•</Text>
                            <Text style={styles.bulletText}>Get comfortable. Lie on your side or sit with your feet up.</Text>
                        </View>

                        <View style={styles.bulletPoint}>
                            <Text style={styles.bullet}>•</Text>
                            <Text style={styles.bulletText}>Count any movement (kicks, rolls, flutters). Hiccups don't count.</Text>
                        </View>

                        <View style={styles.bulletPoint}>
                            <Text style={styles.bullet}>•</Text>
                            <Text style={styles.bulletText}>Count until you reach 10 movements.</Text>
                        </View>

                        <View style={styles.bulletPoint}>
                            <Text style={styles.bullet}>•</Text>
                            <Text style={styles.bulletText}>Stop the timer when you reach the 10th kick.</Text>
                        </View>
                    </ScrollView>

                    <TouchableOpacity style={styles.gotItButton} onPress={onClose}>
                        <Text style={styles.buttonText}>Got it</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'flex-end',
    },
    sheetContainer: {
        backgroundColor: 'white',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        padding: 24,
        maxHeight: '80%',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 5,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#1a1a1a',
    },
    closeButton: {
        padding: 4,
    },
    content: {
        paddingBottom: 20,
    },
    paragraph: {
        fontSize: 16,
        color: '#4a4a4a',
        marginBottom: 16,
        lineHeight: 24,
    },
    bulletPoint: {
        flexDirection: 'row',
        marginBottom: 12,
        alignItems: 'flex-start',
    },
    bullet: {
        fontSize: 18,
        color: '#FF6B6B', // Accent color
        marginRight: 10,
        marginTop: -2,
    },
    bulletText: {
        fontSize: 16,
        color: '#4a4a4a',
        flex: 1,
        lineHeight: 22,
    },
    gotItButton: {
        backgroundColor: '#FF6B6B',
        paddingVertical: 16,
        borderRadius: 12,
        alignItems: 'center',
        marginTop: 10,
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: '600',
    },
});
