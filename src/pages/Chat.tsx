import { useState, useRef, useEffect } from 'react';
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createClient } from '@supabase/supabase-js';
import { useNavigate } from "react-router-dom";
import { AzureKeyCredential } from "@azure/core-auth";
import ModelClient, { isUnexpected } from "@azure-rest/ai-inference";
import { Loader2, Mic, Paperclip, Send, Sparkles, Trash2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL || '',
  import.meta.env.VITE_SUPABASE_ANON_KEY || ''
);

interface Message {
  id: string;
  content: string;
  sender: "user" | "assistant";
  timestamp: Date;
}

const Chat = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  // Initialize Azure Inference client
  const inferenceClient = ModelClient(
    "https://models.inference.ai.azure.com",
    new AzureKeyCredential(import.meta.env.VITE_AZURE_INFERENCE_KEY || '')
  );

  // Check auth state and load session if ID exists
  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      
      const params = new URLSearchParams(window.location.search);
      const sessionId = params.get('session_id');
      
      if (sessionId) {
        loadSession(sessionId);
      }
    };
    checkUser();
  }, []);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const loadSession = async (sessionId: string) => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('chat_sessions')
        .select('*')
        .eq('id', sessionId)
        .single();

      if (data) {
        setMessages(data.messages.map((msg: any) => ({
          ...msg,
          timestamp: new Date(msg.timestamp)
        })));
        setCurrentSessionId(sessionId);
      }
    } catch (error) {
      console.error('Error loading session:', error);
      toast({
        title: "Error loading chat",
        description: "Could not load the chat session",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const transcribeAudio = async (file: File) => {
    setIsTranscribing(true);
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('https://api.deepgram.com/v1/listen', {
        method: 'POST',
        headers: {
          'Authorization': `Token ${import.meta.env.VITE_DEEPGRAM_API_KEY}`,
        },
        body: formData
      });

      if (!response.ok) throw new Error('Transcription failed');

      const data = await response.json();
      const transcription = data.results.channels[0].alternatives[0].transcript;

      const newMessage = {
        id: Date.now().toString(),
        content: transcription,
        sender: 'user' as const,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, newMessage]);
      setInputValue('');

    } catch (error) {
      console.error('Transcription failed:', error);
      toast({
        title: "Transcription error",
        description: "Could not transcribe the audio file",
        variant: "destructive"
      });
    } finally {
      setIsTranscribing(false);
    }
  };

  const getAIResponse = async (userMessage: string) => {
    try {
      const response = await inferenceClient.path("/chat/completions").post({
        body: {
          messages: [
            { role: "system", content: "You are a helpful AI assistant." },
            { role: "user", content: userMessage }
          ],
          model: "DeepSeek-R1",
          max_tokens: 2048,
        }
      });

      if (isUnexpected(response)) {
        throw response.body.error;
      }
      
      return response.body.choices[0].message.content;
    } catch (error) {
      console.error('AI response error:', error);
      throw error;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const userMessage = {
      id: Date.now().toString(),
      content: inputValue,
      sender: 'user' as const,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      const aiResponse = await getAIResponse(inputValue);
      
      const aiMessage = {
        id: (Date.now() + 1).toString(),
        content: aiResponse,
        sender: 'assistant' as const,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('Error getting AI response:', error);
      toast({
        title: "AI Error",
        description: "Failed to get response from AI",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file?.type.startsWith('audio/')) {
      transcribeAudio(file);
    }
    // Reset file input
    if (e.target) e.target.value = '';
  };

  const saveChatSession = async () => {
    if (!user) {
      navigate('/auth/signin');
      return;
    }
    
    setIsSaving(true);
    try {
      if (currentSessionId) {
        // Update existing session
        const { error } = await supabase
          .from('chat_sessions')
          .update({
            messages: messages,
            updated_at: new Date().toISOString()
          })
          .eq('id', currentSessionId);

        if (error) throw error;
        setSaveStatus('Chat updated successfully!');
        toast({
          title: "Chat saved",
          description: "Your chat has been updated",
        });
      } else {
        // Create new session
        const { data, error } = await supabase
          .from('chat_sessions')
          .insert({
            user_id: user.id,
            title: messages[0]?.content.substring(0, 50) || `Chat ${new Date().toLocaleString()}`,
            messages: messages
          })
          .select();

        if (error) throw error;
        setCurrentSessionId(data[0].id);
        setSaveStatus('Chat saved successfully!');
        navigate(`/chat?session_id=${data[0].id}`);
        toast({
          title: "Chat saved",
          description: "Your new chat has been saved",
        });
      }
    } catch (error) {
      console.error('Save error:', error);
      setSaveStatus('Failed to save chat');
      toast({
        title: "Save error",
        description: "Could not save the chat session",
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
      setTimeout(() => setSaveStatus(null), 3000);
    }
  };

  const clearChat = () => {
    setMessages([]);
    setCurrentSessionId(null);
    navigate('/chat');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-purple-50 dark:from-gray-900 dark:to-purple-950 flex flex-col">
      <div className="container mx-auto px-4 py-4 flex-grow flex flex-col">
        {/* Header with Save Button */}
        <div className="flex justify-between items-center mb-4">
          <CardTitle className="text-2xl font-bold text-purple-600 dark:text-purple-400">
            {currentSessionId ? 'Chat Session' : 'New Chat'}
          </CardTitle>
          <div className="flex items-center gap-2">
            {saveStatus && (
              <motion.span 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className={`text-sm ${
                  saveStatus.includes('Failed') 
                    ? 'text-red-500 dark:text-red-400' 
                    : 'text-green-600 dark:text-green-400'
                }`}
              >
                {saveStatus}
              </motion.span>
            )}
            <Button
              variant="outline"
              onClick={clearChat}
              disabled={messages.length === 0}
              className="text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Clear
            </Button>
            <Button
              variant="default"
              onClick={saveChatSession}
              disabled={isSaving || messages.length === 0}
            >
              {isSaving ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4 mr-2" />
                  Save Chat
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Chat Messages */}
        <Card className="flex-grow flex flex-col border border-purple-100 dark:border-purple-900 mb-4">
          <CardContent className="p-4 flex-grow overflow-y-auto">
            <div className="space-y-4 pb-2">
              {messages.length === 0 && !isLoading && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex flex-col items-center justify-center h-full text-center py-8"
                >
                  <div className="bg-purple-100 dark:bg-purple-900/30 p-6 rounded-full mb-4">
                    <Sparkles className="h-10 w-10 text-purple-600 dark:text-purple-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Start a new conversation
                  </h3>
                  <p className="text-gray-500 dark:text-gray-400 max-w-md">
                    Ask questions, upload audio, or discuss topics with the AI assistant.
                  </p>
                </motion.div>
              )}

              {messages.map((message, index) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2, delay: index * 0.05 }}
                  className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
                >
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    className={`max-w-[90%] rounded-lg px-4 py-3 shadow-sm ${
                      message.sender === "user"
                        ? "bg-purple-600 text-white"
                        : "bg-gray-100 dark:bg-gray-800"
                    }`}
                  >
                    <p className="whitespace-pre-wrap break-words">{message.content}</p>
                    <div
                      className={`text-xs mt-1 ${
                        message.sender === "user" 
                          ? "text-purple-200" 
                          : "text-gray-500 dark:text-gray-400"
                      }`}
                    >
                      {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </motion.div>
                </motion.div>
              ))}
              
              {isLoading && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex justify-start"
                >
                  <div className="px-4 py-3 bg-gray-100 dark:bg-gray-800 rounded-lg">
                    <motion.div
                      animate={{ 
                        rotate: [0, 360],
                      }}
                      transition={{ 
                        duration: 1.5,
                        repeat: Infinity,
                        ease: "linear"
                      }}
                    >
                      <Loader2 className="h-5 w-5 text-purple-600" />
                    </motion.div>
                  </div>
                </motion.div>
              )}
              
              {isTranscribing && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex justify-start"
                >
                  <div className="px-4 py-3 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <p>Transcribing audio...</p>
                  </div>
                </motion.div>
              )}
              
              <div ref={messagesEndRef} />
            </div>
          </CardContent>
        </Card>

        {/* Input Area */}
        <motion.div 
          className="flex gap-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Button
            variant="outline"
            onClick={() => fileInputRef.current?.click()}
            disabled={isTranscribing}
            className="gap-2"
          >
            {isTranscribing ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Mic className="h-4 w-4" />
            )}
            Audio
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              className="hidden"
              accept="audio/*"
            />
          </Button>
          
          <form onSubmit={handleSubmit} className="flex gap-2 flex-grow">
            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Type your message..."
              className="flex-grow"
              disabled={isLoading || isTranscribing}
            />
            <Button 
              type="submit" 
              disabled={!inputValue.trim() || isLoading || isTranscribing}
              className="gap-2"
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
              Send
            </Button>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default Chat;