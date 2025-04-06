import React from "react";
import { Link, useLocation } from "react-router-dom";
import { 
  Home, 
  FileUp, 
  MessageSquare, 
  User, 
  LogIn,
  LogOut, 
  DollarSign,
  ChevronDown,
  ChevronRight,
  Brain
} from "lucide-react";
import { 
  Sidebar as SidebarComponent, 
  SidebarContent, 
  SidebarMenu, 
  SidebarMenuItem, 
  SidebarMenuButton,
  SidebarMenuSub,
  SidebarProvider,
  SidebarTrigger,
  SidebarHeader,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarFooter,
  SidebarSeparator,
  SidebarInset,
  SidebarMenuSubItem
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface SidebarProps {
  children: React.ReactNode;
}

const AppSidebar = ({ children }: SidebarProps) => {
  const location = useLocation();
  const [chatExpanded, setChatExpanded] = React.useState(true);
  const [docsExpanded, setDocsExpanded] = React.useState(true);
  const { user, signOut } = useAuth();

  return (
    <SidebarProvider defaultOpen={true}>
      <div className="flex h-screen w-full">
        <SidebarComponent className="bg-gradient-to-b from-purple-50 to-white dark:from-purple-900/20 dark:to-gray-900 border-r border-purple-100 dark:border-purple-900/30 transition-all duration-300 ease-in-out">
          <SidebarHeader className="p-4">
            <Link to="/" className="flex items-center gap-2">
              <motion.div 
                className="h-8 w-8 rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 flex items-center justify-center shadow-lg"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Brain className="h-5 w-5 text-white" />
              </motion.div>
              <motion.span 
                className="font-bold text-lg bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent dark:from-purple-400 dark:to-indigo-400"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
              >
                Academic AI
              </motion.span>
            </Link>
          </SidebarHeader>
          
          <SidebarContent className="overflow-y-auto custom-scrollbar">
            <SidebarGroup>
              <SidebarGroupLabel className="text-xs font-semibold text-purple-500 dark:text-purple-400 uppercase tracking-wider px-4 mb-2">
                Navigation
              </SidebarGroupLabel>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton 
                    asChild 
                    tooltip="Home" 
                    isActive={location.pathname === "/"}
                    className="group transition-all duration-200"
                  >
                    <Link to="/">
                      <motion.div 
                        className="flex items-center gap-3"
                        whileHover={{ x: 3 }}
                      >
                        <div className={cn(
                          "p-1 rounded-lg bg-purple-100 dark:bg-purple-900/30 group-hover:bg-purple-200 dark:group-hover:bg-purple-800/50 transition-colors",
                          location.pathname === "/" && "bg-purple-200 dark:bg-purple-800/50"
                        )}>
                          <Home className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                        </div>
                        <span className="text-gray-700 dark:text-gray-300">Home</span>
                      </motion.div>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>

                <SidebarMenuItem>
                  <SidebarMenuButton 
                    asChild 
                    tooltip="Dashboard" 
                    isActive={location.pathname === "/dashboard"}
                    className="group transition-all duration-200"
                  >
                    <Link to="/dashboard">
                      <motion.div 
                        className="flex items-center gap-3"
                        whileHover={{ x: 3 }}
                      >
                        <div className={cn(
                          "p-1 rounded-lg bg-purple-100 dark:bg-purple-900/30 group-hover:bg-purple-200 dark:group-hover:bg-purple-800/50 transition-colors",
                          location.pathname === "/dashboard" && "bg-purple-200 dark:bg-purple-800/50"
                        )}>
                          <User className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                        </div>
                        <span className="text-gray-700 dark:text-gray-300">Dashboard</span>
                      </motion.div>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>

                <SidebarMenuItem>
                  <SidebarMenuButton 
                    tooltip="Chat"
                    isActive={location.pathname.includes("/chat")}
                    onClick={() => setChatExpanded(!chatExpanded)}
                    className="group transition-all duration-200"
                  >
                    <motion.div 
                      className="flex items-center gap-3 w-full"
                      whileHover={{ x: 3 }}
                    >
                      <div className={cn(
                        "p-1 rounded-lg bg-purple-100 dark:bg-purple-900/30 group-hover:bg-purple-200 dark:group-hover:bg-purple-800/50 transition-colors",
                        location.pathname.includes("/chat") && "bg-purple-200 dark:bg-purple-800/50"
                      )}>
                        <MessageSquare className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                      </div>
                      <span className="text-gray-700 dark:text-gray-300">Chat</span>
                      {chatExpanded ? 
                        <ChevronDown className="ml-auto h-4 w-4 text-gray-500 dark:text-gray-400 transition-transform" /> : 
                        <ChevronRight className="ml-auto h-4 w-4 text-gray-500 dark:text-gray-400 transition-transform" />
                      }
                    </motion.div>
                  </SidebarMenuButton>
                  
                  <AnimatePresence>
                    {chatExpanded && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <SidebarMenuSub>
                          <SidebarMenuSubItem>
                            <SidebarMenuButton 
                              asChild 
                              isActive={location.pathname === "/chat" && !location.search.includes('id=')}
                              className="pl-12 group transition-all duration-200"
                            >
                              <Link to="/chat">
                                <motion.span 
                                  className="text-gray-600 dark:text-gray-400 group-hover:text-purple-600 dark:group-hover:text-purple-400"
                                  whileHover={{ x: 3 }}
                                >
                                  New Chat
                                </motion.span>
                              </Link>
                            </SidebarMenuButton>
                          </SidebarMenuSubItem>
                        </SidebarMenuSub>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </SidebarMenuItem>

                <SidebarMenuItem>
                  <SidebarMenuButton 
                    tooltip="Documents" 
                    isActive={location.pathname.includes("/upload")}
                    onClick={() => setDocsExpanded(!docsExpanded)}
                    className="group transition-all duration-200"
                  >
                    <motion.div 
                      className="flex items-center gap-3 w-full"
                      whileHover={{ x: 3 }}
                    >
                      <div className={cn(
                        "p-1 rounded-lg bg-purple-100 dark:bg-purple-900/30 group-hover:bg-purple-200 dark:group-hover:bg-purple-800/50 transition-colors",
                        location.pathname.includes("/upload") && "bg-purple-200 dark:bg-purple-800/50"
                      )}>
                        <FileUp className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                      </div>
                      <span className="text-gray-700 dark:text-gray-300">Documents</span>
                      {docsExpanded ? 
                        <ChevronDown className="ml-auto h-4 w-4 text-gray-500 dark:text-gray-400 transition-transform" /> : 
                        <ChevronRight className="ml-auto h-4 w-4 text-gray-500 dark:text-gray-400 transition-transform" />
                      }
                    </motion.div>
                  </SidebarMenuButton>
                  
                  <AnimatePresence>
                    {docsExpanded && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <SidebarMenuSub>
                          <SidebarMenuSubItem>
                            <SidebarMenuButton 
                              asChild 
                              isActive={location.pathname === "/upload" && !location.search.includes('id=')}
                              className="pl-12 group transition-all duration-200"
                            >
                              <Link to="/upload">
                                <motion.span 
                                  className="text-gray-600 dark:text-gray-400 group-hover:text-purple-600 dark:group-hover:text-purple-400"
                                  whileHover={{ x: 3 }}
                                >
                                  Upload New
                                </motion.span>
                              </Link>
                            </SidebarMenuButton>
                          </SidebarMenuSubItem>
                        </SidebarMenuSub>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </SidebarMenuItem>

                <SidebarMenuItem>
                  <SidebarMenuButton 
                    asChild 
                    tooltip="Pricing" 
                    isActive={location.pathname === "/pricing"}
                    className="group transition-all duration-200"
                  >
                    <Link to="/pricing">
                      <motion.div 
                        className="flex items-center gap-3"
                        whileHover={{ x: 3 }}
                      >
                        <div className={cn(
                          "p-1 rounded-lg bg-purple-100 dark:bg-purple-900/30 group-hover:bg-purple-200 dark:group-hover:bg-purple-800/50 transition-colors",
                          location.pathname === "/pricing" && "bg-purple-200 dark:bg-purple-800/50"
                        )}>
                          <DollarSign className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                        </div>
                        <span className="text-gray-700 dark:text-gray-300">Pricing</span>
                      </motion.div>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroup>

            <SidebarSeparator className="my-2 bg-purple-100 dark:bg-purple-900/30" />

            <SidebarGroup>
              <SidebarGroupLabel className="text-xs font-semibold text-purple-500 dark:text-purple-400 uppercase tracking-wider px-4 mb-2">
                Account
              </SidebarGroupLabel>
              <SidebarMenu>
                {user ? (
                  <>
                    <SidebarMenuItem>
                      <SidebarMenuButton 
                        tooltip="Account"
                        className="group transition-all duration-200"
                      >
                        <motion.div 
                          className="flex items-center gap-3"
                          whileHover={{ x: 3 }}
                        >
                          <div className="p-1 rounded-lg bg-purple-100 dark:bg-purple-900/30 group-hover:bg-purple-200 dark:group-hover:bg-purple-800/50 transition-colors">
                            <User className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                          </div>
                          <span className="text-gray-700 dark:text-gray-300 truncate max-w-[160px]">{user.email}</span>
                        </motion.div>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                      <SidebarMenuButton 
                        tooltip="Logout" 
                        onClick={() => signOut()}
                        className="group transition-all duration-200"
                      >
                        <motion.div 
                          className="flex items-center gap-3"
                          whileHover={{ x: 3 }}
                        >
                          <div className="p-1 rounded-lg bg-purple-100 dark:bg-purple-900/30 group-hover:bg-purple-200 dark:group-hover:bg-purple-800/50 transition-colors">
                            <LogOut className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                          </div>
                          <span className="text-gray-700 dark:text-gray-300">Logout</span>
                        </motion.div>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  </>
                ) : (
                  <SidebarMenuItem>
                    <SidebarMenuButton 
                      asChild 
                      tooltip="Login" 
                      isActive={location.pathname === "/login"}
                      className="group transition-all duration-200"
                    >
                      <Link to="/login">
                        <motion.div 
                          className="flex items-center gap-3"
                          whileHover={{ x: 3 }}
                        >
                          <div className={cn(
                            "p-1 rounded-lg bg-purple-100 dark:bg-purple-900/30 group-hover:bg-purple-200 dark:group-hover:bg-purple-800/50 transition-colors",
                            location.pathname === "/login" && "bg-purple-200 dark:bg-purple-800/50"
                          )}>
                            <LogIn className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                          </div>
                          <span className="text-gray-700 dark:text-gray-300">Login</span>
                        </motion.div>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )}
              </SidebarMenu>
            </SidebarGroup>
          </SidebarContent>
          
          <SidebarFooter className="p-4">
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full bg-white dark:bg-gray-800 border-purple-200 dark:border-purple-800/50 shadow-sm hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-colors"
              >
                <span className="bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent dark:from-purple-400 dark:to-indigo-400 font-medium">
                  Free Plan
                </span>
              </Button>
            </motion.div>
          </SidebarFooter>
        </SidebarComponent>

        <SidebarInset>
          <div className="h-full">
            <div className="p-4 flex justify-between items-center border-b border-purple-100 dark:border-purple-900/30 bg-white dark:bg-gray-900">
              <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                <SidebarTrigger className="text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300" />
              </motion.div>
              <motion.h1 
                className="text-xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent dark:from-purple-400 dark:to-indigo-400"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                Academic AI
              </motion.h1>
              <div className="w-10"></div>
            </div>
            <div className="overflow-auto h-[calc(100%-4rem)] custom-scrollbar">
              {children}
            </div>
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default AppSidebar;