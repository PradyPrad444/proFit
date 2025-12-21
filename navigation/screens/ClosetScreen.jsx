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


  return (
    <SafeAreaView style={styles.container}>
    <Text style={{fontSize: 35, color: 'white', alignSelf: 'flex-start', marginLeft: 10, marginBottom: 12, fontWeight: 'bold'}}>Closet</Text>
      <FlatList
        data={wardrobeItems}
        keyExtractor={item => item.item_id}
        numColumns={2} //  2-column grid
        renderItem={({item}) => {
          return (
            <View style = {styles.outerContainer}>
              <View style = {styles.photoContainer} >
                <Image source={{uri: item.url}} style={styles.image} />
              </View>
              
              <View style = {styles.itemTypeContainer}>
                <Text style={{color: 'white', fontSize: 16, fontFamily: 'Geist-Bold'}}>{item.label}</Text>
              </View>
            </View>
          )
        }}
      />
    </SafeAreaView>
  );
};

export default ClosetScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#171412',
    justifyContent: 'center',
    alignItems: 'center'
  },
  outerContainer: {
    height: 220,
    width: 185,
    backgroundColor: "#e0dfdeff",
    marginTop: 10,
    marginBottom: 30,
    marginHorizontal: 10,
    borderRadius: 20,
  },
  photoContainer: {
    marginBottom: 20
  },
  image: {
    height: "100%",
    width: "100%",
  }, 
  itemTypeContainer: {
    marginTop: 10,
    marginHorizontal: 10,
  }
});
