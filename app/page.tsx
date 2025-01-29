"use client";

import { useState, useEffect, useRef } from "react";
import { Sandpack } from "@codesandbox/sandpack-react";
import Navbar from "@/components/Navbar";
import FileExplorer from "@/components/FileExplorer";
import { Terminal } from "@xterm/xterm";
import "xterm/css/xterm.css";

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
  const commandRef = useRef<string>("");

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

  const terminalRef = useRef<HTMLDivElement>(null);

  const fetchLatestVersion = async (dep: string): Promise<string | null> => {
    try {
      const response = await fetch(`https://registry.npmjs.org/${dep}/latest`);
      if (!response.ok) {
        return null;
      }
      const data = await response.json();
      return data.version;
    } catch {
      return null;
    }
  };

  useEffect(() => {
    const term = new Terminal({
      convertEol: true
    });
    if (terminalRef.current) {
      term.open(terminalRef.current);
      term.writeln(
        "Use 'npm i <package>' or 'yarn add <package>' to add dependencies."
      );
      const prompt = () => {
        term.write("\r\n$ ");
      };
      prompt();
    }

    term.onData(async (data) => {
      switch (data) {
        case "\r": // Enter
          term.writeln("");
          const command = commandRef.current.trim();
          const npmInstall = command.startsWith("npm i ");
          const yarnAdd = command.startsWith("yarn add ");
          let deps: string[] = [];

          if (npmInstall) {
            deps = command
              .slice(6)
              .split(" ")
              .filter((dep) => dep);
          } else if (yarnAdd) {
            deps = command
              .slice(8)
              .split(" ")
              .filter((dep) => dep);
          }

          if (npmInstall || yarnAdd) {
            const addedDeps: string[] = [];
            const notFoundDeps: string[] = [];

            for (const dep of deps) {
              const version = await fetchLatestVersion(dep);
              if (version) {
                addedDeps.push(`${dep}@${version}`);
              } else {
                notFoundDeps.push(dep);
              }
            }

            if (notFoundDeps.length > 0) {
              term.writeln(
                `\x1b[Failed to add dependencies: ${notFoundDeps.join(
                  ", "
                )}\x1b[0m`
              );
            }

            if (addedDeps.length > 0) {
              setFiles((prevFiles) => {
                const packageJson = JSON.parse(prevFiles["/package.json"]);
                addedDeps.forEach((depWithVersion) => {
                  const [dep, version] = depWithVersion.split("@");
                  packageJson.dependencies[dep] = `^${version}`;
                });
                return {
                  ...prevFiles,
                  "/package.json": JSON.stringify(packageJson, null, 2)
                };
              });
              term.writeln(
                `\x1b[32mAdded dependencies: ${addedDeps.join(", ")}\x1b[0m`
              );
            }
          } else {
            term.writeln("\x1b[31mCommand not recognized.\x1b[0m");
          }
          commandRef.current = "";
          const prompt = () => {
            term.write("\r\n$ ");
          };
          prompt();
          break;
        case "\u0003": // Ctrl+C
          term.writeln("^C");
          commandRef.current = "";
          const promptCtrl = () => {
            term.write("\r\n$ ");
          };
          promptCtrl();
          break;
        case "\u007F": // Backspace
          if (commandRef.current.length > 0) {
            term.write("\b \b");
            commandRef.current = commandRef.current.slice(0, -1);
          }
          break;
        default:
          // Print input and add to command buffer
          term.write(data);
          commandRef.current += data;
          break;
      }
    });

    return () => {
      term.dispose();
    };
  }, [setFiles]);

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
          <div className="flex-1 overflow-scroll">
            <Sandpack
              template="react"
              files={files}
              options={{
                visibleFiles: Object.keys(files),
                activeFile: activeFile,
                editorHeight: "100vh",
                resizablePanels: true
              }}
              theme={"dark"}
            />
          </div>
          <div
            ref={terminalRef}
            className="h-56 bg-black w-full overflow-auto"
          />
        </div>
      </div>
    </div>
  );
}
