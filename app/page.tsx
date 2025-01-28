"use client";

import { useState } from "react";
import { Sandpack } from "@codesandbox/sandpack-react";
import Navbar from "@/components/Navbar";
import FileExplorer from "@/components/FileExplorer";

const initialFiles: Record<string, string> = {
  "/src/App.js": `import React from 'react';

export function App() {
  return (
    <div className="App">
      <h1>Hello React.</h1>
      <h2>Start editing to see some magic happen!</h2>
    </div>
  );
}`,
  "/src/index.js": `import React from 'react';
import ReactDOM from 'react-dom/client';
import { App } from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);`,
  "/public/index.html": `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>React App</title>
</head>
<body>
    <div id="root"></div>
</body>
</html>`,
  "/package.json": `{
  "name": "react-playground",
  "version": "1.0.0",
  "description": "A React playground",
  "main": "src/index.js",
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0"
  }
}`
};

export default function Home() {
  const [files, setFiles] = useState(initialFiles);
  const [activeFile, setActiveFile] = useState("/src/App.js");

  const handleFileSelect = (fileName: string) => {
    setActiveFile(fileName);
  };

  const handleAddFile = (fileName: string, isFolder: boolean) => {
    if (!isFolder) {
      setFiles((prevFiles) => ({
        ...prevFiles,
        [fileName]: ""
      }));
    }
  };

  const handleDeleteFile = (fileName: string) => {
    setFiles((prevFiles) => {
      const newFiles = { ...prevFiles };
      delete newFiles[fileName];
      return newFiles;
    });
    if (activeFile === fileName) {
      setActiveFile(Object.keys(files)[0] || "");
    }
  };

  return (
    <div className="h-screen flex flex-col bg-[#1e2024] text-gray-300">
      <Navbar />
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
        <div className="w-full md:w-64">
          <FileExplorer
            files={Object.keys(files)}
            activeFile={activeFile}
            onFileSelect={handleFileSelect}
            onAddFile={handleAddFile}
            onDeleteFile={handleDeleteFile}
          />
        </div>
        <div className="flex-1 flex flex-col">
          <div className="flex-1 overflow-hidden">
            <Sandpack
              template="react"
              files={files}
              options={{
                visibleFiles: Object.keys(files),
                activeFile: activeFile,
                editorHeight: "100vh"
              }}
              theme={"dark"}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
