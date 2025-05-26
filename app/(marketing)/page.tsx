'use client';

import { Button } from "@/components/ui/button";
import { ClerkLoaded, ClerkLoading, SignedOut, SignedIn, SignUpButton, SignInButton } from "@clerk/nextjs";
import { Loader } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { ChefHat, Globe2, Trophy, Heart, Sparkles, BookOpen } from "lucide-react";
import { useEffect, useRef } from "react";

const features = [
  {
    icon: ChefHat,
    title: "Learn World Cuisines",
    description: "Discover authentic recipes and techniques from around the globe"
  },
  {
    icon: Trophy,
    title: "Earn & Compete",
    description: "Complete challenges, earn points, and climb the leaderboard"
  },
  {
    icon: Heart,
    title: "Stay Motivated",
    description: "Build streaks and complete daily quests to keep learning"
  },
  {
    icon: Globe2,
    title: "Cultural Journey",
    description: "Immerse yourself in food cultures from different countries"
  }
];

const aboutContent = {
  mission: "Our mission is to make learning about world cuisines accessible, engaging, and fun for everyone.",
  values: [
    {
      title: "Passion for Food",
      description: "We believe food is more than sustenance - it's culture, history, and connection.",
      icon: Heart
    },
    {
      title: "Educational Excellence",
      description: "Creating high-quality, accurate content that truly teaches and inspires.",
      icon: BookOpen
    },
    {
      title: "Cultural Authenticity",
      description: "Respecting and preserving the authenticity of each cuisine and tradition.",
      icon: Globe2
    },
    {
      title: "Innovation",
      description: "Using technology to create engaging and effective learning experiences.",
      icon: Sparkles
    }
  ]
};

