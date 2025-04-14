import React from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";

const SnippetViewer = ({ snippet }) => {
  return (
    <div className="w-full max-w-3xl bg-gray-800 p-6 rounded-2xl shadow-lg">
      <h1 className="text-2xl font-bold mb-2">{snippet.title}</h1>
      
      <p className="text-sm text-gray-400 mb-4">
        Language: <span className="capitalize">{snippet.language}</span>
      </p>

      <SyntaxHighlighter
        language={snippet.language}
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
