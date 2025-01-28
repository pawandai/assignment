"use client";

import { useState, useEffect } from "react";
import { LiveProvider, LiveError, LivePreview } from "react-live";

interface PreviewProps {
  code: string;
  dependencies: Record<string, string>;
}

export default function Preview({ code, dependencies }: PreviewProps) {
  const [scope, setScope] = useState<Record<string, unknown>>({});

  useEffect(() => {
    const loadDependencies = async () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const loadedDependencies: Record<string, any> = {};
      for (const [name, version] of Object.entries(dependencies)) {
        try {
          const importedModule = await import(
            `https://cdn.skypack.dev/${name}@${version}`
          );
          loadedDependencies[name] = importedModule.default || importedModule;
        } catch (error) {
          console.error(`Failed to load ${name}@${version}:`, error);
        }
      }
      setScope(loadedDependencies);
    };

    loadDependencies();
  }, [dependencies]);

  return (
    <div className="h-full overflow-auto bg-white">
      <LiveProvider code={code} scope={scope}>
        <LiveError />
        <LivePreview />
      </LiveProvider>
    </div>
  );
}
