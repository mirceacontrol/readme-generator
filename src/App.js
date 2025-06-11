import React, { useState } from "react";
import ReactMarkdown from "react-markdown";
import MarkdownEditor from "./MarkdownEditor";
import useDarkMode from "./useDarkMode";

// Core sections
const sectionOptions = [
  { id: "title", label: "Project Title" },
  { id: "description", label: "Description" },
  { id: "installation", label: "Installation" },
  { id: "usage", label: "Usage" },
  { id: "contact", label: "Contact Info" },
];

function generateId() {
  return "custom_" + Math.random().toString(36).substr(2, 9);
}

export default function App() {
  const [selectedSections, setSelectedSections] = useState([]);
  const [formData, setFormData] = useState({});
  const [customSections, setCustomSections] = useState([]); // {id, label, value}
  const [copied, setCopied] = useState(false);
  const [darkMode, setDarkMode] = useDarkMode();

  // --- Custom Section Actions ---
  const addCustomSection = () => {
    const newSection = {
      id: generateId(),
      label: "Custom Section",
      value: "",
    };
    setCustomSections((prev) => [...prev, newSection]);
    setSelectedSections((prev) => [...prev, newSection.id]);
  };

  const updateCustomSection = (id, field, value) => {
    setCustomSections((prev) =>
      prev.map((s) => (s.id === id ? { ...s, [field]: value } : s))
    );
  };

  const moveCustomSection = (id, direction) => {
    const index = selectedSections.indexOf(id);
    if (
      (direction === -1 && index === 0) ||
      (direction === 1 && index === selectedSections.length - 1)
    )
      return;
    const newOrder = [...selectedSections];
    const [removed] = newOrder.splice(index, 1);
    newOrder.splice(index + direction, 0, removed);
    setSelectedSections(newOrder);
  };

  const deleteCustomSection = (id) => {
    setCustomSections((prev) => prev.filter((s) => s.id !== id));
    setSelectedSections((prev) => prev.filter((s) => s !== id));
  };

  // --- Section toggle for built-in sections ---
  const toggleSection = (id) => {
    setSelectedSections((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );
  };

  const handleChange = (id, value) => {
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  // --- Markdown Generation ---
  const generateMarkdown = () => {
    let md = "";
    for (let id of selectedSections) {
      const core = sectionOptions.find((s) => s.id === id);
      if (core) {
        if (id === "title")
          md += `# ${formData.title || "Your Project Title"}\n\n`;
        else if (id === "description")
          md += `${formData.description || "*Project description goes here.*"}\n\n`;
        else if (id === "installation")
          md += `## Installation\n${formData.installation || "Instructions"}\n\n`;
        else if (id === "usage")
          md += `## Usage\n${formData.usage || "How to use the app"}\n\n`;
        else if (id === "contact")
          md += `## Contact\n${formData.contact || "Your email or GitHub"}\n\n`;
      } else {
        // Custom section
        const cs = customSections.find((s) => s.id === id);
        if (cs) {
          md += `## ${cs.label || "Custom Section"}\n${cs.value || ""}\n\n`;
        }
      }
    }
    return md;
  };

  const markdown = generateMarkdown();

  const copyToClipboard = () => {
    navigator.clipboard.writeText(markdown).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-blue-100 to-blue-200 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 text-gray-800 dark:text-gray-100 p-6 md:p-10 transition-colors">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-blue-700 dark:text-blue-400 drop-shadow-md">
            📝 README Generator
          </h1>
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="text-sm bg-gray-200 dark:bg-gray-700 px-4 py-2 rounded shadow"
          >
            {darkMode ? "☀️ Light Mode" : "🌙 Dark Mode"}
          </button>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Form */}
          <div className="bg-white/30 dark:bg-white/10 backdrop-blur-md rounded-2xl shadow-xl p-6 border border-white/20">
            <h2 className="text-2xl font-semibold mb-4 text-blue-800 dark:text-blue-300">
              Choose Sections
            </h2>

            {/* Built-in Sections */}
            <div className="space-y-2 mb-4">
              {sectionOptions.map((section) => (
                <label key={section.id} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={selectedSections.includes(section.id)}
                    onChange={() => toggleSection(section.id)}
                    className="accent-blue-500"
                  />
                  <span>{section.label}</span>
                </label>
              ))}
            </div>

            {/* Custom Section Add Button */}
            <button
              onClick={addCustomSection}
              className="mb-4 bg-blue-500 hover:bg-blue-600 text-white py-1 px-4 rounded shadow text-sm"
            >
              ➕ Add Custom Section
            </button>

            {/* Render sections in order */}
            <div className="space-y-6">
              {selectedSections.map((id, idx) => {
                // Core section
                const core = sectionOptions.find((s) => s.id === id);
                if (core) {
                  return (
                    <MarkdownEditor
                      key={id}
                      id={id}
                      label={core.label}
                      value={formData[id] || ""}
                      onChange={handleChange}
                    />
                  );
                }
                // Custom section
                const cs = customSections.find((s) => s.id === id);
                if (!cs) return null;
                return (
                  <div key={id} className="bg-white/30 dark:bg-white/10 rounded-xl p-3 border border-white/30">
                    <div className="flex items-center gap-2 mb-2">
                      <input
                        className="w-1/2 bg-transparent border-b border-blue-400 dark:border-blue-300 text-lg font-bold focus:outline-none focus:ring-0"
                        value={cs.label}
                        onChange={e =>
                          updateCustomSection(id, "label", e.target.value)
                        }
                        placeholder="Section name"
                      />
                      <button
                        onClick={() => moveCustomSection(id, -1)}
                        disabled={idx === 0}
                        className="px-2 text-xl"
                        title="Move up"
                      >
                        ⬆️
                      </button>
                      <button
                        onClick={() => moveCustomSection(id, 1)}
                        disabled={idx === selectedSections.length - 1}
                        className="px-2 text-xl"
                        title="Move down"
                      >
                        ⬇️
                      </button>
                      <button
                        onClick={() => deleteCustomSection(id)}
                        className="px-2 text-xl text-red-500"
                        title="Delete"
                      >
                        🗑️
                      </button>
                    </div>
                    <MarkdownEditor
                      id={id}
                      label=""
                      value={cs.value}
                      onChange={(sectionId, value) =>
                        updateCustomSection(sectionId, "value", value)
                      }
                    />
                  </div>
                );
              })}
            </div>

            <button
              onClick={copyToClipboard}
              className="mt-6 w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-xl font-semibold shadow-lg shadow-blue-300/50 transition-all"
            >
              {copied ? "✅ Copied!" : "📋 Copy Markdown"}
            </button>
          </div>

          {/* Preview */}
          <div className="bg-white/30 dark:bg-white/10 backdrop-blur-md rounded-2xl shadow-xl p-6 border border-white/20">
            <h2 className="text-2xl font-semibold mb-4 text-blue-800 dark:text-blue-300">
              Live Preview
            </h2>
            <div className="prose dark:prose-invert max-w-none">
              <ReactMarkdown>{markdown}</ReactMarkdown>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
