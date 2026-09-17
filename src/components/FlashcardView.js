import React, { useEffect, useRef } from 'react';
import { Animated, Pressable, StyleSheet, Text, View } from 'react-native';

const COLORS = {
  cardFace: '#FDF6E9',
  cardBorder: '#E4D6B3',
  ink: '#1F2A33',
  muted: '#6B7480',
  gold: '#E0A72E',
};

export default function FlashcardView({ card, showAnswer, onToggle }) {
  const flip = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.spring(flip, {
      toValue: showAnswer ? 180 : 0,
      friction: 8,
      tension: 10,
      useNativeDriver: true,
    }).start();
  }, [showAnswer]);

  const frontInterpolate = flip.interpolate({
    inputRange: [0, 180],
    outputRange: ['0deg', '180deg'],
  });
  const backInterpolate = flip.interpolate({
    inputRange: [0, 180],
    outputRange: ['180deg', '360deg'],
  });

  const frontOpacity = flip.interpolate({
    inputRange: [89, 90],
    outputRange: [1, 0],
  });
  const backOpacity = flip.interpolate({
    inputRange: [89, 90],
    outputRange: [0, 1],
  });

  return (
    <Pressable onPress={onToggle} style={styles.wrapper}>
      <Animated.View
        style={[
          styles.face,
          styles.front,
          {
            opacity: frontOpacity,
            transform: [{ perspective: 1200 }, { rotateY: frontInterpolate }],
          },
        ]}
      >
        <Text style={styles.label}>QUESTION</Text>
        <Text style={styles.question}>{card.question}</Text>
        <Text style={styles.hint}>Tap the card to reveal the answer</Text>
      </Animated.View>

      <Animated.View
        style={[
          styles.face,
          styles.back,
          {
            opacity: backOpacity,
            transform: [{ perspective: 1200 }, { rotateY: backInterpolate }],
          },
        ]}
      >
        <Text style={[styles.label, { color: COLORS.gold }]}>ANSWER</Text>
        <Text style={styles.answer}>{card.answer}</Text>
        <Text style={styles.hint}>Tap the card to flip back</Text>
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    width: '100%',
    height: 280,
  },
  face: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    backgroundColor: COLORS.cardFace,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    padding: 28,
    justifyContent: 'center',
    alignItems: 'center',
    backfaceVisibility: 'hidden',
    shadowColor: '#000',
    shadowOpacity: 0.18,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 8 },
    elevation: 6,
  },
  front: {},
  back: {},
  label: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1.5,
    color: COLORS.muted,
    marginBottom: 16,
  },
  question: {
    fontFamily: 'Georgia',
    fontSize: 22,
    lineHeight: 30,
    color: COLORS.ink,
    textAlign: 'center',
  },
  answer: {
    fontFamily: 'Georgia',
    fontSize: 22,
    lineHeight: 30,
    color: COLORS.ink,
    textAlign: 'center',
  },
  hint: {
    position: 'absolute',
    bottom: 18,
    fontSize: 12,
    color: COLORS.muted,
  },
});
