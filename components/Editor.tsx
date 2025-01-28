"use client";

import { useEffect, useState } from "react";
import CodeMirror from "@uiw/react-codemirror";
import { javascript } from "@codemirror/lang-javascript";
import { EditorView } from "@codemirror/view";
import { tags as t } from "@lezer/highlight";
import { createTheme } from "@uiw/codemirror-themes";

const myTheme = createTheme({
  theme: "dark",
  settings: {
    background: "#1e2024",
    foreground: "#abb2bf",
    caret: "#528bff",
    selection: "#3e4451",
    selectionMatch: "#3e4451",
    lineHighlight: "#2c313c"
  },
  styles: [
    { tag: t.comment, color: "#5c6370" },
    { tag: t.variableName, color: "#e06c75" },
    { tag: t.string, color: "#98c379" },
    { tag: t.keyword, color: "#c678dd" },
    { tag: t.function(t.variableName), color: "#61afef" }
  ]
});

interface EditorProps {
  code: string;
  onChange: (code: string) => void;
}

export default function Editor({ code, onChange }: EditorProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <CodeMirror
      value={code}
      height="100%"
      theme={myTheme}
      extensions={[javascript({ jsx: true }), EditorView.lineWrapping]}
      onChange={onChange}
      className="h-full"
    />
  );
}
