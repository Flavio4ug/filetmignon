import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { collection, getDocs, updateDoc, deleteDoc, doc, query, orderBy } from 'firebase/firestore';
import { firestore } from './firebaseConfig';

export default function App() {
    const [notifications, setNotifications] = useState([]);

    const fetchNotifications = async () => {
        const q = query(collection(firestore, 'notifications'), orderBy('createdAt', 'desc'));
        const querySnapshot = await getDocs(q);
        const fetchedNotifications = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
        setNotifications(fetchedNotifications);
    };

    const markAsRead = async (id) => {
        await updateDoc(doc(firestore, 'notifications', id), { read: true });
        fetchNotifications();
    };

    const deleteNotification = async (id) => {
        await deleteDoc(doc(firestore, 'notifications', id));
        fetchNotifications();
    };

    useEffect(() => {
        fetchNotifications();
    }, []);

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Notificações</Text>
            <ScrollView style={styles.scrollView}>
                {notifications.map((notification) => (
                    <View key={notification.id} style={styles.notification}>
                        <Text style={styles.text}>{notification.text}</Text>
                        <Text style={styles.timestamp}>
                            {new Date(notification.createdAt?.toDate()).toLocaleString()}
                        </Text>
                        <View style={styles.actions}>
                            {!notification.read && (
                                <TouchableOpacity onPress={() => markAsRead(notification.id)} style={styles.button}>
                                    <MaterialIcons name="done" size={24} color="white" />
                                    <Text style={styles.buttonText}>Marcar como Lido</Text>
                                </TouchableOpacity>
                            )}
                            <TouchableOpacity onPress={() => deleteNotification(notification.id)} style={styles.button}>
                                <MaterialIcons name="delete" size={24} color="white" />
                                <Text style={styles.buttonText}>Excluir</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                ))}
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 20,
    },
    scrollView: {
        flex: 1,
    },
    notification: {
        padding: 15,
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 5,
        marginBottom: 10,
    },
    text: {
        fontSize: 18,
    },
    timestamp: {
        fontSize: 12,
        color: '#666',
        marginTop: 5,
    },
    actions: {
        flexDirection: 'row',
        marginTop: 10,
    },
    button: {
        backgroundColor: '#4CAF50',
        padding: 10,
        borderRadius: 5,
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: 10,
    },
    buttonText: {
        color: 'white',
        marginLeft: 5,
    },
});
