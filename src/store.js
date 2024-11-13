import { create } from 'zustand';
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { db } from "./config/firestore";

const initialState = {
  modes: ["Vocabulary", "Practice", "Contribute"],
  selectedMode: 0,
  drawerIsOpen: false,
  words: [],
};

const getVocabulary = async () => {
  const querySnapshot = await getDocs(query(collection(db, "vocabulary"), orderBy('italian')));
  let voc = querySnapshot.docs.map((doc) => ({
    docId: doc.id,
    ...doc.data(),
  }));
  if (voc.length) voc = addArticlesToNouns(voc)
  return voc;
};

const addArticlesToNouns = (voc) => {
  return voc.map(word => {
    // word.date_added = new Date(word.date_added)
    if (!word.part_of_speech.startsWith('noun')) {
      return word;
    }
    if (word.gender === 'female') {
      word.gender = 'femminile';
      if (startsWithVowel(word.italian)) {
        word.italian = "l' " + word.italian;
      }
      else word.italian = "la " + word.italian;
    }
    else {
      word.gender = 'maschile';
      if (startsWithVowel(word.italian)) {
        word.italian = "l' " + word.italian;
      }
      else if (needsArticleLo(word.italian)) {
        word.italian = 'lo ' + word.italian;
      }
      else word.italian = 'il ' + word.italian;
    }
    return word;
  })
}

const startsWithVowel = (word) => {
  const vowelRegex = new RegExp("^[aieouAIEOU].*")
  return vowelRegex.test(word);
}

const needsArticleLo = (word) => {
  const regex = new RegExp("^(x|y|z|ps|pn|gn|s[^aeiou\d\W])", "i");
  return regex.test(word);
}

const store = (set) => ({
  ...initialState,
  fetchWords: async () =>
    set({ words: await getVocabulary() }),
  selectMode: (idx) => {
    set({ selectedMode: idx });
  },
  handleDrawer: (toggle) => {
    set({ drawerIsOpen: toggle });
  }
});

export const useStore = create(store);