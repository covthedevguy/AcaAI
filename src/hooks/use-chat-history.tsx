
import { useState, useEffect } from 'react';

export interface Message {
  id: string;
  content: string;
  sender: "user" | "ai";
  timestamp: Date;
}

export interface ChatSession {
  id: string;
  title: string;
  messages: Message[];
  createdAt: Date;
}

export const useChatHistory = (sessionId?: string | null) => {
  // Get stored sessions from localStorage
  const getStoredSessions = (): ChatSession[] => {
    const stored = localStorage.getItem("chatSessions");
    return stored ? JSON.parse(stored) : [];
  };

  const [sessions, setSessions] = useState<ChatSession[]>(getStoredSessions);
  const [currentSession, setCurrentSession] = useState<ChatSession | null>(null);

  // Initialize current session
  useEffect(() => {
    if (sessionId) {
      // Find existing session
      const existingSession = sessions.find(session => session.id === sessionId);
      if (existingSession) {
        setCurrentSession(existingSession);
      }
    } else {
      // Create new session
      const newSession: ChatSession = {
        id: Date.now().toString(),
        title: "New Conversation",
        messages: [
          {
            id: "1",
            content: "Hello! I'm your Academic AI assistant. How can I help with your studies today?",
            sender: "ai",
            timestamp: new Date(),
          }
        ],
        createdAt: new Date()
      };
      setCurrentSession(newSession);
    }
  }, [sessionId, sessions]);

  // Save sessions to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("chatSessions", JSON.stringify(sessions));
  }, [sessions]);

  // Generate a title based on the first user message
  const generateTitleFromMessage = (message: string): string => {
    // Truncate to first 30 characters if message is longer
    return message.length > 30 ? message.substring(0, 30) + "..." : message;
  };

  // Update or add a chat session
  const updateSession = (session: ChatSession) => {
    setSessions(prevSessions => {
      const existingIndex = prevSessions.findIndex(s => s.id === session.id);
      if (existingIndex >= 0) {
        // Update existing session
        const updated = [...prevSessions];
        updated[existingIndex] = session;
        return updated;
      } else {
        // Add new session
        return [...prevSessions, session];
      }
    });
  };

  // Delete a chat session
  const deleteSession = (sessionId: string) => {
    setSessions(prevSessions => prevSessions.filter(s => s.id !== sessionId));
    if (currentSession?.id === sessionId) {
      setCurrentSession(null);
    }
  };

  return {
    sessions,
    currentSession,
    setCurrentSession,
    updateSession,
    deleteSession,
    generateTitleFromMessage
  };
};

export default useChatHistory;
