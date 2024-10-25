import React, { useContext, useRef } from 'react';
import Plus from "./Plus";
import colors from "../assets/colors.json"
import { db } from '../appwrite/databases';
import { NoteContext } from '../context/NoteContext';

const AddButton = () => {
  const startingPos = useRef(10);

  const { setNotes } = useContext(NoteContext);

  const addNote = async () => {
    const payload = {
      position: JSON.stringify({
        x: startingPos.current,
        y: startingPos.current
      }),
      colors: JSON.stringify(colors[0]),
    };

    startingPos.current += 10;

    const res = await db.notes.create(payload);
    setNotes((prevState) => [res, ...prevState]);
  }

  return (
    <div id="add-btn" onClick={addNote}>
        <Plus />
    </div>
  )
}

export default AddButton