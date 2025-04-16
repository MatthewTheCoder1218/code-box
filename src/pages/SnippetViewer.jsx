import React from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { FiShare2, FiCopy } from 'react-icons/fi';
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import toast from 'react-hot-toast';

const LANGUAGE_MAP = {
  javascript: 'javascript',
  python: 'python',
  java: 'java',
  cpp: 'cpp',
  jsx: 'jsx',
  typescript: 'typescript',
  css: 'css',
  html: 'markup',
  json: 'json',
  sql: 'sql',
  bash: 'bash',
  markdown: 'markdown'
};

const SnippetViewer = ({ snippet }) => {

  const handleShare = async () => {
    try {
      const shareableUrl = `${window.location.origin}/share/${snippet.id}`;
      await navigator.clipboard.writeText(shareableUrl);
      toast.success('Link copied to clipboard!', {
        duration: 2000,
        icon: '🔗'
      });
    } catch (err) {
      console.error('Share error:', err);
      toast.error('Failed to copy link');
    }
  };

  return (
    <div className="w-full max-w-3xl bg-gray-800 p-6 rounded-2xl shadow-lg">
      <h1 className="text-2xl font-bold mb-2 text-[#eee]">{snippet.title}</h1>
      <div className="flex items-center justify-between">
      <p className="text-sm text-gray-400 mb-4">
        Language: <span className="capitalize">{snippet.language}</span>
      </p>
      <button
        onClick={handleShare} // Fix: Remove the arrow function
        className="text-blue-400 hover:text-blue-500"
        title="Share snippet"
      >
        <FiShare2 className="w-4 h-4" />
      </button>

      </div>

      <SyntaxHighlighter
        language={LANGUAGE_MAP[snippet.language]}
        style={vscDarkPlus}
        showLineNumbers
        customStyle={{ borderRadius: "12px", fontSize: "0.9rem" }}
      >
        {snippet.code}
      </SyntaxHighlighter>



      {snippet.description && (
        <div className="mt-6">
          <h2 className="text-lg font-semibold mb-1">Notes</h2>
          <p className="text-gray-300 text-sm">{snippet.description}</p>

        </div>
      )}
      
    </div>
  );
};

export default SnippetViewer;
