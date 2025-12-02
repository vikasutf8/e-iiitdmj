import React, { useRef, useEffect } from "react";
import Toolbar from "./toolbar";

interface Props {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

const RichTextEditor: React.FC<Props> = ({ value, onChange, placeholder }) => {
  const editorRef = useRef<HTMLDivElement>(null);

  const exec = (command: string, value?: string) => {
    document.execCommand(command, false, value);
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  };

  const handleInput = () => {
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  };

  // Sync external value when RHF resets form
  useEffect(() => {
    if (editorRef.current && editorRef.current.innerHTML !== value) {
      editorRef.current.innerHTML = value || "";
    }
  }, [value]);

  return (
    <div className="space-y-2">
      <Toolbar exec={exec} />

      <div
        ref={editorRef}
        className="min-h-[150px] p-3 bg-gray-900 text-gray-100 border border-gray-700 rounded-lg outline-none prose prose-invert"
        contentEditable
        onInput={handleInput}
        data-placeholder={placeholder}
        suppressContentEditableWarning
      />

      {/* Placeholder style */}
      <style>{`
        [contenteditable][data-placeholder]:empty:before {
          content: attr(data-placeholder);
          color: #777;
        }
      `}</style>
    </div>
  );
};

export default RichTextEditor;
