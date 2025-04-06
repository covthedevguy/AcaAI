import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { createClient } from '@supabase/supabase-js';
import { motion, AnimatePresence } from "framer-motion";
import { 
  MessageSquare, 
  Plus, 
  FileUp, 
  History, 
  ChevronRight,
  Loader2,
  Sparkles,
  BrainCircuit
} from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL || '',
  import.meta.env.VITE_SUPABASE_ANON_KEY || ''
);

interface ChatSession {
  id: string;
  title: string;
  created_at: string;
  messages: any[];
}

interface Document {
  id: string;
  name: string;
  created_at: string;
  size: number;
  status: 'processed' | 'processing' | 'failed';
}

const Dashboard = () => {
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<'chats' | 'documents'>('chats');

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };
    checkUser();
  }, []);

  useEffect(() => {
    if (!user) return;

    const loadData = async () => {
      setLoading(true);
      
      // Load chat sessions
      const { data: sessionData } = await supabase
        .from('chat_sessions')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { descending: true });

      // Load documents
      const { data: documentData } = await supabase
        .from('documents')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { descending: true });

      if (sessionData) setSessions(sessionData);
      if (documentData) setDocuments(documentData);
      
      setLoading(false);
    };

    loadData();
  }, [user]);

  // Prepare document history data for chart
  const documentHistoryData = documents.reduce((acc, doc) => {
    const date = new Date(doc.created_at).toLocaleDateString();
    const existing = acc.find(item => item.date === date);
    if (existing) {
      existing.count++;
    } else {
      acc.push({ date, count: 1 });
    }
    return acc;
  }, [] as {date: string; count: number}[]).slice(0, 7).reverse();

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="py-6 px-4 max-w-6xl mx-auto"
    >
      {/* Header */}
      <motion.div 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="mb-8"
      >
        <div className="flex items-center gap-3 mb-2">
          <BrainCircuit className="h-8 w-8 text-purple-600" />
          <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
            {user ? `Welcome back, ${user.email.split('@')[0]}` : 'Academic AI Dashboard'}
          </h1>
        </div>
        <p className="text-gray-600 dark:text-gray-400">
          {user ? 'Manage your learning resources and history' : 'Please sign in to access your dashboard'}
        </p>
      </motion.div>

      {!user && (
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mb-8"
        >
          <Button 
            onClick={() => supabase.auth.signInWithPassword({
              email: 'user@example.com',
              password: 'password'
            })}
            className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
          >
            Sign In
          </Button>
        </motion.div>
      )}

      {user && (
        <>
          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8"
          >
            <Link to="/chat" className="block h-full">
              <motion.div 
                whileHover={{ y: -5 }}
                className="h-full"
              >
                <Card className="h-full border border-purple-100 dark:border-purple-900/50 hover:border-purple-300 dark:hover:border-purple-700 transition-all shadow-sm hover:shadow-md">
                  <CardHeader className="flex flex-row items-center gap-4">
                    <div className="p-3 rounded-lg bg-purple-100 dark:bg-purple-900/30">
                      <MessageSquare className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                    </div>
                    <div>
                      <CardTitle className="text-purple-800 dark:text-purple-200">
                        New Chat
                      </CardTitle>
                      <CardDescription>
                        Start a new conversation with AI
                      </CardDescription>
                    </div>
                    <ChevronRight className="ml-auto h-5 w-5 text-gray-400" />
                  </CardHeader>
                </Card>
              </motion.div>
            </Link>

            <Link to="/upload" className="block h-full">
              <motion.div 
                whileHover={{ y: -5 }}
                className="h-full"
              >
                <Card className="h-full border border-purple-100 dark:border-purple-900/50 hover:border-purple-300 dark:hover:border-purple-700 transition-all shadow-sm hover:shadow-md">
                  <CardHeader className="flex flex-row items-center gap-4">
                    <div className="p-3 rounded-lg bg-purple-100 dark:bg-purple-900/30">
                      <FileUp className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                    </div>
                    <div>
                      <CardTitle className="text-purple-800 dark:text-purple-200">
                        Upload Document
                      </CardTitle>
                      <CardDescription>
                        Add new material for AI analysis
                      </CardDescription>
                    </div>
                    <ChevronRight className="ml-auto h-5 w-5 text-gray-400" />
                  </CardHeader>
                </Card>
              </motion.div>
            </Link>
          </motion.div>

          {/* Tabs */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="flex border-b border-gray-200 dark:border-gray-700 mb-6"
          >
            <button
              onClick={() => setActiveTab('chats')}
              className={`px-4 py-2 font-medium text-sm flex items-center gap-2 ${activeTab === 'chats' ? 'text-purple-600 border-b-2 border-purple-600 dark:text-purple-400 dark:border-purple-400' : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'}`}
            >
              <MessageSquare className="h-4 w-4" />
              Chat History
            </button>
            <button
              onClick={() => setActiveTab('documents')}
              className={`px-4 py-2 font-medium text-sm flex items-center gap-2 ${activeTab === 'documents' ? 'text-purple-600 border-b-2 border-purple-600 dark:text-purple-400 dark:border-purple-400' : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'}`}
            >
              <FileUp className="h-4 w-4" />
              Document History
            </button>
          </motion.div>

          {/* Content Area */}
          <AnimatePresence mode="wait">
            {activeTab === 'chats' ? (
              <motion.div
                key="chats"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                transition={{ duration: 0.2 }}
              >
                <Card className="border border-purple-100 dark:border-purple-900/50 shadow-sm">
                  <CardContent className="p-4">
                    {loading ? (
                      <div className="flex justify-center py-10">
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                        >
                          <Loader2 className="h-8 w-8 text-purple-600 animate-spin" />
                        </motion.div>
                      </div>
                    ) : sessions.length > 0 ? (
                      <div className="space-y-3">
                        {sessions.map((session, index) => (
                          <motion.div
                            key={session.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 * index }}
                          >
                            <Link 
                              to={`/chat?session_id=${session.id}`} 
                              className="block p-4 rounded-lg border border-transparent hover:border-purple-200 dark:hover:border-purple-900/50 hover:bg-purple-50/50 dark:hover:bg-purple-900/10 transition-all"
                            >
                              <div className="flex items-center gap-3">
                                <div className="p-2 rounded-full bg-purple-100 dark:bg-purple-900/30">
                                  <MessageSquare className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <h3 className="font-medium truncate">{session.title || "Untitled Chat"}</h3>
                                  <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                                    {new Date(session.created_at).toLocaleString()} • {session.messages?.length || 0} messages
                                  </p>
                                </div>
                                <ChevronRight className="h-5 w-5 text-gray-400" />
                              </div>
                            </Link>
                          </motion.div>
                        ))}
                      </div>
                    ) : (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-center py-10"
                      >
                        <div className="mx-auto w-16 h-16 rounded-full bg-purple-100 dark:bg-purple-900/20 flex items-center justify-center mb-4">
                          <Sparkles className="h-8 w-8 text-purple-600 dark:text-purple-400" />
                        </div>
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-1">
                          No chat history yet
                        </h3>
                        <p className="text-gray-500 dark:text-gray-400">
                          Start a new chat to see your conversations here
                        </p>
                      </motion.div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            ) : (
              <motion.div
                key="documents"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.2 }}
              >
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="lg:col-span-2">
                    <Card className="border border-purple-100 dark:border-purple-900/50 shadow-sm h-full">
                      <CardHeader>
                        <CardTitle className="text-purple-800 dark:text-purple-200 flex items-center gap-2">
                          <History className="h-5 w-5" />
                          Recent Documents
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        {loading ? (
                          <div className="flex justify-center py-10">
                            <motion.div
                              animate={{ rotate: 360 }}
                              transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                            >
                              <Loader2 className="h-8 w-8 text-purple-600 animate-spin" />
                            </motion.div>
                          </div>
                        ) : documents.length > 0 ? (
                          <div className="space-y-3">
                            {documents.map((doc, index) => (
                              <motion.div
                                key={doc.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1 * index }}
                              >
                                <div className="p-4 rounded-lg border border-transparent hover:border-purple-200 dark:hover:border-purple-900/50 hover:bg-purple-50/50 dark:hover:bg-purple-900/10 transition-all">
                                  <div className="flex items-center gap-3">
                                    <div className={`p-2 rounded-full ${
                                      doc.status === 'processed' ? 'bg-green-100 dark:bg-green-900/20' :
                                      doc.status === 'processing' ? 'bg-blue-100 dark:bg-blue-900/20' :
                                      'bg-red-100 dark:bg-red-900/20'
                                    }`}>
                                      <FileUp className={`h-4 w-4 ${
                                        doc.status === 'processed' ? 'text-green-600 dark:text-green-400' :
                                        doc.status === 'processing' ? 'text-blue-600 dark:text-blue-400' :
                                        'text-red-600 dark:text-red-400'
                                      }`} />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                      <h3 className="font-medium truncate">{doc.name}</h3>
                                      <p className="text-sm text-gray-500 dark:text-gray-400">
                                        {new Date(doc.created_at).toLocaleString()} • {(doc.size / 1024).toFixed(1)} KB
                                      </p>
                                    </div>
                                    <span className={`text-xs px-2 py-1 rounded-full ${
                                      doc.status === 'processed' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' :
                                      doc.status === 'processing' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300' :
                                      'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
                                    }`}>
                                      {doc.status.charAt(0).toUpperCase() + doc.status.slice(1)}
                                    </span>
                                  </div>
                                </div>
                              </motion.div>
                            ))}
                          </div>
                        ) : (
                          <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="text-center py-10"
                          >
                            <div className="mx-auto w-16 h-16 rounded-full bg-purple-100 dark:bg-purple-900/20 flex items-center justify-center mb-4">
                              <FileUp className="h-8 w-8 text-purple-600 dark:text-purple-400" />
                            </div>
                            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-1">
                              No documents uploaded yet
                            </h3>
                            <p className="text-gray-500 dark:text-gray-400">
                              Upload your first document to get started
                            </p>
                          </motion.div>
                        )}
                      </CardContent>
                    </Card>
                  </div>

                  <div>
                    <Card className="border border-purple-100 dark:border-purple-900/50 shadow-sm h-full">
                      <CardHeader>
                        <CardTitle className="text-purple-800 dark:text-purple-200">
                          Upload Activity
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        {documents.length > 0 ? (
                          <div className="h-64">
                            <ResponsiveContainer width="100%" height="100%">
                              <BarChart data={documentHistoryData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                <XAxis dataKey="date" />
                                <YAxis />
                                <Tooltip />
                                <Bar 
                                  dataKey="count" 
                                  fill="#8884d8" 
                                  radius={[4, 4, 0, 0]}
                                  animationBegin={100}
                                  animationDuration={1500}
                                >
                                  {documentHistoryData.map((entry, index) => (
                                    <motion.cell
                                      key={`cell-${index}`}
                                      initial={{ height: 0 }}
                                      animate={{ height: '100%' }}
                                      transition={{ duration: 0.5, delay: index * 0.1 }}
                                    />
                                  ))}
                                </Bar>
                              </BarChart>
                            </ResponsiveContainer>
                          </div>
                        ) : (
                          <div className="h-64 flex items-center justify-center text-gray-500 dark:text-gray-400">
                            Upload data will appear here
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </>
      )}
    </motion.div>
  );
};

export default Dashboard;