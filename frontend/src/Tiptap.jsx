import { HocuspocusProvider } from "@hocuspocus/provider";
import CharacterCount from "@tiptap/extension-character-count";
import Collaboration from "@tiptap/extension-collaboration";
import CollaborationCursor from "@tiptap/extension-collaboration-cursor";
import Highlight from "@tiptap/extension-highlight";
import TaskItem from "@tiptap/extension-task-item";
import TaskList from "@tiptap/extension-task-list";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import React, { useEffect, useState } from "react";
// import * as Y from "yjs";

import "./index.css";

const websocketProvider = new HocuspocusProvider({
  url: "ws://localhost:1234",
  name: "test",
});

const Tiptap = () => {
  const [status, setStatus] = useState("connecting");

  // eslint-disable-next-line
  const editor = useEditor({
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
      // Collaboration.configure({
      //   document: websocketProvider.document,
      // }),
      // CollaborationCursor.configure({
      //   provider: websocketProvider,
      // }),
    ],
  });

  useEffect(() => {
    // Update status changes
    websocketProvider.on("status", (event) => {
      setStatus(event.status);
    });
  }, []);

  return (
    <div className="editor">
      <EditorContent className="editor__content" editor={editor} />
      <div className="editor__footer">
        <div className="editor__name">
          <span>Current status: {status}</span>
        </div>
      </div>
    </div>
  );
};

export default Tiptap;
