import React, { useRef } from "react";

export default function MarkdownEditor({ id, label, value, onChange }) {
  const textareaRef = useRef();

  const insertAtCursor = (before, after = "") => {
    const textarea = textareaRef.current;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = textarea.value.slice(start, end);
    const newText = before + selectedText + after;
    const newValue = textarea.value.slice(0, start) + newText + textarea.value.slice(end);
    onChange(id, newValue);
    setTimeout(() => {
      textarea.focus();
      textarea.selectionStart = textarea.selectionEnd = start + before.length + selectedText.length + after.length;
    }, 0);
  };

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{label}</label>
      <div className="flex gap-2 mb-1">
        <button onClick={() => insertAtCursor("**", "**")} className="text-xs bg-gray-300 dark:bg-gray-700 text-gray-800 dark:text-gray-200 px-2 py-1 rounded">Bold</button>
        <button onClick={() => insertAtCursor("[", "](url)")} className="text-xs bg-gray-300 dark:bg-gray-700 text-gray-800 dark:text-gray-200 px-2 py-1 rounded">Link</button>
        <button onClick={() => insertAtCursor("\n```\n", "\n```")} className="text-xs bg-gray-300 dark:bg-gray-700 text-gray-800 dark:text-gray-200 px-2 py-1 rounded">Code</button>
      </div>
      <textarea
        ref={textareaRef}
        rows={4}
        className="w-full p-3 border bg-white/20 dark:bg-white/10 border-white/30 text-gray-800 dark:text-gray-200 rounded-xl focus:ring-2 focus:ring-blue-400 backdrop-blur-sm"
        value={value}
        onChange={(e) => onChange(id, e.target.value)}
        placeholder={`Enter ${id} content...`}
      />
    </div>
  );
}
