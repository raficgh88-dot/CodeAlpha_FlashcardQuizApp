import AsyncStorage from '@react-native-async-storage/async-storage';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import {
  Alert,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import CardModal from './src/components/CardModal';
import FlashcardView from './src/components/FlashcardView';
import { initialFlashcards } from './src/data/initialFlashcards';

const STORAGE_KEY = '@study_deck_cards';

const COLORS = {
  background: '#101820',
  cardFace: '#FDF6E9',
  ink: '#1F2A33',
  paper: '#FDF6E9',
  gold: '#E0A72E',
  teal: '#4C8577',
  brick: '#B9503C',
  muted: '#8B97A3',
};

export default function App() {
  const [cards, setCards] = useState([]);
  const [index, setIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingCard, setEditingCard] = useState(null);

  // Load saved deck on first launch, falling back to the starter deck.
  useEffect(() => {
    (async () => {
      try {
        const saved = await AsyncStorage.getItem(STORAGE_KEY);
        setCards(saved ? JSON.parse(saved) : initialFlashcards);
      } catch (e) {
        setCards(initialFlashcards);
      } finally {
        setLoaded(true);
      }
    })();
  }, []);

  // Persist whenever the deck changes.
  useEffect(() => {
    if (loaded) {
      AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(cards)).catch(() => {});
    }
  }, [cards, loaded]);

  useEffect(() => {
    if (index >= cards.length) {
      setIndex(Math.max(0, cards.length - 1));
    }
  }, [cards, index]);

  const currentCard = cards[index];

  const goNext = () => {
    setShowAnswer(false);
    setIndex((i) => (i + 1) % cards.length);
  };

  const goPrevious = () => {
    setShowAnswer(false);
    setIndex((i) => (i - 1 + cards.length) % cards.length);
  };

  const openAddModal = () => {
    setEditingCard(null);
    setModalVisible(true);
  };

  const openEditModal = () => {
    if (!currentCard) return;
    setEditingCard(currentCard);
    setModalVisible(true);
  };

  const handleSaveCard = ({ question, answer }) => {
    if (editingCard) {
      setCards((prev) =>
        prev.map((c) => (c.id === editingCard.id ? { ...c, question, answer } : c))
      );
    } else {
      const newCard = { id: Date.now().toString(), question, answer };
      setCards((prev) => [...prev, newCard]);
      setIndex(cards.length); // jump to the newly added card
    }
    setShowAnswer(false);
    setModalVisible(false);
  };

  const handleDelete = () => {
    if (!currentCard) return;
    Alert.alert('Delete this card?', 'This cannot be undone.', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => {
          setCards((prev) => prev.filter((c) => c.id !== currentCard.id));
          setShowAnswer(false);
        },
      },
    ]);
  };

  if (!loaded) {
    return (
      <SafeAreaView style={[styles.container, styles.center]}>
        <StatusBar style="light" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      <View style={styles.header}>
        <Text style={styles.title}>Study Deck</Text>
        <Text style={styles.counter}>
          {cards.length === 0 ? '0 / 0' : `${index + 1} / ${cards.length}`}
        </Text>
      </View>

      <View style={styles.body}>
        {currentCard ? (
          <FlashcardView
            card={currentCard}
            showAnswer={showAnswer}
            onToggle={() => setShowAnswer((s) => !s)}
          />
        ) : (
          <View style={styles.emptyState}>
            <Text style={styles.emptyTitle}>No cards yet</Text>
            <Text style={styles.emptyBody}>Tap "Add Card" below to build your deck.</Text>
          </View>
        )}
      </View>

      {currentCard && (
        <View style={styles.cardActions}>
          <Pressable style={styles.smallButton} onPress={openEditModal}>
            <Text style={styles.smallButtonText}>Edit</Text>
          </Pressable>
          <Pressable
            style={[styles.smallButton, styles.deleteButton]}
            onPress={handleDelete}
          >
            <Text style={[styles.smallButtonText, styles.deleteButtonText]}>Delete</Text>
          </Pressable>
        </View>
      )}

      <View style={styles.navRow}>
        <Pressable
          style={[styles.navButton, cards.length < 2 && styles.navButtonDisabled]}
          onPress={goPrevious}
          disabled={cards.length < 2}
        >
          <Text style={styles.navButtonText}>‹ Previous</Text>
        </Pressable>
        <Pressable
          style={[styles.navButton, cards.length < 2 && styles.navButtonDisabled]}
          onPress={goNext}
          disabled={cards.length < 2}
        >
          <Text style={styles.navButtonText}>Next ›</Text>
        </Pressable>
      </View>

      <Pressable style={styles.addButton} onPress={openAddModal}>
        <Text style={styles.addButtonText}>+ Add Card</Text>
      </Pressable>

      <CardModal
        visible={modalVisible}
        initialCard={editingCard}
        onClose={() => setModalVisible(false)}
        onSave={handleSaveCard}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    paddingHorizontal: 20,
  },
  center: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    paddingTop: 12,
    paddingBottom: 20,
  },
  title: {
    fontFamily: 'Georgia',
    fontSize: 26,
    color: COLORS.paper,
  },
  counter: {
    fontSize: 14,
    color: COLORS.gold,
    fontWeight: '600',
  },
  body: {
    flex: 1,
    justifyContent: 'center',
  },
  emptyState: {
    alignItems: 'center',
    padding: 24,
  },
  emptyTitle: {
    fontFamily: 'Georgia',
    fontSize: 20,
    color: COLORS.paper,
    marginBottom: 8,
  },
  emptyBody: {
    color: COLORS.muted,
    textAlign: 'center',
  },
  cardActions: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 12,
    marginTop: 16,
  },
  smallButton: {
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#2A3B4C',
  },
  smallButtonText: {
    color: COLORS.paper,
    fontWeight: '600',
  },
  deleteButton: {
    borderColor: COLORS.brick,
  },
  deleteButtonText: {
    color: COLORS.brick,
  },
  navRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 24,
    gap: 12,
  },
  navButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: COLORS.gold,
    alignItems: 'center',
  },
  navButtonDisabled: {
    opacity: 0.4,
  },
  navButtonText: {
    color: COLORS.background,
    fontWeight: '700',
    fontSize: 15,
  },
  addButton: {
    marginTop: 12,
    marginBottom: 20,
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: COLORS.teal,
    alignItems: 'center',
  },
  addButtonText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 15,
  },
});
