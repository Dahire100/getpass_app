import AsyncStorage from '@react-native-async-storage/async-storage';

export const cacheData = async (key: string, data: any) => {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(data));
  } catch (e) {
    console.error(`Error caching data for ${key}`, e);
  }
};

export const getCachedData = async (key: string) => {
  try {
    const data = await AsyncStorage.getItem(key);
    return data ? JSON.parse(data) : null;
  } catch (e) {
    console.error(`Error getting cached data for ${key}`, e);
    return null;
  }
};
