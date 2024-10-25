import NotesPage from "./NotesPage";
import NoteProvider from "./context/NoteContext";

const App = () => {
  return (
    <div>
      <NoteProvider>
        <NotesPage />
      </NoteProvider>
    </div>
  )
}

export default App