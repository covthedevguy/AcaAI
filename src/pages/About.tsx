
import React from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const About = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-purple-50 dark:from-gray-900 dark:to-purple-950">
      <div className="container mx-auto px-4 py-16">
        <h1 className="text-4xl font-bold text-purple-900 dark:text-purple-200 mb-8 text-center">
          About Academic AI
        </h1>
        
        <div className="max-w-3xl mx-auto prose prose-purple dark:prose-invert">
          <p className="text-lg">
            Academic AI is designed to be your intelligent companion throughout your academic journey. 
            Whether you're a student, researcher, or educator, our AI assistant helps you navigate 
            complex academic content, research papers, and study materials.
          </p>
          
          <h2>How It Works</h2>
          <p>
            Our platform combines state-of-the-art AI with specialized academic knowledge to provide:
          </p>
          <ul>
            <li>Document analysis and comprehension</li>
            <li>Natural language conversations about academic topics</li>
            <li>Research assistance and citation suggestions</li>
            <li>Learning support across various disciplines</li>
          </ul>
          
          <h2>Our Mission</h2>
          <p>
            We believe AI should augment human intelligence, not replace it. Academic AI aims to 
            make quality education more accessible and help users develop deeper understanding 
            of their subjects through interactive, personalized assistance.
          </p>
          
          <div className="mt-12 flex justify-center">
            <Button asChild size="lg" className="bg-purple-600 hover:bg-purple-700">
              <Link to="/signup">Join Academic AI</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
