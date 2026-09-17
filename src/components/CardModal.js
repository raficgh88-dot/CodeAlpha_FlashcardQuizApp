import React, { useEffect, useState } from 'react';
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

const COLORS = {
  overlay: 'rgba(16, 24, 32, 0.6)',
  sheet: '#FDF6E9',
  ink: '#1F2A33',
  muted: '#6B7480',
  border: '#E4D6B3',
  teal: '#4C8577',
  gold: '#E0A72E',
};

export default function CardModal({ visible, initialCard, onClose, onSave }) {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');

  useEffect(() => {
    if (visible) {
      setQuestion(initialCard?.question ?? '');
      setAnswer(initialCard?.answer ?? '');
    }
  }, [visible, initialCard]);

  const isEditing = Boolean(initialCard);
  const canSave = question.trim().length > 0 && answer.trim().length > 0;

  const handleSave = () => {
    if (!canSave) return;
    onSave({ question: question.trim(), answer: answer.trim() });
  };

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.overlay}
      >
        <View style={styles.sheet}>
          <Text style={styles.title}>{isEditing ? 'Edit Card' : 'New Card'}</Text>

          <Text style={styles.fieldLabel}>Question</Text>
          <TextInput
            style={styles.input}
            value={question}
            onChangeText={setQuestion}
            placeholder="e.g. What is the capital of France?"
            placeholderTextColor={COLORS.muted}
            multiline
          />

          <Text style={styles.fieldLabel}>Answer</Text>
          <TextInput
            style={styles.input}
            value={answer}
            onChangeText={setAnswer}
            placeholder="e.g. Paris"
            placeholderTextColor={COLORS.muted}
            multiline
          />

          <View style={styles.actions}>
            <Pressable style={[styles.button, styles.cancelButton]} onPress={onClose}>
              <Text style={styles.cancelText}>Cancel</Text>
            </Pressable>
            <Pressable
              style={[styles.button, styles.saveButton, !canSave && styles.saveButtonDisabled]}
              onPress={handleSave}
              disabled={!canSave}
            >
              <Text style={styles.saveText}>{isEditing ? 'Save Changes' : 'Add Card'}</Text>
            </Pressable>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: COLORS.overlay,
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: COLORS.sheet,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    paddingBottom: 36,
  },
  title: {
    fontFamily: 'Georgia',
    fontSize: 20,
    color: COLORS.ink,
    marginBottom: 18,
  },
  fieldLabel: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1,
    color: COLORS.muted,
    marginBottom: 6,
    marginTop: 12,
  },
  input: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 12,
    padding: 12,
    fontSize: 16,
    color: COLORS.ink,
    minHeight: 48,
    backgroundColor: '#FFFFFF',
  },
  actions: {
    flexDirection: 'row',
    marginTop: 24,
    gap: 12,
  },
  button: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  cancelText: {
    color: COLORS.muted,
    fontWeight: '600',
  },
  saveButton: {
    backgroundColor: COLORS.teal,
  },
  saveButtonDisabled: {
    opacity: 0.5,
  },
  saveText: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
});
