import MenuBar from "./MenuBar";
// Tiptap
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Image from "@tiptap/extension-image";
import Subscript from "@tiptap/extension-subscript";
import Superscript from "@tiptap/extension-superscript";
import Link from "@tiptap/extension-link";
import TextAlign from "@tiptap/extension-text-align";
import { lowlight } from "lowlight/lib/core";
import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight";
import py from "highlight.js/lib/languages/python";
import js from "highlight.js/lib/languages/javascript";
// Tiptap ends

// load all highlight.js languages
lowlight.registerLanguage("js", js);
lowlight.registerLanguage("py", py);

import classes from "./TipTapEditor.module.scss";

interface IProps {
  setState: React.Dispatch<React.SetStateAction<string>>;
  MainContent: string;
  setValue: React.Dispatch<React.SetStateAction<any>>;
  mode?: "read" | "write" | "edit";
}

const Tiptap: React.FC<IProps> = ({
  setState,
  MainContent,
  setValue,
  mode = "read",
}) => {
  const editor = useEditor({
    editable: mode !== "read",
    extensions: [
      StarterKit,
      Underline,
      Subscript,
      Superscript,
      CodeBlockLowlight.configure({ lowlight }),
      Image.configure({
        // allowBase64: true,
        inline: true,
        HTMLAttributes: {
          class: "EditorImages", // This can be styled in base.scss
        },
      }),
      Link.configure({
        openOnClick: false,
      }),
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
    ],
    content: MainContent,
    onUpdate: ({ editor }) => {
      setState(editor.getHTML());
      setValue((prev: any) => {
        return { ...prev, mainContent: editor.getHTML() };
      });
    },
  });

  return (
    <div
      className={`${classes.TipTapContainer} ${
        mode === "read" ? classes.ReadMode : ""
      }`}
      // The mode is to show or remove the border
    >
      {mode !== "read" && <MenuBar editor={editor} />}
      <EditorContent
        editor={editor}
        className={mode === "read" ? "ReadMode" : ""}
      />
    </div>
  );
};

export default Tiptap;
