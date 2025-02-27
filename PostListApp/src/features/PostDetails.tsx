import React from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator } from 'react-native';
import { useRoute, RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../types/types';
import { useGetPostCommentsQuery } from '../state/apiSlice';


const PostDetails = () => {
    const route = useRoute<RouteProp<RootStackParamList, 'PostDetails'>>();
    const { postId } = route.params as { postId: number };
    const { data: comments, error, isLoading } = useGetPostCommentsQuery(postId);

    if (isLoading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator testID={'loading-indicator'} size="large" color="#0000ff" />
            </View>
        );
    }

    if (error) {
        return (
            <Text style={styles.errorText}>
                Error: {'message' in error ? error.message : 'An unknown error occurred.'}
            </Text>
        );
    }

    const renderComment = ({ item }: any) => (
        <View style={styles.commentContainer}>
            <View style={styles.colorBar} />
            <View style={styles.textContainer}>
                <Text style={styles.commentName}>{item.name}</Text>
                <Text style={styles.commentBody}>{item.body}</Text>
            </View>
        </View>
    );

    return (
        <View style={styles.container}>
            {comments && comments.length > 0 && <Text style={styles.title}>Comments</Text>}
            {comments && comments.length > 0 ? (
                <FlatList
                    data={comments}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={renderComment}
                />
            ) : (
                <View style={styles.zeroStateContainer}>
                    <Text style={styles.zeroStateText}>There aren't any comments at the moment.</Text>
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f0f0f0',
        padding: 10,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 15,
        textAlign: 'center',
        textShadowColor: 'rgba(0, 0, 0, 0.1)',
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 1,
    },
    commentContainer: {
        borderRadius: 15,
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 5 },
        shadowOpacity: 0.3,
        shadowRadius: 10,
        elevation: 5,
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#ddd',
        marginBottom: 15,
    },
    colorBar: {
        height: 5,
        backgroundColor: '#ff6f61',
        borderTopLeftRadius: 15,
        borderTopRightRadius: 15,
    },
    textContainer: {
        padding: 15,
        backgroundColor: '#fff',
    },
    commentName: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 5,
        textShadowColor: 'rgba(0, 0, 0, 0.1)',
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 1,
    },
    commentBody: {
        fontSize: 14,
        color: '#666',
        lineHeight: 20,
    },
    zeroStateContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    zeroStateText: {
        fontSize: 16,
        color: '#888',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    errorText: {
        fontSize: 16,
        color: 'red',
        textAlign: 'center',
        marginTop: 20,
    },
});

export default PostDetails;