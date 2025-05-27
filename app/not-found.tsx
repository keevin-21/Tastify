'use client';

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ChefHat, Home } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#1e1e1e] flex items-center justify-center p-4">
      <div className="w-full max-w-3xl">
        <div className="text-center space-y-8">
          {/* Animated 404 Text */}
          <motion.div
            className="relative"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{
              duration: 0.8,
              delay: 0.5,
              ease: [0, 0.71, 0.2, 1.01]
            }}
          >
            <div className="text-9xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-[#FF6F1F] to-[#FF8F4F] drop-shadow-2xl">
              404
            </div>
          </motion.div>

          {/* Animated Chef Hat and Plate */}
          <motion.div 
            className="relative w-48 h-48 mx-auto"
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.8 }}
          >
            <motion.div
              animate={{
                rotate: [0, -10, 10, -10, 10, 0],
              }}
              transition={{
                duration: 5,
                repeat: Infinity,
                repeatDelay: 0
              }}
              className="absolute inset-0 flex items-center justify-center"
            >
              <div className="relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-[#FF6F1F] to-[#FF6F1F] rounded-full blur opacity-30 animate-pulse" />
                <Image
                  src="/mascot.png"
                  width={120}
                  height={120}
                  alt="Tastify Mascot"
                  className="relative transform hover:scale-110 transition-transform duration-300"
                />
              </div>
            </motion.div>
          </motion.div>

          {/* Error Message */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.2 }}
            className="space-y-4"
          >
            <h2 className="text-3xl font-bold text-[#f5f5f5]">
              ¡Oops! This recipe seems to be missing!
            </h2>
            <p className="text-neutral-400 text-lg max-w-md mx-auto">
              Don&apos;t worry, our chef is cooking up something special. 
              Let&apos;s get you back to the kitchen!
            </p>
          </motion.div>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.5 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <Link href="/">
              <Button 
                size="lg"
                className="bg-[#FF6F1F] hover:bg-[#FF8F4F] text-white font-semibold px-6 py-3 rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-orange-500/20"
              >
                <Home className="w-5 h-5 mr-2" />
                Back to Home
              </Button>
            </Link>
            <Link href="/courses">
              <Button 
                variant="ghost" 
                size="lg"
                className="text-[#f5f5f5] hover:text-[#FF6F1F] hover:bg-[#2c2c2c] font-semibold px-6 py-3 rounded-xl transition-all duration-300 hover:scale-105"
              >
                <ChefHat className="w-5 h-5 mr-2" />
                Explore Courses
              </Button>
            </Link>
          </motion.div>
        </div>

        {/* Animated Background Elements */}
        <motion.div
          className="absolute inset-0 -z-10 overflow-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.5 }}
          transition={{ duration: 1, delay: 0.5 }}
        >
          {[...Array(5)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-64 h-64 bg-gradient-to-r from-[#FF6F1F] to-transparent rounded-full filter blur-3xl opacity-20"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                scale: [1, 1.2, 1],
                x: [0, Math.random() * 100 - 50, 0],
                y: [0, Math.random() * 100 - 50, 0],
              }}
              transition={{
                duration: 10 + Math.random() * 5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          ))}
        </motion.div>
      </div>
    </div>
  );
} 