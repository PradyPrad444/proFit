import * as React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const GenerateScreen = ({ navigation }) => {
  const [outfits, setOutfits] = React.useState([]);
  const [loading, setLoading] = React.useState(false);

  const generateOutfit = async () => {
    setLoading(true);
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
      console.log('Error generating outfits:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={{ backgroundColor: '#171412', flex: 1 }}>
      <View style={{ padding: 20 }}>
        <TouchableOpacity onPress={generateOutfit}>
          <Text style={{ color: 'white', fontSize: 21 }}>Generate Outfit</Text>
        </TouchableOpacity>

        {loading && (
          <Text style={{ color: '#fff', marginTop: 20 }}>
            Generating outfits...
          </Text>
        )}

        {outfits.length > 0 && (
          <View style={{ marginTop: 50 }}>
            {outfits.map((outfit, index) => (
              <View key={index} style={{ marginBottom: 30 }}>
                <Text
                  style={{ color: '#fff', fontSize: 18, fontWeight: 'bold' }}
                >
                  {outfit.outfit_name}
                </Text>
                <Text style={{ color: '#ccc', marginBottom: 10 }}>
                  {outfit.description}
                </Text>
                <Text style={{ color: '#aaa' }}>
                  Items: {outfit.items.join(', ')}
                </Text>
              </View>
            ))}
          </View>
        )}
      </View>
    </SafeAreaView>
  );
};

export default GenerateScreen;
