import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Brain, Rocket, BookOpen, GraduationCap, Award, BarChart, 
  Clock, Zap, Users, Shield, Code, Globe, Mail, Smartphone,
  LifeBuoy, Server, CreditCard, PieChart, Terminal, Database,
  Layers, Cpu, Clock4, Bookmark, CheckCircle, Star, ChevronRight,
  PlayCircle, Laptop
} from 'lucide-react';
import { Link } from 'react-router-dom';

// Animation configurations
const float = {
  y: [0, -15, 0],
  transition: {
    duration: 3,
    repeat: Infinity,
    ease: "easeInOut"
  }
};

const pulse = {
  scale: [1, 1.03, 1],
  transition: {
    duration: 2,
    repeat: Infinity,
    ease: "easeInOut"
  }
};

const glow = {
  boxShadow: [
    '0 0 10px rgba(139, 92, 246, 0.5)',
    '0 0 20px rgba(139, 92, 246, 0.8)',
    '0 0 30px rgba(139, 92, 246, 1)',
    '0 0 20px rgba(139, 92, 246, 0.8)',
    '0 0 10px rgba(139, 92, 246, 0.5)'
  ],
  transition: {
    duration: 3,
    repeat: Infinity,
    ease: "easeInOut"
  }
};

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
};

function FeatureCard({ icon: Icon, title, description, color }) {
  return (
    <motion.div 
      variants={item}
      whileHover={{ y: -8, boxShadow: `0 15px 30px -5px ${color}40` }}
      className={`bg-white/5 p-8 rounded-2xl border border-${color}/20 backdrop-blur-lg transition-all duration-300`}
    >
      <div className="relative inline-block mb-6">
        <div className={`absolute inset-0 rounded-full bg-${color}/10 blur-md`} />
        <Icon className={`w-10 h-10 text-${color} relative`} />
      </div>
      <h3 className="text-2xl font-bold text-white mb-3">{title}</h3>
      <p className="text-gray-400">{description}</p>
    </motion.div>
  );
}

function PricingCard({ title, price, features, popular, color }) {
  return (
    <motion.div 
      whileHover={{ y: -10 }}
      className={`relative rounded-2xl p-8 border-2 ${popular ? `border-${color} bg-gradient-to-b from-${color}/10 to-transparent` : 'border-white/10 bg-white/5'}`}
    >
      {popular && (
        <div className={`absolute -top-4 left-1/2 transform -translate-x-1/2 bg-${color} text-white text-sm font-bold px-4 py-1 rounded-full`}>
          MOST POPULAR
        </div>
      )}
      <h3 className="text-2xl font-bold text-white mb-2">{title}</h3>
      <div className="mb-6">
        <span className="text-4xl font-bold text-white">${price}</span>
        <span className="text-gray-400">/month</span>
      </div>
      <ul className="space-y-3 mb-8">
        {features.map((feature, i) => (
          <li key={i} className="flex items-center text-gray-300">
            <CheckCircle className="w-5 h-5 text-green-400 mr-2" />
            {feature}
          </li>
        ))}
      </ul>
      <button className={`w-full py-3 rounded-lg font-bold ${popular ? `bg-${color} text-white` : 'bg-white/10 text-white'}`}>
        Get Started
      </button>
    </motion.div>
  );
}

