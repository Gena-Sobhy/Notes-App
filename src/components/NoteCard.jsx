import { useContext } from "react";
import Spinner from "./Spinner.jsx"
import {setNewOffset, autoGrow, setZIndex, bodyParser} from "./utils.js"
import { useRef, useEffect, useState } from "react";
import { db } from "../appwrite/databases.js";
import DeleteButton from "./DeleteButton.jsx";
import {NoteContext} from "../context/NoteContext.jsx"

const NoteCard = ({note}) => {
    let body = bodyParser(note.body);
    let colors = JSON.parse(note.colors);

    // saving notes in database
    const [saving, setSaving] = useState(false);
    const keyUpTimer = useRef(null);
    const { setSelectedNote } = useContext(NoteContext);

    // moving cards (Drag and drop)
    const [position, setPosition] = useState(JSON.parse(note.position));

    let mouseStartPos = {x:0, y:0};
    const cardRef = useRef(null);

    const mouseDown = (e) => {
    if (e.target.className === "card-header") {

      mouseStartPos.x = e.clientX,
      mouseStartPos.y = e.clientY;

      document.addEventListener("mousemove", mouseMove);
      document.addEventListener("mouseup", mouseUp);

      setZIndex(cardRef.current);
      setSelectedNote(note);

    }
    
    };


    const mouseMove = (e) => {
      // calc move dir
      let mouseMoveDir = {
        x:mouseStartPos.x - e.clientX,
        y:mouseStartPos.y - e.clientY
      }

      // update start position
      mouseStartPos.x = e.clientX;
      mouseStartPos.y = e.clientY;

      // update position
      setPosition({
        x: cardRef.current.offsetLeft - mouseMoveDir.x,
        y: cardRef.current.offsetTop - mouseMoveDir.y
      })

      // setting moving boundaries
      const newPosition = setNewOffset(cardRef.current, mouseMoveDir)
      setPosition(newPosition)
    }

    const mouseUp = () => {
      document.removeEventListener('mousemove', mouseMove);
      document.removeEventListener("mousedown", mouseDown);

      // update position and data in database 
      const newPosition = setNewOffset(cardRef.current);
      saveData("position", newPosition)
      
    };

    // Auto grow card
    const textAreaRef = useRef(null);

    useEffect(() => {
      autoGrow(textAreaRef);
      setZIndex(cardRef.current);
    }, []);

    function autoGrow(textAreaRef) {
      const {current} = textAreaRef;
      current.style.height = "auto";
      current.style.height = current.scrollHeight + "px"
    }

    // saving position function
    const saveData = async (key, value) => {
      const payload = {[key]: JSON.stringify(value)};
      
      try {
        await db.notes.update(note.$id, payload)
      } catch (error) {
        console.error(error);
      }
      setSaving(false);
    }

    // updating notes to db after 2secs of key up
    const handleKeyUp = () => {
      setSaving(true);
      keyUpTimer.current =  setTimeout(() => {
        saveData("body", textAreaRef.current.value);
    }, 2000);
    };

  return (
    <div 
      className="card" 
      ref={cardRef}
      style={{
        background: colors.colorBody,
        left: `${position.x}px`,
        top: `${position.y}px`
      }}
    >
      <div 
        className="card-header"
        style={{background: colors.colorHeader}}
        onMouseDown={mouseDown}
      >
        <DeleteButton noteId={note.$id} />
        {saving && (
          <div className="card-saving">
              <Spinner color={colors.colorText} /> 
          </div>
        )}

      </div>

      <div className="card-body">
        <textarea 
        onKeyUp={handleKeyUp}
          ref={textAreaRef}
          style={{ color: colors.colorText}}
          defaultValue={body}
          onInput={() => {autoGrow(textAreaRef)}}
          onFocus={() => {
            setZIndex(cardRef.current);
            setSelectedNote(note);
        }}
        ></textarea>
      </div>

      </div>
  )
}

export default NoteCard