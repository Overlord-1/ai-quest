import React, { useEffect, useRef, useState } from 'react';
import { Users, MessageCircle, Award, Search, Github, BookOpen, ChevronRight, Star, Shield, Brain, ChevronLeft, Calendar } from 'lucide-react';
import * as THREE from 'three';

// Custom Wave class for Three.js animation
class Wave {
  constructor(color = 0x4f46e5) {
    this.geometry = new THREE.PlaneGeometry(window.innerWidth * 2, window.innerHeight * 2, 128, 128);
    this.material = new THREE.ShaderMaterial({
      side: THREE.DoubleSide,
      uniforms: {
        uTime: { value: 0 },
        uColor: { value: new THREE.Color(color) },
      },
      vertexShader: `
        uniform float uTime;
        varying vec2 vUv;
        varying float vElevation;

        void main() {
          vUv = uv;
          vec4 modelPosition = modelMatrix * vec4(position, 1.0);
          
          float elevation = sin(modelPosition.x * 0.3 + uTime) * 0.3
            * sin(modelPosition.y * 0.2 + uTime) * 0.3;
          
          modelPosition.z = elevation;
          vElevation = elevation;

          gl_Position = projectionMatrix * viewMatrix * modelPosition;
        }
      `,
      fragmentShader: `
        uniform vec3 uColor;
        varying float vElevation;

        void main() {
          float alpha = (vElevation + 0.3) * 0.5;
          gl_FragColor = vec4(uColor, alpha * 0.4);
        }
      `,
      transparent: true,
    });

    this.mesh = new THREE.Mesh(this.geometry, this.material);
    this.mesh.rotation.x = -Math.PI * 0.5;
    this.mesh.position.y = -8;
    this.time = 0;
  }

  update() {
    this.time += 0.005;
    this.material.uniforms.uTime.value = this.time;
  }
}

const BackgroundAnimation = () => {
  const containerRef = useRef();
  const sceneRef = useRef();
  const cameraRef = useRef();
  const rendererRef = useRef();
  const waveRef = useRef();
  const animationFrameRef = useRef();

  useEffect(() => {
    if (!containerRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // Camera setup
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 100);
    camera.position.z = 15;
    camera.position.y = 5;
    camera.lookAt(0, 0, 0);
    cameraRef.current = camera;

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ 
      antialias: true,
      alpha: true,
      canvas: containerRef.current
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    rendererRef.current = renderer;

    // Create wave
    const wave = new Wave();
    scene.add(wave.mesh);
    waveRef.current = wave;

    // Add particles
    const particlesGeometry = new THREE.BufferGeometry();
    const count = 2000;
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);

    for(let i = 0; i < count * 3; i += 3) {
      positions[i] = (Math.random() - 0.5) * 50;
      positions[i + 1] = (Math.random() - 0.5) * 50;
      positions[i + 2] = (Math.random() - 0.5) * 50;

      colors[i] = 0.5 + Math.random() * 0.5;
      colors[i + 1] = 0.5 + Math.random() * 0.5;
      colors[i + 2] = 1;
    }

    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    particlesGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const particlesMaterial = new THREE.PointsMaterial({
      size: 0.05,
      vertexColors: true,
      transparent: true,
      opacity: 0.6,
      blending: THREE.AdditiveBlending
    });

    const particles = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particles);

    // Animation
    const animate = () => {
      animationFrameRef.current = requestAnimationFrame(animate);
      
      if (waveRef.current) {
        waveRef.current.update();
      }

      particles.rotation.y += 0.0005;
      particles.rotation.x += 0.0002;

      renderer.render(scene, camera);
    };

    animate();

    // Handle resize
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameRef.current);
      scene.remove(wave.mesh);
      scene.remove(particles);
      particlesGeometry.dispose();
      particlesMaterial.dispose();
      wave.geometry.dispose();
      wave.material.dispose();
      renderer.dispose();
    };
  }, []);

  return <canvas ref={containerRef} className="fixed inset-0 -z-10" />;
};

// Blog posts data
const blogPosts = [
  {
    title: "Leveraging AI for Better Knowledge Management",
    excerpt: "Discover how artificial intelligence is revolutionizing the way teams share and manage knowledge.",
    date: "Mar 15, 2024",
    readTime: "5 min read",
    category: "AI & Technology"
  },
  {
    title: "Building a Culture of Knowledge Sharing",
    excerpt: "Learn the key strategies for fostering a collaborative environment where knowledge flows freely.",
    date: "Mar 12, 2024",
    readTime: "4 min read",
    category: "Team Culture"
  },
  {
    title: "The Future of Enterprise Knowledge Bases",
    excerpt: "Explore upcoming trends and innovations in enterprise knowledge management systems.",
    date: "Mar 8, 2024",
    readTime: "6 min read",
    category: "Future Trends"
  }
];