export default function Home() {
  const [showVideoOverlay, setShowVideoOverlay] = useState(true);
  const videoRef = useRef(null);
  const [currentSlide, setCurrentSlide] = useState(0);

  const features = [
    {
      icon: Brain,
      title: "AI Tutor",
      description: "24/7 personalized learning assistant",
      color: "purple-400"
    },
    {
      icon: Rocket,
      title: "Fast Learning",
      description: "Master concepts 3x faster than traditional methods",
      color: "pink-400"
    },
    {
      icon: BookOpen,
      title: "Smart Notes",
      description: "Automatically generated study materials",
      color: "blue-400"
    }
  ];

  const pricingPlans = [
    {
      title: "Starter",
      price: "29",
      features: [
        "Basic AI tutor access",
        "10 learning sessions/month",
        "Email support",
        "Community access"
      ],
      color: "purple-400"
    },
    {
      title: "Pro",
      price: "79",
      features: [
        "Advanced AI tutor",
        "Unlimited sessions",
        "Priority support",
        "Progress analytics",
        "Weekly reports"
      ],
      popular: true,
      color: "pink-400"
    },
    {
      title: "Enterprise",
      price: "199",
      features: [
        "Everything in Pro",
        "Dedicated tutor",
        "API access",
        "Custom integrations",
        "24/7 premium support"
      ],
      color: "blue-400"
    }
  ];

  const slides = [
    "https://www.leveluponline.in/wp-content/uploads/2024/11/AI-with-personal-learnings.png",
    "https://blog.tcea.org/wp-content/uploads/2025/03/Google-Whisk-Featured-Image.webp",
    "https://media.licdn.com/dms/image/v2/D5612AQFBwXDKV_g4SA/article-cover_image-shrink_720_1280/article-cover_image-shrink_720_1280/0/1710273158719?e=2147483647&v=beta&t=5ksuyAcEgFM8qin_i8pG1G6RUgAotAvOOQO8ct_OZ8w",
    "https://www.tutorocean.com/_next/image?url=https%3A%2F%2Fi.imgur.com%2FjNZSVjn.jpeg&w=1200&q=75"
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const handlePlayVideo = () => {
    setShowVideoOverlay(false);
    videoRef.current.play();
  };

  return (
    <div className="bg-gray-900 text-white overflow-hidden">
      {/* Floating background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-purple-500/10"
            style={{
              width: Math.random() * 10 + 5,
              height: Math.random() * 10 + 5,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, (Math.random() - 0.5) * 100],
              x: [0, (Math.random() - 0.5) * 50],
              opacity: [0.1, 0.3, 0.1],
            }}
            transition={{
              duration: Math.random() * 20 + 10,
              repeat: Infinity,
              repeatType: "reverse",
            }}
          />
        ))}
      </div>

      {/* 1. Hero Section */}
      <section className="relative container mx-auto px-6 py-32">
        <div className="flex flex-col lg:flex-row items-center gap-16">
          <div className="lg:w-1/2">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <motion.div 
                animate={float}
                className="inline-flex items-center gap-3 mb-8 px-4 py-2 bg-white/5 rounded-full border border-purple-500/20"
              >
                <Rocket className="w-5 h-5 text-purple-400" />
                <span className="text-sm font-medium text-purple-400">The future of learning is here</span>
              </motion.div>
              
              <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
                <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 text-transparent bg-clip-text">AI-Powered</span><br/>
                Academic Platform
              </h1>
              
              <p className="text-xl text-gray-300 mb-8 max-w-lg">
                Revolutionize how you learn with Academic AI that personalizes content to your unique learning style and pace.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/signup">
                <motion.button 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="relative bg-gradient-to-r from-purple-600 to-pink-500 text-white font-semibold py-4 px-8 rounded-full inline-flex items-center group overflow-hidden shadow-lg shadow-purple-500/30"
                >
                  <span className="relative z-10">
                    Start Free Trial
                    <ChevronRight className="ml-2 inline group-hover:translate-x-1 transition-transform" />
                  </span>
                </motion.button>
                </Link>
                <motion.button 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-white/10 hover:bg-white/20 text-white font-semibold py-4 px-8 rounded-full inline-flex items-center transition-all"
                >
                  <PlayCircle className="w-5 h-5 mr-2" />
                  Watch Demo
                </motion.button>
              </div>
            </motion.div>
          </div>

          <div className="lg:w-1/2">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
              <img 
                src="https://images.unsplash.com/photo-1635070041078-e363dbe005cb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80" 
                alt="Academic AI Platform" 
                className="rounded-3xl border-2 border-purple-500/30 shadow-2xl shadow-purple-500/20 w-full object-cover"
              />
              
              <motion.div 
                className="absolute -bottom-6 -left-6 w-32 h-32 rounded-full bg-purple-500/20 -z-10"
                animate={float}
              />
              <motion.div 
                className="absolute -top-6 -right-6 w-24 h-24 rounded-full bg-pink-500/20 -z-10"
                animate={{
                  ...float,
                  y: [0, -20, 0],
                  transition: { ...float.transition, delay: 0.5 }
                }}
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* 2. Video Section */}
      <section className="py-20 bg-gradient-to-br from-purple-900/20 to-blue-900/20">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-4">See Academic AI in Action</h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Watch our demo video to understand how our platform works
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="relative aspect-video max-w-4xl mx-auto rounded-2xl overflow-hidden border-2 border-purple-500/30 shadow-xl shadow-purple-500/20"
          >
            <video 
              ref={videoRef}
              controls 
              className="w-full h-full object-cover"
              poster="/images/video-thumbnail.jpg"
            >
              <source src="/public/video/demo.mp4" type="video/mp4" />
              Your browser does not support the video tag.
            </video>
            
            {showVideoOverlay && (
              <motion.div 
                initial={{ opacity: 1 }}
                animate={{ opacity: 1 }}
                className="absolute inset-0 bg-black/30 flex items-center justify-center cursor-pointer hover:bg-black/40 transition-all"
                onClick={handlePlayVideo}
              >
                <motion.div 
                  whileHover={{ scale: 1.1 }}
                  className="bg-purple-600 hover:bg-purple-700 text-white rounded-full p-6 transition-all"
                >
                  <PlayCircle className="w-12 h-12" />
                </motion.div>
              </motion.div>
            )}
          </motion.div>
        </div>
      </section>

      {/* 3. Slideshow Section */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-4">Academic AI Features Showcase</h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Explore the key features through our interactive slideshow
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="relative max-w-4xl mx-auto rounded-2xl overflow-hidden border-2 border-purple-500/30 shadow-xl shadow-purple-500/20 aspect-video"
          >
            {slides.map((slide, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0 }}
                animate={{ 
                  opacity: index === currentSlide ? 1 : 0,
                  zIndex: index === currentSlide ? 1 : 0
                }}
                transition={{ duration: 0.5 }}
                className="absolute inset-0"
              >
                <img 
                  src={slide} 
                  alt={`Feature ${index + 1}`} 
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent flex items-end p-8">
                  <div>
                    <h3 className="text-2xl font-bold text-white mb-2">
                      {index === 0 && "Personalized Learning"}
                      {index === 1 && "Interactive Lessons"}
                      {index === 2 && "Progress Tracking"}
                      {index === 3 && "AI Tutor Assistance"}
                    </h3>
                    <p className="text-gray-300">
                      {index === 0 && "Our AI adapts to your unique learning style and pace"}
                      {index === 1 && "Engage with interactive content that enhances understanding"}
                      {index === 2 && "Monitor your academic progress with detailed analytics"}
                      {index === 3 && "Get instant help from our AI tutor anytime, anywhere"}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}

            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2 z-10">
              {slides.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`w-3 h-3 rounded-full transition-all ${index === currentSlide ? 'bg-purple-400 w-6' : 'bg-white/50'}`}
                />
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* 4. Trusted By */}
      <section className="py-12 bg-white/5">
        <div className="container mx-auto px-6">
          <p className="text-center text-gray-400 mb-8">TRUSTED BY ACADEMIC INSTITUTIONS WORLDWIDE</p>
          <div className="flex flex-wrap justify-center gap-12 items-center opacity-80">
            {['Harvard', 'MIT', 'Stanford', 'Oxford', 'Cambridge'].map((logo, i) => (
              <motion.div
                key={i}
                whileHover={{ scale: 1.1 }}
                className="text-2xl font-bold text-gray-300"
              >
                {logo}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Key Features */}
      <section id="features" className="py-20">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-4">Academic AI Features</h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Everything you need to accelerate your academic journey
            </p>
          </motion.div>

          <motion.div 
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="grid md:grid-cols-3 gap-8 mb-20"
          >
            {features.map((feature, i) => (
              <FeatureCard key={i} {...feature} />
            ))}
          </motion.div>
        </div>
      </section>

      {/* 6. How It Works */}
      <section className="py-20 bg-gradient-to-br from-purple-900/20 to-blue-900/20">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-4">How Academic AI Works</h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Get started in just a few simple steps
            </p>
          </motion.div>

          <div className="grid md:grid-cols-4 gap-8">
            {[
              { icon: Users, title: "Sign Up", desc: "Create your academic profile" },
              { icon: BarChart, title: "Assessment", desc: "Take our knowledge evaluation" },
              { icon: Cpu, title: "AI Matching", desc: "Our system creates your learning plan" },
              { icon: Rocket, title: "Start Learning", desc: "Begin your optimized academic journey" }
            ].map((step, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="relative inline-block mb-6">
                  <div className="absolute inset-0 bg-purple-500/10 rounded-full blur-md" />
                  <div className="relative bg-gradient-to-br from-purple-500/20 to-blue-500/20 p-6 rounded-full">
                    <step.icon className="w-8 h-8 text-purple-400" />
                  </div>
                  <div className="absolute -bottom-2 -right-2 bg-white text-purple-600 rounded-full w-8 h-8 flex items-center justify-center font-bold">
                    {i+1}
                  </div>
                </div>
                <h3 className="text-xl font-bold mb-2">{step.title}</h3>
                <p className="text-gray-400">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. Glowing Tech Section */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/10 to-blue-900/10 -z-10" />
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-4">Academic AI Technology</h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Cutting-edge AI combined with intuitive academic interfaces
            </p>
          </motion.div>

          <div className="flex flex-col lg:flex-row items-center justify-center gap-16">
            {/* Glowing Brain */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="relative"
            >
              <motion.div
                animate={glow}
                className="p-12 rounded-full bg-purple-500/10 backdrop-blur-lg border border-purple-500/30"
              >
                <Brain className="w-24 h-24 text-purple-400" />
              </motion.div>
              <motion.div
                className="absolute -inset-4 rounded-full bg-purple-500/20 -z-10"
                animate={pulse}
              />
              <div className="mt-8 text-center">
                <h3 className="text-2xl font-bold mb-2">Academic Intelligence</h3>
                <p className="text-gray-400 max-w-md">
                  Our neural network adapts to your learning patterns for optimal academic performance
                </p>
              </div>
            </motion.div>

            {/* Glowing Laptop */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
              className="relative"
            >
              <motion.div
                animate={{
                  ...glow,
                  boxShadow: [
                    '0 0 10px rgba(59, 130, 246, 0.5)',
                    '0 0 20px rgba(59, 130, 246, 0.8)',
                    '0 0 30px rgba(59, 130, 246, 1)',
                    '0 0 20px rgba(59, 130, 246, 0.8)',
                    '0 0 10px rgba(59, 130, 246, 0.5)'
                  ]
                }}
                className="p-12 rounded-2xl bg-blue-500/10 backdrop-blur-lg border border-blue-500/30"
              >
                <Laptop className="w-24 h-24 text-blue-400" />
              </motion.div>
              <motion.div
                className="absolute -inset-4 rounded-2xl bg-blue-500/20 -z-10"
                animate={{
                  ...pulse,
                  transition: { ...pulse.transition, delay: 0.5 }
                }}
              />
              <div className="mt-8 text-center">
                <h3 className="text-2xl font-bold mb-2">Academic Interface</h3>
                <p className="text-gray-400 max-w-md">
                  Intuitive platform designed specifically for academic excellence
                </p>
              </div>
            </motion.div>
          </div>

          {/* Connection line */}
          <motion.div
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            transition={{ duration: 1 }}
            viewport={{ once: true }}
            className="hidden lg:block h-1 bg-gradient-to-r from-purple-500/20 via-blue-500/40 to-purple-500/20 mx-auto my-12 max-w-2xl rounded-full"
          />
        </div>
      </section>

      {/* 8. AI Tutor Demo */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            <div className="lg:w-1/2">
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
              >
                <h2 className="text-4xl font-bold mb-6">Your <span className="text-purple-400">Academic AI Tutor</span></h2>
                <p className="text-xl text-gray-400 mb-8">
                  Our virtual tutor adapts to your academic needs in real-time, providing explanations exactly when you need them.
                </p>
                <ul className="space-y-4 mb-8">
                  {[
                    "24/7 academic support",
                    "Instant explanations",
                    "Adaptive difficulty",
                    "Subject-specific assistance"
                  ].map((item, i) => (
                    <li key={i} className="flex items-center">
                      <CheckCircle className="w-5 h-5 text-green-400 mr-3" />
                      <span className="text-gray-300">{item}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            </div>
            <div className="lg:w-1/2">
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
                className="relative"
              >
                <div className="absolute inset-0 bg-purple-500/10 rounded-3xl -rotate-3" />
                <img 
                  src="https://miro.medium.com/v2/resize:fit:1400/0*4egKrPjQQWyC4N2j" 
                  alt="Academic AI Tutor Interface" 
                  className="relative rounded-2xl border border-purple-500/30 shadow-xl w-full"
                />
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* 9. Stats Section */}
      <section className="py-20 bg-gradient-to-r from-purple-900/30 to-blue-900/30">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-8">
            {[
              { icon: Users, value: "250K+", label: "Students" },
              { icon: BookOpen, value: "1.5M+", label: "Lessons Completed" },
              { icon: Globe, value: "95%", label: "Satisfaction Rate" },
              { icon: Award, value: "4.9/5", label: "Average Rating" }
            ].map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <stat.icon className="w-12 h-12 text-purple-400 mx-auto mb-4" />
                <div className="text-5xl font-bold mb-2">{stat.value}</div>
                <div className="text-gray-400">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 10. Testimonials */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-4">Academic Success Stories</h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Join thousands of students achieving academic excellence
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                name: "Dr. Sarah Chen",
                role: "Neuroscience Researcher",
                quote: "Academic AI helped me master complex concepts in half the time traditional methods would take.",
                avatar: "https://randomuser.me/api/portraits/women/44.jpg"
              },
              {
                name: "James Rodriguez",
                role: "Medical Student",
                quote: "The AI tutor explains academic concepts better than most professors I've had.",
                avatar: "https://randomuser.me/api/portraits/men/32.jpg"
              },
              {
                name: "Priya Patel",
                role: "PhD Candidate",
                quote: "I improved my exam scores by 30% after just 2 months with Academic AI.",
                avatar: "https://randomuser.me/api/portraits/women/68.jpg"
              }
            ].map((testimonial, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
                className="bg-white/5 p-8 rounded-2xl border border-white/10"
              >
                <div className="flex items-center mb-6">
                  <img 
                    src={testimonial.avatar} 
                    alt={testimonial.name} 
                    className="w-12 h-12 rounded-full mr-4"
                  />
                  <div>
                    <h4 className="font-bold">{testimonial.name}</h4>
                    <p className="text-purple-400">{testimonial.role}</p>
                  </div>
                </div>
                <p className="text-gray-300 italic">"{testimonial.quote}"</p>
                <div className="flex mt-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 11. Pricing */}
      <section id="pricing" className="py-20 bg-gradient-to-b from-gray-900 to-gray-900/5">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-4">Academic AI Plans</h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Choose the plan that fits your academic needs
            </p>
          </motion.div>

          <motion.div
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto"
          >
            {pricingPlans.map((plan, i) => (
              <motion.div key={i} variants={item}>
                <PricingCard {...plan} />
              </motion.div>
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            viewport={{ once: true }}
            className="text-center mt-12 text-gray-400"
          >
            Need institutional solutions? <a href="#" className="text-purple-400 hover:underline">Contact us</a>
          </motion.div>
        </div>
      </section>

      {/* 12. Comparison */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-4">Why Academic AI?</h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              See how we compare to traditional academic methods
            </p>
          </motion.div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="pb-6 text-left"></th>
                  <th className="pb-6 text-left">Traditional Learning</th>
                  <th className="pb-6 text-left text-purple-400">Academic AI</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                {[
                  ["Personalization", "One-size-fits-all", "Fully adaptive"],
                  ["Availability", "Limited hours", "24/7 access"],
                  ["Feedback Speed", "Days/weeks", "Instant"],
                  ["Cost Effectiveness", "$$$", "Affordable"],
                  ["Progress Tracking", "Manual", "Automatic"],
                  ["Content Updates", "Yearly", "Real-time"]
                ].map((row, i) => (
                  <tr key={i}>
                    <td className="py-4 font-medium">{row[0]}</td>
                    <td className="py-4 text-gray-400">{row[1]}</td>
                    <td className="py-4 text-purple-400">{row[2]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* 13. FAQ */}
      <section className="py-20 bg-gradient-to-br from-purple-900/20 to-blue-900/20">
        <div className="container mx-auto px-6 max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-4">Academic AI FAQs</h2>
            <p className="text-xl text-gray-400">
              Everything you need to know about our academic platform
            </p>
          </motion.div>

          <div className="space-y-4">
            {[
              {
                question: "How does the academic AI work?",
                answer: "Our AI analyzes your learning patterns and academic needs, adapting content in real-time."
              },
              {
                question: "Is there a free trial for students?",
                answer: "Yes! We offer a 14-day free trial with full access to all academic features."
              },
              {
                question: "What academic subjects do you cover?",
                answer: "We support all major academic disciplines including STEM, humanities, and social sciences."
              },
              {
                question: "Can institutions use Academic AI?",
                answer: "Absolutely! We have special plans for schools and universities."
              }
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
                className="bg-white/5 p-6 rounded-xl border border-white/10"
              >
                <h3 className="text-xl font-bold mb-2">{item.question}</h3>
                <p className="text-gray-400">{item.answer}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 14. CTA */}
      <section className="py-32">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="bg-gradient-to-r from-purple-900/40 to-blue-900/40 rounded-3xl p-12 text-center border border-purple-500/30 relative overflow-hidden"
          >
            <motion.div 
              className="absolute -top-20 -left-20 w-40 h-40 rounded-full bg-purple-500/10 -z-10"
              animate={float}
            />
            <motion.div 
              className="absolute -bottom-10 -right-10 w-32 h-32 rounded-full bg-pink-500/10 -z-10"
              animate={{
                ...float,
                y: [0, -20, 0],
                transition: { ...float.transition, delay: 0.3 }
              }}
            />
            
            <h2 className="text-4xl font-bold mb-6">Ready to Transform Your Academic Journey?</h2>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Join thousands of students and educators achieving academic excellence with AI.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-gradient-to-r from-purple-600 to-pink-500 text-white font-semibold py-4 px-8 rounded-full"
              >
                Start Free Trial
              </motion.button>
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-white/10 hover:bg-white/20 text-white font-semibold py-4 px-8 rounded-full transition-all"
              >
                Schedule Demo
              </motion.button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}