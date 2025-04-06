
import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { BookOpen, MessageSquare, FileUp } from "lucide-react";
import { Link } from "react-router-dom";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-purple-50 dark:from-gray-900 dark:to-purple-950">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-20">
        <div className="flex flex-col items-center text-center max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-bold text-purple-900 dark:text-purple-200 mb-6">
            Academic AI Assistant
          </h1>
          <p className="text-lg md:text-xl text-gray-700 dark:text-gray-300 mb-10 leading-relaxed">
            Your intelligent companion for research, study, and academic writing. Upload documents, ask questions, and get intelligent assistance tailored to academic needs.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button asChild size="lg" className="bg-purple-600 hover:bg-purple-700">
              <Link to="/login">Get Started</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link to="/about">Learn More</Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center text-purple-800 dark:text-purple-300 mb-12">
          Powerful Academic Tools
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <FeatureCard 
            icon={<FileUp className="h-10 w-10 text-purple-500" />}
            title="Upload Documents"
            description="Upload research papers, books, or your own notes to analyze and reference during your study sessions."
          />
          <FeatureCard 
            icon={<MessageSquare className="h-10 w-10 text-purple-500" />}
            title="Intelligent Chat"
            description="Ask complex academic questions and receive detailed, well-researched responses tailored to your needs."
          />
          <FeatureCard 
            icon={<BookOpen className="h-10 w-10 text-purple-500" />}
            title="Academic Context"
            description="Our AI understands academic contexts and can assist with research, writing, and learning across disciplines."
          />
        </div>
      </div>

      {/* CTA Section */}
      <div className="container mx-auto px-4 py-20 text-center">
        <div className="bg-purple-100 dark:bg-purple-900/30 rounded-xl p-8 md:p-12 max-w-4xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-purple-800 dark:text-purple-200 mb-4">
            Ready to boost your academic performance?
          </h2>
          <p className="text-gray-700 dark:text-gray-300 mb-8">
            Join thousands of students and researchers who are already using Academic AI to enhance their learning experience.
          </p>
          <Button asChild size="lg" className="bg-purple-600 hover:bg-purple-700">
            <Link to="/signup">Create Your Account</Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

// Feature Card Component
const FeatureCard = ({ icon, title, description }) => {
  return (
    <Card className="border border-purple-100 dark:border-purple-900 shadow-md hover:shadow-lg transition-shadow duration-300">
      <CardContent className="p-6 text-center flex flex-col items-center">
        <div className="mb-4">{icon}</div>
        <h3 className="text-xl font-semibold text-purple-800 dark:text-purple-300 mb-3">{title}</h3>
        <p className="text-gray-600 dark:text-gray-400">{description}</p>
      </CardContent>
    </Card>
  );
};

export default Index;
