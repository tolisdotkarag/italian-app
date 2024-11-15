import { create } from 'zustand';
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { db } from "./config/firestore";

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
      word.italianDisplay = word.italian
      return word;
    }
    if (word.gender === 'female') {
      word.gender = 'femminile';
      if (startsWithVowel(word.italian)) {
        word.italianDisplay = "l' " + word.italian;
      }
      else word.italianDisplay = "la " + word.italian;
    }
    else {
      word.gender = 'maschile';
      if (startsWithVowel(word.italian)) {
        word.italianDisplay = "l' " + word.italian;
      }
      else if (needsArticleLo(word.italian)) {
        word.italianDisplay = 'lo ' + word.italian;
      }
      else word.italianDisplay = 'il ' + word.italian;
    }
    return word;
  })
}

function greekStringsIgnoringTones(str1, str2) {
  // Normalize and remove diacritical marks from the entire string
  const normalizeString = (str) =>
    str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");

  // Normalize both strings and compare them
  const normalizedStr1 = normalizeString(str1);
  const normalizedStr2 = normalizeString(str2);

  // Return comparison result (case-insensitive if needed)
  return { field1: normalizedStr1.toLowerCase(), field2: normalizedStr2.toLowerCase() };
}

const compareFn = (field, order) => {
  return (a, b) => {
    let field1 = a[field];
    let field2 = b[field];
    if (field === 'greek') {
      let obj = greekStringsIgnoringTones(field1, field2);
      field1 = obj.field1;
      field2 = obj.field2;
    }
    if (field1 < field2) return order === "asc" ? -1 : 1;
    if (field1 > field2) return order === "asc" ? 1 : -1;
    return 0;
  };
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
  modes: ["Vocabulary", "Practice", "Contribute"],
  selectedMode: 0,
  drawerIsOpen: false,
  words: [],
  fetchWords: async () =>
    set({ words: await getVocabulary() }),
  selectMode: (idx) => {
    set({ selectedMode: idx });
  },
  handleDrawer: (toggle) => {
    set({ drawerIsOpen: toggle });
  },
  sortWords: (filter, order) => {
    set((state) => ({ words: [...state.words].sort(compareFn(filter, order)) }))
  }
});

export const useStore = create(store);