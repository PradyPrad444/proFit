import * as React from 'react';
import {
  View,
  Text,
  Image,
  FlatList,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';

const ClosetScreen = () => {
  const [wardrobeItems, setWardrobeItems] = React.useState([]);
  const [loading, setLoading] = React.useState(true);

  useFocusEffect(
    React.useCallback(() => {
      const fetchWardrobe = async () => {
        try {
          const response = await fetch('http://192.168.1.212:8000/wardrobe');

          const json = await response.json();

          setWardrobeItems(json.items);
        } catch (err) {
          console.log('Error in fetching wardrobe: ', err);
        } finally {
          setLoading(false);
        }
      };

      fetchWardrobe();
    }, []),
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <ActivityIndicator size="large" color="#000" />
        <Text>Loading wardrobe...</Text>
      </SafeAreaView>
    );
  }

  if (wardrobeItems.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={{ color: 'white', fontSize: 18 }}>
          No items in your wardrobe yet.
        </Text>
      </SafeAreaView>
    );
  }

  const renderItem = ({ item }) => (
    <View style={styles.imageWrapper}>
      <Image source={{ uri: item.url }} style={styles.image} />
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={wardrobeItems}
        keyExtractor={item => item.item_id}
        renderItem={renderItem}
        numColumns={2} //  2-column grid
        contentContainerStyle={{ paddingBottom: 50 }}
      />
    </SafeAreaView>
  );
};

export default ClosetScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#171412',
  },
  imageWrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: '#6d6b69ff',
    borderWidth: 2,
    marginHorizontal: '5%',
    marginBottom: '20',
    height: 200,
    width: 100,
    backgroundColor: '#2d2c2bff',
    borderRadius: 18,
  },
  image: {
    height: '500',
    width: '200',
    marginBottom: 90,
  },
});
