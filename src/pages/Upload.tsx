import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FileUp, ArrowLeft, File, Trash2, Loader2, Sparkles, Bot, Send } from "lucide-react";
import { Link, useSearchParams } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { Progress } from "@/components/ui/progress";

interface Document {
  id: string;
  name: string;
  size: number;
  type: string;
  uploadDate: Date;
  content?: string;
}

type MessageSender = 'user' | 'ai';

interface Message {
  id: string;
  text: string;
  sender: MessageSender;
  timestamp: Date;
}

const AZURE_INFERENCE_URL = "https://models.inference.ai.azure.com";

const Upload = () => {
  const [searchParams] = useSearchParams();
  const docId = searchParams.get("id");
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [documents, setDocuments] = useState<Document[]>(() => {
    const stored = localStorage.getItem("uploadedDocuments");
    return stored ? JSON.parse(stored) : [];
  });
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [currentDocument, setCurrentDocument] = useState<Document | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisComplete, setAnalysisComplete] = useState(false);
  const [chatMessages, setChatMessages] = useState<Message[]>([]);
  const [messageInput, setMessageInput] = useState("");
  const [showChat, setShowChat] = useState(false);

  // Helper function for creating messages
  const createMessage = (text: string, sender: MessageSender): Message => ({
    id: Date.now().toString(),
    text,
    sender,
    timestamp: new Date()
  });

  // Load document if ID is provided
  useEffect(() => {
    if (docId) {
      const doc = documents.find(d => d.id === docId);
      if (doc) {
        setCurrentDocument(doc);
      }
    }
  }, [docId, documents]);
  
  // Save documents to localStorage
  useEffect(() => {
    localStorage.setItem("uploadedDocuments", JSON.stringify(documents));
  }, [documents]);

  // Scroll to bottom of chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages]);

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFiles(e.target.files);
    }
  };

  const handleFiles = (files: FileList) => {
    const allowedTypes = ['application/pdf'];
    const filesArray = Array.from(files);
    
    const invalidFiles = filesArray.filter(file => !allowedTypes.includes(file.type));
    if (invalidFiles.length > 0) {
      toast({
        title: "Invalid file type",
        description: "Please upload PDF files only.",
        variant: "destructive",
      });
      return;
    }
    
    // Process each valid file
    filesArray.forEach(file => {
      simulateUpload(file);
    });
  };

  const simulateUpload = (file: File) => {
    setIsUploading(true);
    setUploadProgress(0);
    
    // Simulate upload progress
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        const newProgress = prev + Math.random() * 10;
        if (newProgress >= 100) {
          clearInterval(interval);
          
          // Add document to history
          const newDoc: Document = {
            id: Date.now().toString(),
            name: file.name,
            size: file.size,
            type: file.type,
            uploadDate: new Date(),
            content: "This is a simulated document content that would be extracted from the PDF. In a real application, this would be the actual text content extracted from the uploaded document."
          };
          
          setDocuments(prev => [...prev, newDoc]);
          setCurrentDocument(newDoc);
          setIsUploading(false);
          
          toast({
            title: "Upload complete",
            description: `${file.name} has been uploaded successfully.`,
          });
          
          return 100;
        }
        return newProgress;
      });
    }, 200);
  };

  const handleDeleteDocument = (id: string) => {
    setDocuments(prev => prev.filter(doc => doc.id !== id));
    if (currentDocument?.id === id) {
      setCurrentDocument(null);
      setAnalysisComplete(false);
      setChatMessages([]);
      setShowChat(false);
    }
    
    toast({
      title: "Document deleted",
      description: "The document has been removed from your history.",
    });
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' bytes';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  const analyzeDocument = async () => {
    if (!currentDocument) return;
    
    setIsAnalyzing(true);
    setAnalysisComplete(false);
    setChatMessages([]);
    
    try {
      // Call Azure Inference API for document analysis
      const response = await fetch(`${AZURE_INFERENCE_URL}/analyze`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${import.meta.env.VITE_AZURE_API_KEY}`,
          "API-Key": import.meta.env.VITE_AZURE_API_KEY // Some Azure APIs use this header
        },
        body: JSON.stringify({
          document: {
            title: currentDocument.name,
            content: currentDocument.content || "",
            metadata: {
              size: currentDocument.size,
              type: currentDocument.type
            }
          },
          analysis_type: "summary" // Can be extended to support different analysis types
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Analysis failed");
      }

      const data = await response.json();
      const analysis = data.result?.summary || data.analysis || "I couldn't analyze this document.";

      setChatMessages([
        createMessage(
          `I've analyzed "${currentDocument.name}". Here's what I found:\n\n${analysis}\n\nHow can I help you with this document?`,
          'ai'
        )
      ]);

      setAnalysisComplete(true);
      toast({
        title: "Analysis complete",
        description: "The document has been processed successfully.",
      });
    } catch (error) {
      console.error("Analysis error:", error);
      toast({
        title: "Analysis failed",
        description: error instanceof Error ? error.message : "Could not analyze the document.",
        variant: "destructive"
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageInput.trim() || !currentDocument) return;
    
    // Add user message
    const userMessage = createMessage(messageInput, 'user');
    setChatMessages(prev => [...prev, userMessage]);
    setMessageInput("");
    setIsAnalyzing(true);
    
    try {
      // Call Azure Inference API for chat
      const response = await fetch(`${AZURE_INFERENCE_URL}/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${import.meta.env.VITE_AZURE_API_KEY}`,
          "API-Key": import.meta.env.VITE_AZURE_API_KEY
        },
        body: JSON.stringify({
          document: {
            title: currentDocument.name,
            content: currentDocument.content || "",
            id: currentDocument.id
          },
          conversation_history: chatMessages.map(msg => ({
            role: msg.sender === 'user' ? 'user' : 'assistant',
            content: msg.text,
            timestamp: msg.timestamp.toISOString()
          })),
          question: messageInput,
          options: {
            response_length: "medium", // can be "short", "medium", "long"
            technical_depth: "general" // can be "general", "technical", "expert"
          }
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Chat failed");
      }

      const data = await response.json();
      const aiResponse = data.response?.answer || data.answer || "I couldn't generate a response.";

      // Add AI response
      const aiMessage = createMessage(aiResponse, 'ai');
      setChatMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error("Chat error:", error);
      toast({
        title: "Chat error",
        description: error instanceof Error ? error.message : "Failed to get AI response",
        variant: "destructive"
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    }
  };

  const cardHover = {
    scale: 1.02,
    boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
    transition: {
      duration: 0.3,
      ease: "easeOut"
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-gradient-to-br from-white to-purple-50 dark:from-gray-900 dark:to-purple-950"
    >
      <div className="container mx-auto px-4 py-8">
        <motion.div 
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="flex items-center mb-6"
        >
          <Link to="/dashboard" className="mr-4">
            <Button variant="outline" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-blue-600 dark:from-purple-400 dark:to-blue-400">
            Document Upload
          </h1>
        </motion.div>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          <motion.div variants={itemVariants}>
            <Card className="border border-purple-100 dark:border-purple-900 shadow-lg">
              <CardHeader>
                <CardTitle className="text-xl text-purple-800 dark:text-purple-300">
                  Upload Academic Document
                </CardTitle>
                <CardDescription>
                  Upload your academic papers, notes, or textbooks for AI analysis
                </CardDescription>
              </CardHeader>
              <CardContent>
                <motion.div
                  className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
                    isDragging
                      ? "border-purple-500 bg-purple-50 dark:bg-purple-900/30"
                      : "border-gray-300 dark:border-gray-700 hover:border-purple-400 dark:hover:border-purple-600"
                  }`}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  whileHover={{ scale: 1.01 }}
                >
                  <motion.div 
                    animate={{ y: isDragging ? [-5, 5, -5] : 0 }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                  >
                    <FileUp className="h-12 w-12 mx-auto mb-4 text-purple-600 dark:text-purple-400" />
                  </motion.div>
                  <p className="text-gray-600 dark:text-gray-400 mb-2">
                    Drag & drop your PDF file here
                  </p>
                  <p className="text-gray-500 dark:text-gray-500 text-sm mb-4">
                    or click to browse files
                  </p>
                  <Button
                    variant="outline"
                    className="bg-white dark:bg-gray-800"
                  >
                    Select File
                  </Button>
                  <input
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    accept=".pdf"
                    onChange={handleFileInputChange}
                    multiple
                  />
                </motion.div>

                {isUploading && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-6"
                  >
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Uploading...
                    </p>
                    <Progress value={uploadProgress} className="h-2" />
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 text-right">
                      {Math.round(uploadProgress)}%
                    </p>
                  </motion.div>
                )}
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={itemVariants}>
            <Card className="border border-purple-100 dark:border-purple-900 shadow-lg">
              <CardHeader>
                <CardTitle className="text-xl text-purple-800 dark:text-purple-300">
                  {currentDocument ? "Document Details" : "Recently Uploaded"}
                </CardTitle>
                <CardDescription>
                  {currentDocument 
                    ? "Information about the selected document" 
                    : "Your recent document uploads"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {currentDocument ? (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center">
                        <File className="h-12 w-12 text-purple-600 dark:text-purple-400 mr-3" />
                        <div>
                          <h3 className="font-medium text-gray-900 dark:text-gray-100">
                            {currentDocument.name}
                          </h3>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {formatFileSize(currentDocument.size)} • Uploaded {new Date(currentDocument.uploadDate).toLocaleString()}
                          </p>
                        </div>
                      </div>
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => handleDeleteDocument(currentDocument.id)}
                        className="text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                      >
                        <Trash2 className="h-5 w-5" />
                      </Button>
                    </div>
                    
                    <div className="mt-4 flex gap-2">
                      <Button 
                        className="bg-purple-600 hover:bg-purple-700 text-white"
                        onClick={analyzeDocument}
                        disabled={isAnalyzing}
                      >
                        {isAnalyzing ? (
                          <>
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            Analyzing...
                          </>
                        ) : (
                          <>
                            <Sparkles className="h-4 w-4 mr-2" />
                            {analysisComplete ? "Re-analyze" : "Analyze Document"}
                          </>
                        )}
                      </Button>
                      <Button 
                        variant="outline" 
                        onClick={() => setShowChat(!showChat)}
                        disabled={!analysisComplete}
                      >
                        <Bot className="h-4 w-4 mr-2" />
                        {showChat ? "Hide Chat" : "Chat About This"}
                      </Button>
                    </div>

                    {showChat && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        transition={{ duration: 0.3 }}
                        className="mt-4 border-t pt-4"
                      >
                        <div className="h-64 overflow-y-auto mb-4 space-y-4 pr-2">
                          {chatMessages.map((message) => (
                            <motion.div
                              key={message.id}
                              initial={{ opacity: 0, x: message.sender === 'user' ? 20 : -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                            >
                              <div 
                                className={`max-w-[80%] rounded-lg p-3 ${
                                  message.sender === 'user' 
                                    ? 'bg-purple-600 text-white rounded-br-none' 
                                    : 'bg-gray-200 dark:bg-gray-700 rounded-bl-none'
                                }`}
                              >
                                <p className="whitespace-pre-wrap">{message.text}</p>
                                <p className="text-xs opacity-70 mt-1">
                                  {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </p>
                              </div>
                            </motion.div>
                          ))}
                          {isAnalyzing && (
                            <motion.div
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              className="flex justify-start"
                            >
                              <div className="px-4 py-3 bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center gap-2">
                                <Loader2 className="h-4 w-4 animate-spin" />
                                <p>Thinking...</p>
                              </div>
                            </motion.div>
                          )}
                          <div ref={chatEndRef} />
                        </div>
                        
                        <form onSubmit={handleSendMessage} className="flex gap-2">
                          <input
                            type="text"
                            value={messageInput}
                            onChange={(e) => setMessageInput(e.target.value)}
                            placeholder="Ask about this document..."
                            className="flex-1 border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 dark:bg-gray-800"
                            disabled={isAnalyzing}
                          />
                          <Button 
                            type="submit" 
                            size="icon" 
                            className="bg-purple-600 hover:bg-purple-700"
                            disabled={!messageInput.trim() || isAnalyzing}
                          >
                            <Send className="h-4 w-4" />
                          </Button>
                        </form>
                      </motion.div>
                    )}
                  </motion.div>
                ) : (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    {documents.length > 0 ? (
                      <ul className="space-y-3">
                        {documents.map((doc) => (
                          <motion.li 
                            key={doc.id} 
                            className="flex items-center justify-between bg-gray-50 dark:bg-gray-800 p-3 rounded-lg"
                            whileHover={{ scale: 1.01 }}
                          >
                            <div className="flex items-center">
                              <File className="h-5 w-5 text-purple-600 dark:text-purple-400 mr-2" />
                              <span className="text-gray-700 dark:text-gray-300 truncate max-w-[150px]">
                                {doc.name}
                              </span>
                            </div>
                            <div className="flex items-center">
                              <Link to={`/upload?id=${doc.id}`}>
                                <Button variant="ghost" size="sm">
                                  View
                                </Button>
                              </Link>
                              <Button 
                                variant="ghost" 
                                size="icon"
                                onClick={() => handleDeleteDocument(doc.id)}
                                className="text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 ml-1"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </motion.li>
                        ))}
                      </ul>
                    ) : (
                      <div className="text-center py-6">
                        <p className="text-gray-500 dark:text-gray-400">
                          No documents uploaded yet
                        </p>
                      </div>
                    )}
                  </motion.div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Upload;