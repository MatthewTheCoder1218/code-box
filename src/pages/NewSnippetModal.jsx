import React, { useState, useEffect } from "react";
import supabase from "../helper/supabaseClient";
import toast from 'react-hot-toast';

const NewSnippetModal = ({ onClose, onSave, editingSnippet = null }) => {
  const [title, setTitle] = useState("");
  const [language, setLanguage] = useState("javascript");
  const [code, setCode] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  // Load snippet data if editing
  useEffect(() => {
    if (editingSnippet) {
      setTitle(editingSnippet.title);
      setLanguage(editingSnippet.language);
      setCode(editingSnippet.code);
      setDescription(editingSnippet.description || "");
    }
  }, [editingSnippet]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !code) return;

    setError(null);
    setLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        setError("You must be logged in to save snippets.");
        setLoading(false);
        return;
      }

      const snippetData = {
        user_id: user.id,
        title,
        language,
        code,
        description: description.trim() === "" ? null : description,
      };

      let data, error;

      if (editingSnippet) {
        // Update existing snippet
        ({ data, error } = await supabase
          .from("snippets")
          .update(snippetData)
          .eq('id', editingSnippet.id)
          .select()
          .single());
      } else {
        // Insert new snippet
        ({ data, error } = await supabase
          .from("snippets")
          .insert([snippetData])
          .select()
          .single());
      }

      if (error) {
        toast.error("Error saving snippet:", error);
        setError(error.message);
      } else {
        toast.success("Snippet saved successfully");
        onSave(data);
        onClose();
      }
    } catch (err) {
      toast.error("An unexpected error occurred:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
      <div className="bg-gray-800 w-full max-w-xl p-6 rounded-2xl shadow-lg text-white">
        <h2 className="text-2xl font-bold mb-4">Create New Snippet</h2>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm text-gray-300 mb-1">Title</label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              type="text"
              placeholder="Snippet title"
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg placeholder-gray-400"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-300 mb-1">Language</label>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg"
            >
              <option value="javascript">JavaScript</option>
              <option value="python">Python</option>
            </select>
          </div>

          <div>
            <label className="block text-sm text-gray-300 mb-1">Code</label>
            <textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              rows={6}
              placeholder="Enter your code here..."
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg font-mono text-sm placeholder-gray-400"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-300 mb-1">Description (optional)</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={2}
              placeholder="Notes or usage info"
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-sm placeholder-gray-400"
            />
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-600 hover:bg-gray-700 rounded-lg text-sm"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-[#eee] text-black hover:scale-105 rounded-lg text-sm font-semibold"
              disabled={loading}
            >
              {loading ? "Saving..." : "Save Snippet"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewSnippetModal;