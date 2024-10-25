import React from 'react';

import { db } from '../appwrite/databases';
import Trash from "./Trash.jsx";
import { useContext } from 'react';
import { NoteContext } from '../context/NoteContext.jsx';

const DeleteButton = ({ noteId }) => {
  const { setNotes } = useContext(NoteContext);
    // updating (delete) from database
    const handleDelete = async (e) => {
        db.notes.delete(noteId);
        setNotes((prevState) =>
            prevState.filter((note) => note.$id !== noteId)
        );
    };
  return (
    <div onClick={handleDelete}>
        <Trash />
    </div>
  )
}

export default DeleteButton