export default function Home() {
  const { scrollY } = useScroll();
  const heroRef = useRef(null);

  // Animaciones para el hero
  const heroScale = useTransform(scrollY, [0, 300], [1, 0.8]);
  const heroOpacity = useTransform(scrollY, [0, 300], [1, 0]);
  const heroY = useTransform(scrollY, [0, 300], [0, 100]);

  return (
    <div className="bg-[#1e1e1e] w-full min-h-screen">
      {/* Hero Section */}
      <section className="max-w-[1200px] mx-auto flex-1 w-full flex flex-col lg:flex-row items-center justify-between p-8 gap-8 min-h-screen">
        <motion.div 
          className="flex flex-col gap-6 lg:max-w-[50%]"
          initial={{ opacity: 0, x: -100 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ 
            duration: 0.8,
            type: "spring",
            bounce: 0.4
          }}
        >
          <motion.h1 
            className="text-4xl lg:text-6xl font-bold text-[#f5f5f5] leading-tight"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
          >
            Learn to Cook Like a <motion.span 
              className="text-[#FF6F1F]"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
            >World Chef</motion.span>
          </motion.h1>
          <motion.p 
            className="text-xl text-neutral-400"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.8 }}
          >
            Join thousands of food enthusiasts learning authentic cuisines through our gamified platform.
          </motion.p>
          <motion.div 
            className="flex gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
          >
            <ClerkLoading>
              <Loader className="h-5 w-5 text-muted-foreground animate-spin" />
            </ClerkLoading>
            <ClerkLoaded>
              <SignedOut>
                <SignUpButton mode="modal" fallbackRedirectUrl="/learn">
                  <Button 
                    size="lg" 
                    variant="secondary" 
                    className="text-lg px-8 hover:scale-105 transition-transform"
                  >
                    Get Started Free
                  </Button>
                </SignUpButton>
                <SignInButton mode="modal" fallbackRedirectUrl="/learn">
                  <Button 
                    size="lg" 
                    variant="primaryOutline" 
                    className="text-lg px-8 hover:scale-105 transition-transform"
                  >
                    Sign In
                  </Button>
                </SignInButton>
              </SignedOut>
              <SignedIn>
                <Button 
                  size="lg" 
                  variant="secondary" 
                  className="text-lg px-8 hover:scale-105 transition-transform" 
                  asChild
                >
                  <Link href="/learn">Continue Learning</Link>
                </Button>
              </SignedIn>
            </ClerkLoaded>
          </motion.div>
        </motion.div>
        
        <motion.div 
          ref={heroRef}
          className="relative w-[300px] h-[300px] lg:w-[500px] lg:h-[500px]"
          style={{
            scale: heroScale,
            opacity: heroOpacity,
            y: heroY
          }}
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ 
            scale: 1, 
            opacity: 1,
            rotate: [0, 5, -5, 0],
          }}
          transition={{ 
            duration: 1,
            type: "spring",
            bounce: 0.5,
            rotate: {
              duration: 1.5,
              repeat: 0,
              ease: "easeInOut"
            }
          }}
          whileHover={{ 
            scale: 1.05,
            transition: { duration: 0.3 }
          }}
        >
          <Image 
            src="/hero.png" 
            fill 
            alt="Tastify Hero" 
            quality="100"
            className="object-contain"
            priority
          />
          <motion.div
            className="absolute inset-0 bg-[#FF6F1F] rounded-full filter blur-3xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.15, 0] }}
            transition={{
              duration: 2,
              repeat: Infinity,
              repeatType: "reverse"
            }}
            style={{ zIndex: -1 }}
          />
        </motion.div>
      </section>

      {/* Features Section con scroll animations */}
      <motion.section 
        className="bg-[#2c2c2c] py-20"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, margin: "-100px" }}
      >
        <div className="max-w-[1200px] mx-auto px-8">
          <motion.h2 
            className="text-3xl lg:text-4xl font-bold text-center text-[#f5f5f5] mb-12"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            Why Choose <span className="text-[#FF6F1F]">Tastify</span>
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                className="bg-[#1e1e1e] p-6 rounded-xl hover:bg-[#252525] transition-colors duration-300"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ 
                  scale: 1.05,
                  transition: { duration: 0.2 }
                }}
              >
                <feature.icon className="w-12 h-12 text-[#FF6F1F] mb-4" />
                <h3 className="text-xl font-bold text-[#f5f5f5] mb-2">{feature.title}</h3>
                <p className="text-neutral-400">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Screenshots Section */}
      <section className="py-20">
        <div className="max-w-[1200px] mx-auto px-8">
          <motion.h2 
            className="text-3xl lg:text-4xl font-bold text-center text-[#f5f5f5] mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            Learn Through <span className="text-[#FF6F1F]">Interactive Lessons</span>
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <motion.div
              className="relative h-[300px] rounded-xl overflow-hidden hover:scale-105 transition-transform duration-300"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <Image src="/learn.png" fill alt="Learn" className="object-cover" />
            </motion.div>
            <motion.div
              className="relative h-[300px] rounded-xl overflow-hidden hover:scale-105 transition-transform duration-300"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <Image src="/quests.png" fill alt="Quests" className="object-cover" />
            </motion.div>
            <motion.div
              className="relative h-[300px] rounded-xl overflow-hidden hover:scale-105 transition-transform duration-300"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Image src="/leaderboard.png" fill alt="Leaderboard" className="object-cover" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* About Us Section */}
      <section className="bg-[#2c2c2c] py-20">
        <div className="max-w-[1200px] mx-auto px-8">
          <motion.h2 
            className="text-3xl lg:text-4xl font-bold text-center text-[#f5f5f5] mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            About <span className="text-[#FF6F1F]">Tastify</span>
          </motion.h2>
          
          <motion.div 
            className="max-w-2xl mx-auto text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <p className="text-xl text-neutral-300">{aboutContent.mission}</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {aboutContent.values.map((value, index) => (
              <motion.div
                key={value.title}
                className="bg-[#1e1e1e] p-6 rounded-xl"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ 
                  scale: 1.05,
                  transition: { duration: 0.2 }
                }}
              >
                <div className="flex items-center justify-center mb-4">
                  <motion.div
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.5 }}
                  >
                    <value.icon className="w-12 h-12 text-[#FF6F1F]" />
                  </motion.div>
                </div>
                <h3 className="text-xl font-bold text-[#f5f5f5] mb-2 text-center">{value.title}</h3>
                <p className="text-neutral-400 text-center">{value.description}</p>
              </motion.div>
            ))}
          </div>

          <motion.div 
            className="mt-16 text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            <Button 
              size="lg" 
              variant="secondary" 
              className="text-lg px-12 hover:scale-105 transition-transform"
              asChild
            >
              <Link href="/learn">Join Our Community</Link>
            </Button>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="max-w-[800px] mx-auto px-8 text-center">
          <motion.h2 
            className="text-3xl lg:text-4xl font-bold text-[#f5f5f5] mb-6"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            Ready to Start Your <span className="text-[#FF6F1F]">Culinary Journey</span>?
          </motion.h2>
          <motion.p 
            className="text-xl text-neutral-400 mb-8"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            Join thousands of learners discovering world cuisines in a fun and engaging way.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <ClerkLoaded>
              <SignedOut>
                <SignUpButton mode="modal" fallbackRedirectUrl="/learn">
                  <Button size="lg" variant="secondary" className="text-lg px-12">
                    Start Learning Now
                  </Button>
                </SignUpButton>
              </SignedOut>
            </ClerkLoaded>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
