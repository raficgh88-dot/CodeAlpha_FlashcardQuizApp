# Study Deck — Flashcard Quiz App

A React Native (Expo) flashcard app for studying. Built for the **CodeAlpha App Development Internship — Task 1**.

## Features
- Each flashcard shows a **question** on the front; tapping it flips to reveal the **answer**.
- **Next / Previous** buttons to move through the deck.
- **Add, edit, and delete** flashcards to build your own deck.
- Your deck is **saved automatically** on-device (AsyncStorage), so it's still there next time you open the app.
- Clean, distraction-free UI themed like a study index-card deck.

## Tech stack
- React Native + Expo (managed workflow)
- `@react-native-async-storage/async-storage` for local persistence

## Project structure
```
CodeAlpha_FlashcardQuizApp/
├── App.js                       # Main app: navigation, state, persistence
├── app.json                     # Expo config
├── babel.config.js
├── package.json
└── src/
    ├── components/
    │   ├── FlashcardView.js     # The flip-animated card
    │   └── CardModal.js         # Add/Edit form
    └── data/
        └── initialFlashcards.js # Starter deck (used on first launch only)
```

## Run it locally
1. Install dependencies:
   ```bash
   npm install
   ```
2. Start the Expo dev server:
   ```bash
   npx expo start
   ```
3. Scan the QR code with the **Expo Go** app (iOS/Android), or press `a` / `i` in the terminal to open an Android/iOS emulator, or `w` to run in a browser.

## Submitting this task
1. Create a GitHub repo named `CodeAlpha_FlashcardQuizApp` and push this project to it.
2. Record a short video walking through the app (add/edit/delete a card, navigate, show answer) and post it on LinkedIn tagging **@CodeAlpha**, with the GitHub repo link.
3. Submit through the CodeAlpha submission form shared in your WhatsApp group.
