
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Check } from "lucide-react";

const pricingPlans = [
  {
    title: "Free",
    price: "$0",
    period: "forever",
    description: "Basic academic assistance for students",
    features: [
      "5 document uploads per month",
      "Basic AI chat assistance",
      "Limited history storage (7 days)",
      "Email support"
    ],
    buttonText: "Get Started",
    buttonVariant: "outline" as const
  },
  {
    title: "Pro",
    price: "$0.59",
    period: "per month",
    description: "Advanced features for serious students",
    features: [
      "50 document uploads per month",
      "Advanced AI chat assistance",
      "Extended history storage (30 days)",
      "Priority email support",
      "Batch document processing"
    ],
    buttonText: "Start Free Trial",
    buttonVariant: "default" as const,
    featured: true
  },
  {
    title: "Enterprise",
    price: "$0.99",
    period: "per month",
    description: "Custom solutions for institutions",
    features: [
      "Unlimited document uploads",
      "Custom AI model training",
      "Permanent history storage",
      "24/7 priority support",
      "API access",
      "Custom integration options"
    ],
    buttonText: "Contact Sales",
    buttonVariant: "outline" as const
  },
  {
    title: "Premium",
    price: "$1.99",
    period: "per month",
    description: "Advanced AI-powered solutions for researchers",
    features: [
      "Unlimited document uploads",
      "Custom AI model training",
      "Permanent history storage",
      "24/7 dedicated support",
      "API access with advanced endpoints",
      "Custom integration options",
      "AI-powered research summarization",
      "Advanced citation generation",
      "Collaboration tools for research teams",
      "Enhanced data security & compliance"
    ],
    buttonText: "Contact Sales",
    buttonVariant: "outline" as const
}

];

const Pricing = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-purple-50 dark:from-gray-900 dark:to-purple-950 py-12">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-purple-900 dark:text-purple-200 mb-4">
            Simple, Transparent Pricing
          </h1>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Choose the plan that fits your academic needs. All plans include access to our core AI features.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {pricingPlans.map((plan) => (
            <Card key={plan.title} className={`border ${plan.featured ? 'border-purple-400 dark:border-purple-600 shadow-lg relative' : 'border-gray-200 dark:border-gray-800'}`}>
              {plan.featured && (
                <div className="absolute top-0 right-0 bg-purple-600 text-white text-xs font-bold px-3 py-1 rounded-bl-lg rounded-tr-lg">
                  Popular
                </div>
              )}
              <CardHeader>
                <CardTitle className="text-xl font-bold text-purple-800 dark:text-purple-300">{plan.title}</CardTitle>
                <div className="mt-4">
                  <span className="text-3xl font-bold text-gray-900 dark:text-white">{plan.price}</span>
                  <span className="text-sm text-gray-500 dark:text-gray-400 ml-1">/{plan.period}</span>
                </div>
                <CardDescription className="mt-2">{plan.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-center">
                      <Check className="h-4 w-4 text-purple-600 dark:text-purple-400 mr-2" />
                      <span className="text-gray-700 dark:text-gray-300">{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                <Button 
                  variant={plan.buttonVariant} 
                  className={`w-full ${plan.featured ? 'bg-purple-600 hover:bg-purple-700 text-white' : ''}`}
                >
                  {plan.buttonText}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        <div className="text-center mt-16">
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Have questions about our pricing plans?
          </p>
          <Link to="/about">
            <Button variant="link" className="text-purple-600 dark:text-purple-400">
              Contact our support team
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Pricing;
