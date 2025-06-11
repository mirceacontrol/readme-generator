import React, { useState } from "react";
import ReactMarkdown from "react-markdown";

const sectionOptions = [
  { id: "title", label: "Project Title" },
  { id: "description", label: "Description" },
  { id: "installation", label: "Installation" },
  { id: "usage", label: "Usage" },
  { id: "contact", label: "Contact Info" },
];

export default function App() {
  const [selectedSections, setSelectedSections] = useState([]);
  const [formData, setFormData] = useState({});
  const [copied, setCopied] = useState(false);

  const toggleSection = (id) => {
    setSelectedSections((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );
  };

  const handleChange = (id, value) => {
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const generateMarkdown = () => {
    let md = "";
    if (selectedSections.includes("title"))
      md += `# ${formData.title || "Your Project Title"}\n\n`;
    if (selectedSections.includes("description"))
      md += `${formData.description || "*Project description goes here.*"}\n\n`;
    if (selectedSections.includes("installation"))
      md += `## Installation\n${formData.installation || "Instructions"}\n\n`;
    if (selectedSections.includes("usage"))
      md += `## Usage\n${formData.usage || "How to use the app"}\n\n`;
    if (selectedSections.includes("contact"))
      md += `## Contact\n${formData.contact || "Your email or GitHub"}\n\n`;
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
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-blue-100 to-blue-200 text-gray-800 p-6 md:p-10">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-center text-blue-700 drop-shadow-md">
          📝 README Generator
        </h1>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Form Side */}
          <div className="bg-white/30 backdrop-blur-md rounded-2xl shadow-xl p-6 border border-white/20">
            <h2 className="text-2xl font-semibold mb-4 text-blue-800">Choose Sections</h2>

            <div className="space-y-2 mb-6">
              {sectionOptions.map((section) => (
                <label key={section.id} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={selectedSections.includes(section.id)}
                    onChange={() => toggleSection(section.id)}
                    className="accent-blue-500"
                  />
                  <span className="text-gray-900">{section.label}</span>
                </label>
              ))}
            </div>

            <div className="space-y-4">
              {selectedSections.map((id) => (
                <div key={id}>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {sectionOptions.find((s) => s.id === id)?.label}
                  </label>
                  <textarea
                    rows={3}
                    className="w-full p-3 border border-white/30 bg-white/20 text-gray-800 rounded-xl focus:ring-2 focus:ring-blue-400 backdrop-blur-sm placeholder-gray-500"
                    value={formData[id] || ""}
                    onChange={(e) => handleChange(id, e.target.value)}
                    placeholder={`Enter ${id} content...`}
                  />
                </div>
              ))}
            </div>

            <button
              onClick={copyToClipboard}
              className="mt-6 w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-xl font-semibold shadow-lg shadow-blue-300/50 transition-all duration-200"
            >
              {copied ? "✅ Copied!" : "📋 Copy Markdown"}
            </button>
          </div>

          {/* Preview Side */}
          <div className="bg-white/30 backdrop-blur-md rounded-2xl shadow-xl p-6 border border-white/20">
            <h2 className="text-2xl font-semibold mb-4 text-blue-800">Live Preview</h2>
            <div className="prose prose-blue max-w-none text-gray-900">
              <ReactMarkdown>{markdown}</ReactMarkdown>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