// Animated counter component
const AnimatedCounter = ({ value, duration = 2000 }) => {
  const [count, setCount] = useState(0);
  const countRef = useRef(0);
  const [isVisible, setIsVisible] = useState(false);
  const elementRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (elementRef.current) {
      observer.observe(elementRef.current);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isVisible) return;

    const endValue = parseInt(value.replace(/,/g, '').replace(/\+/g, ''));
    const stepTime = Math.abs(Math.floor(duration / endValue));
    let startTime;

    const updateCount = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = timestamp - startTime;
      const increment = Math.min(endValue, Math.floor((progress / duration) * endValue));

      if (countRef.current !== increment) {
        countRef.current = increment;
        setCount(increment);
      }

      if (progress < duration) {
        requestAnimationFrame(updateCount);
      }
    };

    requestAnimationFrame(updateCount);
  }, [value, duration, isVisible]);

  return (
    <span ref={elementRef}>
      {count.toLocaleString()}+
    </span>
  );
};

const BlogCard = ({ post }) => (
    <div className="bg-black/40 backdrop-blur-xl border border-gray-800 rounded-2xl p-6 hover:scale-105 transition-all duration-300">
      <div className="flex items-center space-x-2 text-sm text-gray-400 mb-3">
        <Calendar size={16} />
        <span>{post.date}</span>
        <span>•</span>
        <span>{post.readTime}</span>
      </div>
      <h3 className="text-xl font-semibold mb-2 text-white hover:text-indigo-400 transition-colors">
        {post.title}
      </h3>
      <p className="text-gray-400 mb-4">{post.excerpt}</p>
      <span className="inline-block px-3 py-1 rounded-full text-sm bg-indigo-500/20 text-indigo-400">
        {post.category}
      </span>
    </div>
);

// Reviews data
const reviews = [
  {
    name: "Sarah Johnson",
    role: "Engineering Lead",
    content: "KnowledgeHub has transformed how our team shares information. The AI-powered responses are incredibly accurate.",
    rating: 5
  },
  {
    name: "Mark Anderson",
    role: "Product Manager",
    content: "The official answers feature ensures we always have accurate information. Great for maintaining knowledge consistency.",
    rating: 5
  },
  {
    name: "Lisa Chen",
    role: "Senior Developer",
    content: "Integration with our GitHub repos makes it super easy to reference documentation. Best knowledge sharing tool we've used.",
    rating: 4
  }
];

// Features data
const features = [
  { 
    icon: <Brain size={24} />, 
    title: 'AI-Powered Answers', 
    description: 'Get intelligent responses based on your organizations knowledge base' 
  },
  { 
    icon: <Shield size={24} />, 
    title: 'Official Verification', 
    description: 'Designated experts provide and verify authoritative answers' 
  },
  { 
    icon: <Github size={24} />, 
    title: 'GitHub Integration', 
    description: 'Seamlessly connect with your repositories and documentation' 
  },
  { 
    icon: <Search size={24} />, 
    title: 'Smart Search', 
    description: 'Find answers quickly with our advanced search capabilities' 
  },
  { 
    icon: <MessageCircle size={24} />, 
    title: 'Real-time Collaboration', 
    description: 'Ask questions and get answers from your entire team' 
  },
  { 
    icon: <BookOpen size={24} />, 
    title: 'Knowledge Base', 
    description: 'Build a comprehensive library of verified solutions' 
  }
];

// Stats data
const stats = [
  { icon: <Users size={24} />, label: 'Active Users', value: '5,000+' },
  { icon: <MessageCircle size={24} />, label: 'Questions Asked', value: '15,000+' },
  { icon: <Award size={24} />, label: 'Verified Answers', value: '25,000+' }
];

