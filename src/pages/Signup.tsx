import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import { Brain, BrainCircuit, Rocket, Sparkles } from "lucide-react";

const Signup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const { signUp, loading } = useAuth();
  const navigate = useNavigate();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      await signUp(email, password, name);
      navigate("/dashboard");
    } catch (error) {
      console.error("Signup error:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-purple-50 dark:from-gray-900 dark:to-purple-950 flex items-center justify-center p-4 overflow-hidden">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="container mx-auto flex flex-col lg:flex-row items-center justify-center gap-8"
      >
        {/* Left Side - Form */}
        <motion.div
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="w-full lg:w-1/2 max-w-md"
        >
          <Card className="border border-purple-100 dark:border-purple-900 shadow-lg hover:shadow-xl transition-shadow duration-300">
            <CardHeader className="space-y-1">
              <motion.div 
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="flex flex-col items-center"
              >
                <div className="p-3 rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 mb-4">
                  <BrainCircuit className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-2xl font-bold text-center text-purple-900 dark:text-purple-200">
                  Create an Account
                </CardTitle>
                <CardDescription className="text-center text-gray-600 dark:text-gray-400">
                  Join Academic AI to enhance your learning experience
                </CardDescription>
              </motion.div>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSignup} className="space-y-4">
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="space-y-2"
                >
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="John Doe"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="focus:ring-2 focus:ring-purple-500"
                  />
                </motion.div>
                
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="space-y-2"
                >
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="your.email@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="focus:ring-2 focus:ring-purple-500"
                  />
                </motion.div>
                
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  className="space-y-2"
                >
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="focus:ring-2 focus:ring-purple-500"
                  />
                </motion.div>
                
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 }}
                >
                  <Button
                    type="submit"
                    className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white shadow-lg hover:shadow-purple-500/20 transition-all"
                    disabled={loading}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <AnimatePresence mode="wait">
                      {loading ? (
                        <motion.span
                          key="loading"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="flex items-center gap-2"
                        >
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                          >
                            <Sparkles className="h-4 w-4" />
                          </motion.div>
                          Creating account...
                        </motion.span>
                      ) : (
                        <motion.span
                          key="default"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="flex items-center gap-2"
                        >
                          <Brain className="h-4 w-4" />
                          Create account
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </Button>
                </motion.div>
              </form>
            </CardContent>
            <CardFooter className="flex flex-col">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
                className="text-center text-sm text-gray-600 dark:text-gray-400"
              >
                Already have an account?{" "}
                <Link 
                  to="/login" 
                  className="text-purple-600 hover:text-purple-800 dark:text-purple-400 dark:hover:text-purple-300 font-medium transition-colors"
                >
                  Sign in
                </Link>
              </motion.div>
            </CardFooter>
          </Card>
        </motion.div>

        {/* Right Side - AI Visuals */}
        <motion.div
          initial={{ x: 50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="w-full lg:w-1/2 hidden lg:flex flex-col items-center justify-center p-8"
        >
          <div className="relative w-full max-w-xl">
            {/* Floating AI Elements */}
            <motion.div
              animate={{
                y: [0, -15, 0],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="absolute -top-20 left-0 bg-gradient-to-r from-purple-400 to-indigo-400 dark:from-purple-600 dark:to-indigo-600 rounded-full h-32 w-32 opacity-20 blur-xl"
            />
            
            <motion.div
              animate={{
                y: [0, 15, 0],
              }}
              transition={{
                duration: 5,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 0.5
              }}
              className="absolute -bottom-20 right-0 bg-gradient-to-r from-indigo-400 to-purple-400 dark:from-indigo-600 dark:to-purple-600 rounded-full h-40 w-40 opacity-20 blur-xl"
            />
            
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="relative z-10"
            >
              <img 
                src="https://mymathsclub.com/wp-content/uploads/2024/07/0dc62925-e449-4108-9fa2-7c0823f7bb56.webp" 
                alt="AI Illustration"
                className="w-full h-auto max-h-[500px] object-contain"
              />
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.9 }}
              className="mt-8 text-center"
            >
              <h3 className="text-2xl font-bold text-purple-900 dark:text-purple-200 mb-2">
                Unlock Your Potential
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Join thousands of students using AI to accelerate their learning journey
              </p>
            </motion.div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Signup;