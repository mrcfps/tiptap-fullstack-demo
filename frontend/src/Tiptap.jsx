import { HocuspocusProvider } from "@hocuspocus/provider";
import CharacterCount from "@tiptap/extension-character-count";
import Collaboration from "@tiptap/extension-collaboration";
import CollaborationCursor from "@tiptap/extension-collaboration-cursor";
import Highlight from "@tiptap/extension-highlight";
import TaskItem from "@tiptap/extension-task-item";
import TaskList from "@tiptap/extension-task-list";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import React, { useEffect, useMemo, useState } from "react";
import * as Y from "yjs";

import "./index.css";

// const websocketProvider = new HocuspocusProvider({
//   url: "ws://localhost:1234",
//   name: "test",
// });

function DocList({ docs, setDocs, handleEdit }) {
  const [inputValue, setInputValue] = useState();

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleAddDoc = () => {
    if (inputValue.trim()) {
      setDocs([...docs, inputValue.trim()]);
      setInputValue("");
    }
  };

  return (
    <div>
      <h2>Doc List</h2>
      <div>
        <input type="text" value={inputValue} onChange={handleInputChange} />
        <button onClick={handleAddDoc}>Add Document</button>
      </div>
      <ul>
        {docs.map((docName, index) => (
          <li
            key={index}
            onClick={() => handleEdit(docName)}
            style={{ cursor: "pointer" }}
          >
            {docName}
          </li>
        ))}
      </ul>
    </div>
  );
}

const Tiptap = () => {
  const [docs, setDocs] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch("http://localhost:5555/docList");
      const data = await res.json();
      setDocs(data);
    };
    fetchData();
  }, []);

  const [status, setStatus] = useState("disconnected");
  const [docName, setDocName] = useState("test");

  useEffect(() => {
    // Update status changes
    websocketProvider.on("status", (event) => {
      setStatus(event.status);
    });
  }, []);

  const websocketProvider = useMemo(() => {
    return new HocuspocusProvider({
      url: "ws://localhost:1234",
      name: docName,
    });
  }, [docName]);

  // eslint-disable-next-line
  const editor = useEditor(
    {
      extensions: [
        StarterKit.configure({
          history: false,
        }),
        Highlight,
        TaskList,
        TaskItem,
        CharacterCount.configure({
          limit: 10000,
        }),
        Collaboration.configure({
          document: websocketProvider.document,
        }),
        CollaborationCursor.configure({
          provider: websocketProvider,
        }),
      ],
      onUpdate: ({ editor }) => {
        console.log("update", editor.getJSON());
      },
    },
    [docName]
  );

  return (
    <div className="editor">
      <DocList
        docs={docs}
        setDocs={setDocs}
        handleEdit={(docName) => setDocName(docName)}
      />
      {docs.length > 0 ? (
        <EditorContent
          style={{ margin: "1rem", border: "1px solid gray" }}
          className="editor__content"
          editor={editor}
        />
      ) : null}
      <div className="editor__footer">
        <div className="editor__name">
          <span>Current document: {docName}</span>
        </div>
        <div className="editor__name">
          <span>Current status: {status}</span>
        </div>
      </div>
    </div>
  );
};

export default Tiptap;
