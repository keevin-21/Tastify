"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { BookOpen, LightbulbIcon, ListChecks, Target, BookMarked, Layers, Sparkles, BarChart } from "lucide-react";
import { motion } from "framer-motion";
import { LessonContextData } from "@/lib/lesson-context";

// Mapa de nombres de iconos a componentes
const iconMap = {
  BookOpen,
  Target,
  ListChecks,
  LightbulbIcon,
  BookMarked,
  Layers,
  Sparkles,
  BarChart
};

type LessonContextProps = {
  lessonId: number;
  title: string;
  challengesCount: number;
  contextData: LessonContextData;
};

export const LessonContext = ({
  lessonId,
  title,
  contextData,
}: LessonContextProps) => {
  const [isReady, setIsReady] = useState(false);
  const { introduction, sections } = contextData.context;

  // Función para obtener el componente de icono correspondiente
  const getIcon = (iconName: string) => {
    const Icon = iconMap[iconName as keyof typeof iconMap] || BookOpen;
    return <Icon className="text-white" />;
  };

  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex-1 flex items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-2xl w-full bg-[#232323] rounded-xl shadow-lg border-2 border-[#2c2c2c] p-6"
        >
          <motion.h1 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="text-2xl lg:text-3xl font-bold text-[#f5f5f5] mb-6 flex items-center"
          >
            <BookOpen className="mr-3 text-[#FF6F1F]" />
            {title}
          </motion.h1>
          
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="text-[#f5f5f5] mb-8"
          >
            <p className="text-lg mb-6">
              {introduction}
            </p>
            
            <div className="space-y-4">
              {sections.map((section, index) => (
                <motion.div 
                  key={section.title}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 + index * 0.2, duration: 0.5 }}
                  className="bg-[#2c2c2c] p-4 rounded-lg flex"
                >
                  <div className="mr-4 bg-[#FF6F1F] p-2 rounded-lg self-start">
                    {getIcon(section.icon)}
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold mb-2">{section.title}</h2>
                    {section.content && <p>{section.content}</p>}
                    {section.listItems && (
                      <ul className="list-disc pl-5 space-y-1">
                        {section.listItems.map((item, i) => (
                          <li key={i}>{item}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2, duration: 0.5 }}
            className="flex justify-end"
          >
            <Button 
              size="lg" 
              variant="secondary"
              className="bg-[#FF6F1F] hover:bg-[#FF6F1F]/90 text-white hover:scale-105 transition-all duration-300"
              onClick={() => setIsReady(true)}
            >
              {isReady ? (
                <Link href={`/lesson/${lessonId}`} className="flex items-center">
                  Start lesson
                </Link>
              ) : (
                "I'm ready!"
              )}
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}; 