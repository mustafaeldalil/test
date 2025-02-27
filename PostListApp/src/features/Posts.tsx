import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, Pressable, Animated, RefreshControl } from 'react-native';
import { FlashList } from '@shopify/flash-list';
import { useGetPostsQuery } from '../state/apiSlice';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { RootStackParamList } from '../types/types';

const Posts = () => {
  const { data, error, isLoading, refetch } = useGetPostsQuery();
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    refetch().finally(() => setRefreshing(false));
  }, [refetch]);

  if (isLoading) return <Text>Loading...</Text>;
  if (error) {
    return (
      <Text>
        Error: {'message' in error ? error.message : 'An unknown error occurred.'}
      </Text>
    );
  }

  const renderItem = ({ item }: any) => {
    const scaleValue = new Animated.Value(1);

    const handlePressIn = () => {
      Animated.spring(scaleValue, {
        toValue: 0.95,
        useNativeDriver: true,
      }).start();
    };

    const handlePressOut = () => {
      Animated.spring(scaleValue, {
        toValue: 1,
        useNativeDriver: true,
      }).start();
    };

    const handlePress = () => {
      navigation.navigate('PostDetails', { postId: item.id });
    };

    return (
      <Pressable
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        onPress={handlePress}
        style={styles.pressable}
      >
        <Animated.View style={[styles.itemContainer, { transform: [{ scale: scaleValue }] }]}>
          <View style={styles.colorBar} />
          <View style={styles.textContainer}>
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.body}>{item.body}</Text>
          </View>
        </Animated.View>
      </Pressable>
    );
  };

  return (
    <View style={styles.container}>
      <FlashList
        data={data}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        estimatedItemSize={100}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0',
    padding: 10,
  },
  pressable: {
    marginBottom: 15,
  },
  itemContainer: {
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
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
    textShadowColor: 'rgba(0, 0, 0, 0.1)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 1,
  },
  body: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
});

export default Posts;