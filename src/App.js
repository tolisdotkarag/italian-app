import './App.css';
import MiniDrawer from './components/sidebar/MiniDrawer';
import Box from "@mui/material/Box";
import ListenToWord from './components/ListenToWord';
import CssBaseline from "@mui/material/CssBaseline";
import MyAppBar from './components/sidebar/MyAppBar';
import { useStore } from './store';

function App() {
  const drawerIsOpen = useStore(store => store.drawerIsOpen);
  const modes = useStore(store => store.modes);
  const selectedMode = useStore(store => store.selectedMode);
  const selectMode = useStore(store => store.selectMode);

  return (
    <div className="App">
      <Box sx={{ display: "flex" }}>
        <CssBaseline />
        <MyAppBar open={drawerIsOpen} />
        <MiniDrawer
          open={drawerIsOpen}
          modes={modes}
          selectedMode={selectedMode}
          selectMode={selectMode}
        />
        <Box component="main" sx={{
          position: 'relative',
          top: 48,
          flexGrow: 1,
          p: 3
        }}>
          {selectedMode === 0 ?
            <ListenToWord /> :
            selectedMode === 1 ?
              <h3>Practice title</h3>
              :
              <h3>Contribute title</h3>
          }
        </Box>
      </Box>
    </div>
  );
}

export default App;
