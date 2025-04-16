import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import supabase from '../helper/supabaseClient';
import SnippetViewer from './SnippetViewer';

const SharePage = () => {
  const { id } = useParams();
  const [snippet, setSnippet] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSharedSnippet = async () => {
      try {
        const { data, error } = await supabase
          .from('snippets')
          .select('*')
          .eq('id', id)
          .single();

        if (error) throw error;
        setSnippet(data);
      } catch (err) {
        setError('Snippet not found or inaccessible');
        console.error('Error fetching shared snippet:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchSharedSnippet();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white">Loading snippet...</div>
      </div>
    );
  }

  if (error || !snippet) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-red-500">{error || 'Snippet not found'}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center">
    <div className="max-w-[90vw] md:max-w-[1200px]">
      <SnippetViewer snippet={snippet} />
    </div>
  </div>
  );
};

export default SharePage;