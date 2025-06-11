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
    <div className="min-h-screen bg-gray-100 p-6 text-gray-800">
      <h1 className="text-3xl font-bold mb-4 text-center">📝 README Generator</h1>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Left Panel */}
        <div className="bg-white rounded-2xl shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Select Sections</h2>
          <div className="space-y-2">
            {sectionOptions.map((section) => (
              <label key={section.id} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={selectedSections.includes(section.id)}
                  onChange={() => toggleSection(section.id)}
                  className="accent-blue-500"
                />
                {section.label}
              </label>
            ))}
          </div>

          <div className="mt-6 space-y-4">
            {selectedSections.map((sectionId) => (
              <div key={sectionId}>
                <label className="block font-medium mb-1">
                  {sectionOptions.find((s) => s.id === sectionId)?.label}
                </label>
                <textarea
                  rows={3}
                  className="w-full p-2 border rounded-md"
                  value={formData[sectionId] || ""}
                  onChange={(e) => handleChange(sectionId, e.target.value)}
                  placeholder={`Enter ${sectionId}...`}
                />
              </div>
            ))}
          </div>

          <button
            onClick={copyToClipboard}
            className="mt-6 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
          >
            {copied ? "Copied!" : "Copy Markdown"}
          </button>
        </div>

        {/* Right Panel */}
        <div className="bg-white rounded-2xl shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Live Preview</h2>
          <div className="prose max-w-none">
            <ReactMarkdown>{markdown}</ReactMarkdown>
          </div>
        </div>
      </div>
    </div>
  );
}
