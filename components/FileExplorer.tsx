"use client";

import { useState } from "react";
import { FileCode, Plus, Folder, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface FileExplorerProps {
  files: string[];
  activeFile: string;
  onFileSelect: (fileName: string) => void;
  onAddFile: (fileName: string, isFolder: boolean) => void;
  onDeleteFile: (fileName: string) => void;
}

export default function FileExplorer({
  files,
  activeFile,
  onFileSelect,
  onAddFile,
  onDeleteFile
}: FileExplorerProps) {
  const [newFileName, setNewFileName] = useState("");
  const [isAddingFile, setIsAddingFile] = useState(false);
  const [isAddingFolder, setIsAddingFolder] = useState(false);

  const handleAddFile = (isFolder: boolean) => {
    if (newFileName) {
      onAddFile(newFileName, isFolder);
      setNewFileName("");
      setIsAddingFile(false);
      setIsAddingFolder(false);
    }
  };

  return (
    <div className="p-2">
      <div className="flex items-center justify-between p-1">
        <span className="text-xs font-semibold uppercase">FILES</span>
        <div>
          <button
            onClick={() => setIsAddingFile(true)}
            className="text-gray-400 hover:text-white mr-2"
          >
            <Plus className="h-4 w-4" />
          </button>
          <button
            onClick={() => setIsAddingFolder(true)}
            className="text-gray-400 hover:text-white"
          >
            <Folder className="h-4 w-4" />
          </button>
        </div>
      </div>
      {(isAddingFile || isAddingFolder) && (
        <div className="mt-2 flex">
          <input
            type="text"
            value={newFileName}
            onChange={(e) => setNewFileName(e.target.value)}
            placeholder={isAddingFolder ? "Folder name" : "File name"}
            className="flex-1 bg-gray-800 text-white text-sm p-1 rounded-l"
          />
          <button
            onClick={() => handleAddFile(isAddingFolder)}
            className="bg-green-600 text-white text-sm px-2 rounded-r"
          >
            Add
          </button>
        </div>
      )}
      <div className="mt-2">
        {files.map((file) => (
          <div key={file} className="flex items-center justify-between">
            <button
              onClick={() => onFileSelect(file)}
              className={cn(
                "flex items-center w-full px-2 py-1 text-left text-sm rounded",
                activeFile === file ? "bg-gray-800" : "hover:bg-gray-800"
              )}
            >
              <FileCode className="h-4 w-4 mr-2" />
              {file.split("/").pop()}
            </button>
            <button
              onClick={() => onDeleteFile(file)}
              className="text-gray-400 hover:text-white px-2"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
