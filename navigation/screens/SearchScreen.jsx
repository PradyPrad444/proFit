import * as React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Image,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const SUGGESTIONS = [
  { label: 'Rainy Day', icon: '☔️' },
  { label: 'Office Casual', icon: '💼' },
  { label: 'Date Night', icon: '🍷' },
  { label: 'Gym', icon: '🏋️' },
];

const GenerateScreen = ({ navigation }) => {
  const [outfits, setOutfits] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [prompt, setPrompt] = React.useState('');

  const generateOutfit = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        'http://192.168.1.212:8000/generate_outfits',
        {
          method: 'POST',
          // later: send prompt in body if you update backend
          // headers: { 'Content-Type': 'application/json' },
          // body: JSON.stringify({ prompt }),
        },
      );

      const json = await response.json();
      setOutfits(Array.isArray(json) ? json : []);
    } catch (err) {
      console.log('Error generating outfits:', err);
    } finally {
      setLoading(false);
    }
  };

  const applySuggestion = text => {
    setPrompt(text);
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      {/* HEADER */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Generate Outfit</Text>

        <View style={{ width: 40 }} />
      </View>

      {/* CONTENT */}
      <View style={{ flex: 1 }}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* HERO */}
          <View style={styles.hero}>
            <View style={styles.orbOuter}>
              <View style={styles.orbInner}>
                <Text style={styles.orbIcon}>✨</Text>
              </View>
            </View>

            <Text style={styles.bigTitle}>What are we wearing today?</Text>
            <Text style={styles.subTitle}>
              Tell AI your plans, weather, or mood.
            </Text>
          </View>

          {/* INPUT */}
          <View style={styles.inputWrap}>
            <View style={styles.inputGlow} />
            <View style={styles.textAreaCard}>
              <TextInput
                value={prompt}
                onChangeText={setPrompt}
                returnKeyType="done"
                submitBehavior="blurAndSubmit"
                placeholder={
                  "Try: 'Business casual for a rainy day' or '90s grunge party'"
                }
                placeholderTextColor="#94a3b8"
                multiline
                style={styles.textArea}
              />
            </View>
          </View>

          {/* QUICK SUGGESTIONS */}
          <View style={styles.suggestionsSection}>
            <Text style={styles.suggestionsLabel}>Quick Suggestions</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.chipsRow}
            >
              {SUGGESTIONS.map(s => (
                <TouchableOpacity
                  key={s.label}
                  style={styles.chip}
                  activeOpacity={0.8}
                  onPress={() => applySuggestion(s.label)}
                >
                  <Text style={styles.chipIcon}>{s.icon}</Text>
                  <Text style={styles.chipText}>{s.label}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          {/* RESULTS */}
          {!loading && outfits.length > 0 && (
            <View style={{ marginTop: 10 }}>
              {outfits.map((outfit, index) => (
                <View key={index} style={styles.outfitCard}>
                  {/* <Text style={styles.outfitName}>{outfit.outfit_name}</Text>
                  <Text style={styles.outfitDesc}>{outfit.description}</Text> */}

                  {/* ITEMS */}
                  <View style={styles.itemsRow}>
                    {outfit.image_urls?.map((url, i) => (
                      <View key={i} style={styles.itemCard}>
                        <Image source={{ uri: url }} style={styles.itemImage} />
                        <Text style={styles.itemLabel}>
                          {outfit.item_labels?.[i]}
                        </Text>
                      </View>
                    ))}
                  </View>
                </View>
              ))}
            </View>
          )}

          {/* Spacer so content isn't hidden behind bottom button */}
          <View style={{ height: 120 }} />
        </ScrollView>

        {/* STICKY BOTTOM BUTTON */}
        <View style={styles.bottomDock}>
          <TouchableOpacity
            style={[styles.primaryBtn, loading && { opacity: 0.7 }]}
            onPress={generateOutfit}
            activeOpacity={0.85}
            disabled={loading}
          >
            <Text style={styles.primaryBtnText}>Generate Outfit</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default GenerateScreen;

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#171412', // background-dark
  },

  header: {
    height: 56,
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(25,16,34,0.90)',
  },
  headerBtn: {
    width: 40,
    height: 40,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerIcon: {
    fontSize: 26,
    color: 'white',
    marginTop: -2,
  },
  headerTitle: {
    color: 'white',
    fontSize: 35,
    fontWeight: '700',
    letterSpacing: -0.2,
  },

  scrollContent: {
    paddingBottom: 0,
  },

  hero: {
    alignItems: 'center',
    paddingTop: 28,
    paddingBottom: 18,
    paddingHorizontal: 22,
  },
  orbOuter: {
    width: 96,
    height: 96,
    borderRadius: 48,
    borderWidth: 1,
    borderColor: 'rgba(127,19,236,0.25)',
    backgroundColor: 'rgba(127,19,236,0.08)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  orbInner: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(127,19,236,0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  orbIcon: {
    fontSize: 30,
    color: '#7f13ec',
  },
  bigTitle: {
    color: 'white',
    fontSize: 30,
    fontWeight: '800',
    textAlign: 'center',
    letterSpacing: -0.4,
    marginBottom: 6,
  },
  subTitle: {
    color: '#a3a3a3',
    fontSize: 15,
    fontWeight: '500',
    textAlign: 'center',
    maxWidth: 320,
  },

  inputWrap: {
    paddingHorizontal: 16,
    paddingTop: 10,
  },
  inputGlow: {
    position: 'absolute',
    left: 10,
    right: 10,
    top: 6,
    height: 180,
    borderRadius: 18,
    backgroundColor: 'rgba(127,19,236,0.20)',
    opacity: 0.25,
  },
  textAreaCard: {
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.10)',
    backgroundColor: '#231b2e', // surface-dark
    padding: 14,
    minHeight: 160,
  },
  textArea: {
    color: 'white',
    fontSize: 16,
    paddingRight: 30,
    minHeight: 130,
    textAlignVertical: 'top',
  },
  micBadge: {
    position: 'absolute',
    right: 12,
    bottom: 12,
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    opacity: 0.85,
  },
  micIcon: { fontSize: 16 },

  suggestionsSection: {
    paddingHorizontal: 16,
    paddingTop: 18,
  },
  suggestionsLabel: {
    color: '#a3a3a3',
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 10,
  },
  chipsRow: {
    paddingBottom: 6,
    gap: 10,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 999,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
    backgroundColor: '#231b2e',
    paddingHorizontal: 14,
    paddingVertical: 10,
    gap: 8,
  },
  chipIcon: { fontSize: 16 },
  chipText: {
    color: '#d1d5db',
    fontSize: 13,
    fontWeight: '600',
  },

  loadingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingTop: 14,
  },
  loadingText: {
    color: '#d1d5db',
    fontSize: 14,
    fontWeight: '600',
  },

  outfitCard: {
    marginTop: 12,
    padding: 14,
    borderRadius: 16,
    backgroundColor: '#231b2e',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.10)',
  },
  outfitName: {
    color: 'white',
    fontSize: 16,
    fontWeight: '800',
    marginBottom: 6,
  },
  outfitDesc: {
    color: '#cbd5e1',
    fontSize: 13,
    marginBottom: 8,
  },
  outfitItems: {
    color: '#94a3b8',
    fontSize: 12,
  },

  bottomDock: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 22,
    backgroundColor: 'rgba(25,16,34,0.96)',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.06)',
  },
  primaryBtn: {
    height: 56,
    borderRadius: 14,
    backgroundColor: '#7f13ec',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  primaryBtnIcon: {
    fontSize: 18,
    color: 'white',
  },
  primaryBtnText: {
    color: 'white',
    fontSize: 22,
    fontWeight: '600',
  },
  itemsRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 12,
    flexWrap: 'wrap',
  },

  itemCard: {
    width: 120,
    backgroundColor: '#2a2235',
    borderRadius: 14,
    padding: 8,
    alignItems: 'center',
  },

  itemImage: {
    width: '100%',
    height: 120,
    resizeMode: 'contain',
    borderRadius: 10,
  },

  itemLabel: {
    marginTop: 6,
    fontSize: 12,
    color: '#d1d5db',
    fontWeight: '600',
    textAlign: 'center',
  },
});
