import * as React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const GenerateScreen = ({ navigation }) => {
  const [outfits, setOutfits] = React.useState([]);
  const [isLoading, setIsLoading] = React.useState(false);

  const generateOutfit = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(
        'http://192.168.1.212:8000/generate_outfits',
        {
          method: 'POST',
        },
      );

      const json = await response.json();
      setOutfits(json);
    } catch (err) {
      console.log(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={{ backgroundColor: '#171412' }}>
      <View
        style={{ backgroundColor: '#171412', width: '100%', height: '100%' }}
      >
        <Text
          onPress={() => navigation.navigate('Search')}
          style={{ color: 'white' }}
        >
          This is where you generate outfits!
        </Text>

        <TouchableOpacity>
          <Text
            style={{ color: 'white', marginTop: 100, fontSize: 21 }}
            onPress={generateOutfit}
          >
            Generate Outfit
          </Text>
        </TouchableOpacity>

        {isLoading && (
          <Text style={{ color: '#fff', marginTop: 20 }}>
            Generating outfits...
          </Text>
        )}

        {/* need to check if its working or not */}
      </View>
    </SafeAreaView>
  );
};

export default GenerateScreen;
