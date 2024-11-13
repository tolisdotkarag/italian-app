import "../App.css";
import { Box } from "@mui/material";
import WordTable from "./table/WordTable";
// import { useQuery } from "react-query";

export default function ListenToWord(props) {
  // const {
  //   data: words,
  //   error,
  //   isLoading,
  // } = useQuery("wordsData", getVocabulary);

  // if (isLoading) return <div>Fetching words...</div>;
  // if (error) return <div>An error occurred: {error.message}</div>;

  const getAudioStream = async (word) => {
    const options = {
      method: "POST",
      headers: {
        "xi-api-key": process.env.REACT_APP_TEXT_TO_SPEECH_XI_API_KEY,
        "Content-Type": "application/json",
      },
      body: `{"model_id":"eleven_multilingual_v2","text":"${word}","voice_settings":{"stability":1,"similarity_boost":1}}`,
    };
    try {
      const response = await fetch(
        process.env.REACT_APP_TEXT_TO_SPEECH_URL,
        options
      );
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      // Convert the response to a Blob and return it
      const audioBlob = await response.blob();
      return audioBlob;
    } catch (error) {
      console.error("Error fetching audio:", error);
      throw error;
    }
  };

  function playAudio(audioBlob) {
    // Create an object URL from the Blob
    const audioUrl = URL.createObjectURL(audioBlob);

    // Play the audio using the Audio object
    const audio = new Audio(audioUrl);
    audio.play();

    console.log("Playing audio...");
  }

  const playSound = (word) => {
    getAudioStream(word)
      .then((audioBlob) => playAudio(audioBlob))
      .catch((error) => console.error("Audio playback failed:", error));
  };
  return (
    <Box sx={{ width: "100%", marginTop: "1rem" }}>
      {/* {words.map((word) => {
        return (
          <div key={word.docId} className="word">
            <p>
              {word.italian} {word.greek}
            </p>
            <Button onClick={() => playSound(word.italian)}>
              <VolumeUpIcon sx={{ color: "#0C120C" }} />
            </Button>
          </div>
        );
      })} */}
      <WordTable />
    </Box>
  );
}