const ReviewCarousel = ({ reviews }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % reviews.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + reviews.length) % reviews.length);
  };

  return (
    <div className="relative max-w-4xl mx-auto px-4">
      <div className="overflow-hidden rounded-2xl">
        <div 
          className="flex transition-transform duration-500 ease-out" 
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {reviews.map((review, index) => (
            <div
              key={index}
              className="w-full flex-shrink-0 p-8 bg-black/40 backdrop-blur-xl border border-gray-800"
            >
              <div className="flex flex-col space-y-4">
                <div className="flex items-center space-x-1">
                  {[...Array(review.rating)].map((_, i) => (
                    <Star key={i} size={16} className="fill-current text-indigo-500" />
                  ))}
                </div>
                <p className="text-gray-400 italic text-lg">{review.content}</p>
                <div>
                  <div className="font-semibold bg-gradient-to-r from-indigo-500 to-purple-500 bg-clip-text text-transparent">
                    {review.name}
                  </div>
                  <div className="text-sm text-gray-500">{review.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <button 
        onClick={prevSlide}
        className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-12 p-2 rounded-full bg-black/40 border border-gray-800 hover:bg-black/60 transition-all duration-200"
        aria-label="Previous slide"
      >
        <ChevronLeft className="text-white" />
      </button>
      
      <button 
        onClick={nextSlide}
        className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-12 p-2 rounded-full bg-black/40 border border-gray-800 hover:bg-black/60 transition-all duration-200"
        aria-label="Next slide"
      >
        <ChevronRight className="text-white" />
      </button>

      <div className="flex justify-center mt-4 space-x-2">
        {reviews.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-2 h-2 rounded-full transition-all duration-200 ${
              index === currentIndex ? 'bg-indigo-500 w-4' : 'bg-gray-600'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

const LandingPage = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <BackgroundAnimation />

      {/* Navbar */}
      <nav className="fixed w-full z-10 bg-black/20 backdrop-blur-xl border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <span className="text-2xl font-bold bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
                KnowledgeHub
              </span>
            </div>
            <div className="flex items-center">
              <button className="px-4 py-2 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:scale-105 transition-all duration-300 shadow-lg shadow-indigo-500/25">
                Sign In
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="pt-32 pb-16 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className={`transform transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            <h1 className="text-7xl font-bold text-center mb-6 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent animate-gradient">
              Next-Gen Knowledge Sharing
            </h1>
            <p className="text-xl text-center mb-8 text-gray-400 max-w-2xl mx-auto">
              Harness the power of AI to transform your team's knowledge sharing
            </p>
            <div className="flex justify-center space-x-4">
              <button className="px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg hover:scale-105 transition-all duration-300 shadow-lg shadow-indigo-500/25 flex items-center group">
                Get Started 
                <ChevronRight className="ml-2 transform group-hover:translate-x-1 transition-transform" />
              </button>
              <button className="px-8 py-4 rounded-lg border border-gray-700 hover:border-indigo-500 transition-all duration-300 hover:scale-105">
                Learn More
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="py-16 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {stats.map((stat, index) => (
              <div
                key={index}
                className="bg-black/40 p-8 rounded-2xl backdrop-blur-xl border border-gray-800 hover:scale-105 transition-all duration-300 group"
              >
                <div className="flex items-center space-x-4">
                  <div className="text-indigo-500 transform group-hover:scale-110 transition-transform">
                    {stat.icon}
                  </div>
                  <div>
                    <div className="text-3xl font-bold bg-gradient-to-r from-indigo-500 to-purple-500 bg-clip-text text-transparent">
                      <AnimatedCounter value={stat.value} />
                    </div>
                    <div className="text-gray-400">{stat.label}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* New Blog Section */}
      <div className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-center mb-12 bg-gradient-to-r from-indigo-500 to-purple-500 bg-clip-text text-transparent">
            Latest Insights
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {blogPosts.map((post, index) => (
              <BlogCard key={index} post={post} />
            ))}
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-center mb-12 bg-gradient-to-r from-indigo-500 to-purple-500 bg-clip-text text-transparent">
            Powerful Features
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-black/40 backdrop-blur-xl border border-gray-800 p-8 rounded-2xl group transform hover:-translate-y-2 transition-all duration-300 hover:shadow-lg hover:shadow-indigo-500/10"
              >
                <div className="flex flex-col items-center text-center space-y-4">
                  <div className="text-indigo-500 bg-indigo-500/10 p-4 rounded-xl group-hover:scale-110 transition-transform duration-300">
                    {feature.icon}
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2 text-white">{feature.title}</h3>
                    <p className="text-gray-400">{feature.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Reviews Section */}
      <div className="py-16">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-12 bg-gradient-to-r from-indigo-500 to-purple-500 bg-clip-text text-transparent">
            What Our Users Say
          </h2>
          <ReviewCarousel reviews={reviews} />
        </div>
      </div>

      {/* Footer */}
      <footer className="py-12 border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <span className="text-2xl font-bold bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
                KnowledgeHub
              </span>
              <p className="mt-4 text-gray-400">
                Transforming team knowledge sharing with the power of AI
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Product</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Features</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Pricing</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Documentation</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Company</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">About</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Blog</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Careers</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Legal</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Privacy</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Terms</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Security</a></li>
              </ul>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t border-gray-800 text-center text-gray-400">
            <p>© 2024 KnowledgeHub. All rights reserved.</p>
          </div>
        </div>
      </footer>

      {/* Global Styles
      <style jsx global>{`
        @keyframes gradient {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }

        .animate-gradient {
          background-size: 200% 200%;
          animation: gradient 15s ease infinite;
        }
      `}</style> */}
    </div>
  );
};

export default LandingPage;
        