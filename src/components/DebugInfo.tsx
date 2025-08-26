"use client";

import { useSession } from "next-auth/react";
import { useState } from "react";

export default function DebugInfo() {
  const { data: session, status } = useSession();
  const [apiResponse, setApiResponse] = useState<any>(null);
  const [apiError, setApiError] = useState<string | null>(null);

  const testApiCall = async () => {
    try {
      setApiError(null);
      const response = await fetch('/api/spotify/top-artists');
      const data = await response.json();
      setApiResponse(data);
    } catch (error) {
      setApiError(error instanceof Error ? error.message : 'Unknown error');
    }
  };

  if (process.env.NODE_ENV === 'production') {
    return null; // Don't show debug info in production
  }

  return (
    <div className="fixed bottom-4 right-4 bg-black bg-opacity-90 text-white p-4 rounded-lg max-w-md text-xs font-mono z-50">
      <h3 className="font-bold mb-2">Debug Info</h3>
      
      <div className="mb-2">
        <strong>Session Status:</strong> {status}
      </div>
      
      <div className="mb-2">
        <strong>Has Session:</strong> {session ? 'Yes' : 'No'}
      </div>
      
      {session && (
        <div className="mb-2">
          <strong>User:</strong> {session.user?.name || 'Unknown'}
        </div>
      )}
      
      {session?.accessToken && (
        <div className="mb-2">
          <strong>Has Access Token:</strong> Yes
          <br />
          <strong>Token Preview:</strong> {session.accessToken.substring(0, 20)}...
        </div>
      )}
      
      <button
        onClick={testApiCall}
        className="bg-blue-500 hover:bg-blue-600 text-white px-2 py-1 rounded text-xs mb-2"
      >
        Test API Call
      </button>
      
      {apiResponse && (
        <div className="mb-2">
          <strong>API Response:</strong>
          <pre className="text-xs mt-1 overflow-auto max-h-20">
            {JSON.stringify(apiResponse, null, 2)}
          </pre>
        </div>
      )}
      
      {apiError && (
        <div className="text-red-400">
          <strong>API Error:</strong> {apiError}
        </div>
      )}
    </div>
  );
}
