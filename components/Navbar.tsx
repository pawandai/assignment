"use client";

import { Share2, Plus, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Navbar() {
  return (
    <nav className="h-12 bg-[#1e2024] border-b border-gray-800 flex items-center px-4 justify-between">
      <div className="flex items-center space-x-4">
        <div className="text-green-400 font-mono text-xl">⟩</div>
        <div className="flex items-center space-x-2">
          <button className="px-2 py-1 text-gray-300 hover:bg-gray-800 rounded">
            React Playground
          </button>
        </div>
      </div>
      <div className="flex items-center space-x-4">
        <Button variant="ghost" size="sm" className="text-gray-400">
          <Share2 className="h-4 w-4 mr-2" />
          Share
        </Button>
        <Button variant="ghost" size="sm" className="text-gray-400">
          <BookOpen className="h-4 w-4 mr-2" />
          Learn
        </Button>
        <Button variant="ghost" size="sm" className="text-gray-400">
          Sign In
        </Button>
        <Button
          variant="default"
          size="sm"
          className="bg-green-600 hover:bg-green-700"
        >
          <Plus className="h-4 w-4 mr-2" />
          Sign Up
        </Button>
      </div>
    </nav>
  );
}
