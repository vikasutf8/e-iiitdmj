import React from "react";
import {
  Bold,
  Italic,
  Underline,
  List,
  ListOrdered,
  Undo,
  Redo,
  Heading1,
  Heading2,
  Quote,
} from "lucide-react";

interface Props {
  exec: (command: string, value?: string) => void;
}

const Toolbar: React.FC<Props> = ({ exec }) => {
  const btn =
    "p-2 rounded-lg hover:bg-gray-700 text-gray-200 transition border border-gray-700 bg-gray-800";

  return (
    <div className="flex gap-2 flex-wrap bg-gray-900 p-2 rounded-xl border border-gray-700">
      <button className={btn} onClick={() => exec("bold")}>
        <Bold size={18} />
      </button>

      <button className={btn} onClick={() => exec("italic")}>
        <Italic size={18} />
      </button>

      <button className={btn} onClick={() => exec("underline")}>
        <Underline size={18} />
      </button>

      <button className={btn} onClick={() => exec("formatBlock", "<h1>")}>
        <Heading1 size={18} />
      </button>

      <button className={btn} onClick={() => exec("formatBlock", "<h2>")}>
        <Heading2 size={18} />
      </button>

      <button className={btn} onClick={() => exec("insertUnorderedList")}>
        <List size={18} />
      </button>

      <button className={btn} onClick={() => exec("insertOrderedList")}>
        <ListOrdered size={18} />
      </button>

      <button className={btn} onClick={() => exec("formatBlock", "<blockquote>")}>
        <Quote size={18} />
      </button>

      <button className={btn} onClick={() => exec("undo")}>
        <Undo size={18} />
      </button>

      <button className={btn} onClick={() => exec("redo")}>
        <Redo size={18} />
      </button>
    </div>
  );
};

export default Toolbar;
