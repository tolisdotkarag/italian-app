import {
  Alert,
  Box,
  Button,
  FormControl,
  FormControlLabel,
  FormHelperText,
  FormLabel,
  Input,
  InputLabel,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
  Snackbar,
  Typography,
} from "@mui/material";
import { collection, addDoc } from "firebase/firestore";
import { db } from "../config/firestore";
import { useState } from "react";
import { useStore } from "../store";

export default function AddWord(props) {
  const getWords = useStore((store) => store.fetchWords);
  const words = useStore((store) => store.words);
  const [italian, setItalian] = useState("");
  const [greek, setGreek] = useState("");
  const [part_of_speech, setPartOfSpeech] = useState("");
  const [gender, setGender] = useState("");
  const [comment, setComment] = useState("");
  const [openSuccess, setOpenSuccess] = useState(false);
  const [openError, setOpenError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const resetForm = () => {
    setItalian("");
    setGreek("");
    setPartOfSpeech("");
    setGender("");
    setComment("");
  };

  const handleCloseSuccess = () => {
    setOpenSuccess(false);
  };
  const handleCloseError = () => {
    setOpenError(false);
  };

  const onSubmit = async () => {
    if (
      !italian.length ||
      !greek.length ||
      !part_of_speech.length ||
      (part_of_speech === "noun" && !gender.length)
    ) {
      setOpenError(true);
      setErrorMessage("You need to fill all the required fields");
      return;
    }
    if (words.find((word) => word.italian === italian)) {
      setOpenError(true);
      setErrorMessage("This word already exists in the vocabulary");
      return;
    }

    let data = {
      italian,
      greek,
      part_of_speech,
      comment,
      date_added: new Date().getTime(),
      ...(part_of_speech === "noun" && { gender }),
    };
    try {
      await addDoc(collection(db, "vocabulary"), data);
      setOpenSuccess(true);
      getWords();
      resetForm();
    } catch (error) {
      console.error(error.message);
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: "1.5rem",
        // marginTop: "1rem",
        width: { xs: "100%", md: "70%" },
        maxWidth: "550px",
      }}
    >
      <Typography variant="h6" sx={{ mt: 1, mb: 0 }}>
        Add a word to the vocabulary
      </Typography>
      <FormControl required>
        <InputLabel htmlFor="italian-input">Italian</InputLabel>
        <Input
          id="italian-input"
          value={italian}
          onChange={(e) => setItalian(e.target.value)}
          aria-describedby="italian-helper-text"
        />
        <FormHelperText id="italian-helper-text">
          Do not add an article to the nouns. It will be infered by the gender.
        </FormHelperText>
      </FormControl>
      <FormControl required>
        <InputLabel htmlFor="greek-input">Greek</InputLabel>
        <Input
          id="greek-input"
          value={greek}
          onChange={(e) => setGreek(e.target.value)}
        />
      </FormControl>
      <FormControl required variant="standard" sx={{ minWidth: 120 }}>
        <InputLabel id="part-of-speech-label" sx={{ paddingLeft: "14px" }}>
          Type
        </InputLabel>
        <Select
          labelId="part-of-speech-label"
          id="part-of-speech-input"
          value={part_of_speech}
          onChange={(e) => setPartOfSpeech(e.target.value)}
          label="Age"
        >
          <MenuItem value="" disabled>
            <em>None</em>
          </MenuItem>
          <MenuItem value="noun">Noun</MenuItem>
          <MenuItem value="verb">Verb</MenuItem>
          <MenuItem value="adjective">Adjective</MenuItem>
          <MenuItem value="adverb">Adverb</MenuItem>
          <MenuItem value="pronoun">Pronoun</MenuItem>
          <MenuItem value="expression">Expression</MenuItem>
        </Select>
      </FormControl>
      {part_of_speech === "noun" && (
        <FormControl required sx={{ ml: "11px" }}>
          <FormLabel id="gender-label">Gender</FormLabel>
          <RadioGroup
            row
            aria-labelledby="gender-label"
            value={gender}
            onChange={(e) => setGender(e.target.value)}
            name="radio-buttons-group"
          >
            <FormControlLabel
              value="female"
              control={<Radio />}
              label="Female"
            />
            <FormControlLabel value="male" control={<Radio />} label="Male" />
          </RadioGroup>
        </FormControl>
      )}
      <FormControl>
        <InputLabel htmlFor="comment-input">Comment</InputLabel>
        <Input
          id="comment-input"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />
      </FormControl>
      <Box
        sx={{ display: "inline-flex", alignSelf: "end", gap: "0.3rem" }}
        aria-label="Form actions button group"
      >
        <Button color="error" variant="outlined" onClick={resetForm}>
          Reset
        </Button>
        <Button variant="contained" onClick={onSubmit}>
          Submit
        </Button>
      </Box>
      <Snackbar
        open={openSuccess}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        autoHideDuration={3000}
        onClose={handleCloseSuccess}
      >
        <Alert
          onClose={handleCloseSuccess}
          variant="filled"
          severity="success"
          sx={{ width: "100%" }}
        >
          The word was added successfully to the vocabulary!
        </Alert>
      </Snackbar>
      <Snackbar
        open={openError}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        autoHideDuration={3000}
        onClose={handleCloseError}
      >
        <Alert
          onClose={handleCloseError}
          variant="filled"
          severity="error"
          sx={{ width: "100%" }}
        >
          {errorMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
}
