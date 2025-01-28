"use client";

import { useState } from "react";
import { ChevronDown, ChevronRight, Package, Plus } from "lucide-react";

interface PackageManagerProps {
  dependencies: Record<string, string>;
  onAddPackage: (name: string, version: string) => void;
}

export default function PackageManager({
  dependencies,
  onAddPackage
}: PackageManagerProps) {
  const [isOpen, setIsOpen] = useState(true);
  const [newPackage, setNewPackage] = useState("");
  const [newVersion, setNewVersion] = useState("");

  const handleAddPackage = () => {
    if (newPackage && newVersion) {
      onAddPackage(newPackage, newVersion);
      setNewPackage("");
      setNewVersion("");
    }
  };

  return (
    <div className="p-2 border-t border-gray-800">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center w-full p-1"
      >
        {isOpen ? (
          <ChevronDown className="h-4 w-4" />
        ) : (
          <ChevronRight className="h-4 w-4" />
        )}
        <span className="text-xs font-semibold uppercase ml-1">PACKAGES</span>
      </button>
      {isOpen && (
        <div className="mt-2">
          <div className="flex mb-2">
            <input
              type="text"
              value={newPackage}
              onChange={(e) => setNewPackage(e.target.value)}
              placeholder="Package name"
              className="flex-1 bg-gray-800 text-white text-sm p-1 rounded-l"
            />
            <input
              type="text"
              value={newVersion}
              onChange={(e) => setNewVersion(e.target.value)}
              placeholder="Version"
              className="w-20 bg-gray-800 text-white text-sm p-1"
            />
            <button
              onClick={handleAddPackage}
              className="bg-green-600 text-white text-sm px-2 rounded-r"
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>
          {Object.entries(dependencies).map(([name, version]) => (
            <div key={name} className="flex items-center text-sm py-1">
              <Package className="h-4 w-4 mr-2" />
              {name}@{version}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
