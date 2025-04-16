import React, { useEffect, useState } from "react";
import NewSnippetModal from "./NewSnippetModal";
import SnippetViewer from "./SnippetViewer";
import supabase from "../helper/supabaseClient";
import { useNavigate } from "react-router-dom";
import toast from 'react-hot-toast';
import { FiShare2 } from 'react-icons/fi';

const MainPage = () => {
  const [showModal, setShowModal] = useState(false);
  const [snippets, setSnippets] = useState([]);
  const [selectedSnippet, setSelectedSnippet] = useState(null);
  const [userEmail, setUserEmail] = useState(null);
  const [fetchError, setFetchError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCurrentUserEmail = async () => {
      const { data: { user }, error: authError } = await supabase.auth.getUser();

      if (authError) {
        setFetchError("Couldn't fetch user session.");
        setUserEmail(null);
        console.error("Auth error:", authError);
        return;
      }

      if (user) {
        setUserEmail(user.email); // Directly use the email from the user object
        setFetchError(null);
        console.log("User email:", user.email); // Log the email
      } else {
        setUserEmail(null);
        setFetchError("User not found.");
        console.warn("User not found.");
      }
    };

    fetchCurrentUserEmail();
  }, []);

  // Add this useEffect after your existing useEffect for email fetching
  useEffect(() => {
    const fetchSnippets = async () => {
      setLoading(true); // Start loading
      try {
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
          console.warn("No user found, cannot fetch snippets");
          return;
        }

        const { data, error } = await supabase
          .from('snippets')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (error) {
          console.error('Error fetching snippets:', error);
          setFetchError(error.message);
          return;
        }

        console.log('Fetched snippets:', data);
        setSnippets(data);
        setFetchError(null);
      } catch (error) {
        console.error('Error:', error);
        setFetchError('Failed to fetch snippets');
      } finally {
        setLoading(false); // Stop loading
      }
    };

    fetchSnippets();
  }, []); // Empty dependency array means this runs once when component mounts

  const handleDeleteSnippet = async (snippetId) => {
    const confirmDelete = () => new Promise((resolve, reject) => {
      toast((t) => (
        <div className="flex flex-col gap-3 bg-red-50 p-4 rounded-lg border-2 border-red-500">
          <div className="flex items-center gap-2">
            <span className="text-red-500 text-xl">⚠️</span>
            <p className="text-red-700 font-semibold">Warning: Delete Snippet?</p>
          </div>
          <p className="text-red-600 text-sm">This action cannot be undone!</p>
          <div className="flex gap-2 mt-2">
            <button
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md text-sm font-medium transition-colors"
              onClick={() => {
                toast.dismiss(t.id);
                resolve();
              }}
            >
              Yes, Delete
            </button>
            <button
              className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-md text-sm font-medium transition-colors"
              onClick={() => {
                toast.dismiss(t.id);
                reject();
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      ), { 
        duration: Infinity,
        style: {
          background: 'white',
          padding: '0',
          borderRadius: '8px',
        }
      });
    });
  
    try {
      await confirmDelete();
      // Get the current user first
      const { data: { user } } = await supabase.auth.getUser();
  
      if (!user) {
        toast.error("You must be logged in to delete snippets.");
        return;
      }
  
      // Delete the snippet
      const { error: deleteError } = await supabase
        .from('snippets')
        .delete()
        .match({ 
          id: snippetId,
          user_id: user.id  // Ensure we're only deleting the user's own snippets
        });
  
      if (deleteError) {
        toast.error('Error deleting snippet:', deleteError);
        setFetchError('Failed to delete snippet');
        return;
      }
  
      // Update local state after successful deletion
      setSnippets(snippets.filter(snippet => snippet.id !== snippetId));
      
      // Clear selected snippet if it was the one that was deleted
      if (selectedSnippet?.id === snippetId) {
        setSelectedSnippet(null);
      }
  
      toast.success('Snippet deleted successfully');
  
    } catch (error) {
      console.error('Error:', error);
      setFetchError('Failed to delete snippet');
    }
  };

  const navigate = useNavigate();

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    navigate("/login"); // Redirect to login page after sign out
  }

  const [editingSnippet, setEditingSnippet] = useState(null);

  // Add this handler
  const handleEdit = (snippet) => {
    setEditingSnippet(snippet);
    setShowModal(true);
  };

  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // Add a toggle function
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const languageIcons = {
    javascript: "⚡", // or "🟨"
    python: "🐍",
    java: "☕",
    cpp: "⚙️",
    html: "🌐",
    css: "🎨",
    jsx: "⚛️",
    typescript: "💪",
    json: "📦",
    sql: "🗄️",
    bash: "💻",
    markdown: "📝",
    default: "📄" // fallback icon
  };

  return (
    // Change the outer container to be responsive
    <div className="flex flex-col md:flex-row h-screen bg-gray-900 text-white relative">
    {/* Toggle Button - visible only on mobile */}
    <button
      onClick={toggleSidebar}
      className="md:hidden fixed top-4 right-4 z-50 p-2 rounded-lg bg-gray-700 hover:bg-gray-600"
    >
      {isSidebarOpen ? '×' : '☰'}
    </button>

    {/* Sidebar with dynamic classes */}
    <div className={`
      fixed md:relative w-full md:w-64 bg-gray-800 h-screen
      transition-transform duration-300 ease-in-out
      ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      border-r border-gray-700 flex flex-col p-4
      z-40 md:z-auto
    `}>
      <h2 className="text-xl font-bold mb-6">My Snippets</h2>
      
      {/* ...existing button and content... */}
      <button
        onClick={() => setShowModal(true)}
        className="mb-4 py-2 px-3 bg-[#eee] text-black hover:scale-105 transition rounded-lg text-sm font-semibold"
      >
        + New Snippet
      </button>

      <div className="flex-1 overflow-y-auto space-y-2 max-h-[70vh] md:max-h-[calc(100vh-200px)]">
      {snippets.map((snip) => (
        <div
          key={snip.id}
          className={`flex items-center justify-between p-2 rounded-lg ${
            selectedSnippet?.id === snip.id ? "bg-gray-700" : "bg-gray-800"
          } hover:bg-gray-700`}
        >
          <button
            onClick={() => {
              setSelectedSnippet(snip);
              if (window.innerWidth < 768) {
                setIsSidebarOpen(false);
              }
            }}
            className="text-left flex-1 truncate flex items-center gap-2"
          >
            <span className="text-lg" role="img" aria-label={snip.language}>
              {languageIcons[snip.language] || languageIcons.default}
            </span>
            <span className="truncate">{snip.title}</span>
          </button>
          <div className="flex gap-2">

            <button
              onClick={() => handleEdit(snip)}
              className="text-blue-400 hover:text-blue-500"
              title="Edit snippet"
            >
              ✏️
            </button>
            <button
              onClick={() => handleDeleteSnippet(snip.id)}
              className="text-red-400 hover:text-red-500"
              title="Delete snippet"
            >
              🗑️
            </button>
          </div>
        </div>
      ))}
      </div>
  
        {/* User info section */}
        <div className="mt-4 md:mt-6 text-sm text-gray-400">
          Logged in as <span className="text-white">{userEmail || "Loading..."}</span>
        </div>
        <button 
          onClick={signOut} 
          className="p-[8px] text-[14px] cursor-pointer bg-none mt-2 md:mt-[10px] border-2 border-[#eee] text-white rounded-[10px] w-[150px]"
        >
          Log out
        </button>
      </div>

      {isSidebarOpen && (
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
        onClick={() => setIsSidebarOpen(false)}
      />
    )}
  
      {/* Main Content - adjust for better responsiveness */}
      <div className="flex-1 h-[100vh] md:h-screen overflow-hidden">
        <div className="h-full p-4 md:p-8 overflow-y-auto">
          {selectedSnippet ? (
            <div className="max-w-[90vw] md:max-w-[1200px] mx-auto">
              <SnippetViewer snippet={selectedSnippet} />
            </div>
          ) : (
            <div className="text-center">
              <h1 className="text-2xl md:text-3xl font-bold mb-2">No Snippet Selected</h1>
              <p className="text-gray-400">Click a snippet to view its details.</p>
            </div>
          )}
        </div>
      </div>
  
      {/* Modal remains unchanged */}
      {showModal && (
    <NewSnippetModal
      onClose={() => {
        setShowModal(false);
        setEditingSnippet(null);
      }}
      onSave={(updatedSnippet) => {
        if (editingSnippet) {
          // Update existing snippet in the list
          setSnippets(snippets.map(s => 
            s.id === updatedSnippet.id ? updatedSnippet : s
          ));
          setEditingSnippet(null);
        } else {
          // Add new snippet to the list
          setSnippets([...snippets, updatedSnippet]);
        }
      }}
      editingSnippet={editingSnippet}
    />
  )}
    </div>
  );
};

export default MainPage;