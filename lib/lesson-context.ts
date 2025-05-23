import fs from 'fs';
import path from 'path';

type LessonSection = {
  title: string;
  icon: string;
  content?: string;
  listItems?: string[];
};

export type LessonContextData = {
  context: {
    introduction: string;
    sections: LessonSection[];
  };
};

/**
 * Carga el contexto de una lección desde un archivo JSON
 * @param lessonId - El ID de la lección
 * @returns Los datos de contexto de la lección o un contexto por defecto si no existe el archivo
 */
export async function getLessonContext(lessonId: number): Promise<LessonContextData> {
  try {
    const filePath = path.join(process.cwd(), 'content', 'lessons', `${lessonId}.json`);
    
    // Verificar si existe el archivo
    if (fs.existsSync(filePath)) {
      const fileContent = await fs.promises.readFile(filePath, 'utf8');
      return JSON.parse(fileContent);
    } else {
      console.log(`No se encontró archivo de contexto para la lección ${lessonId}, usando contexto por defecto`);
      return getDefaultLessonContext();
    }
  } catch (error) {
    console.error(`Error al cargar el contexto de la lección ${lessonId}:`, error);
    return getDefaultLessonContext();
  }
}

/**
 * Proporciona un contexto por defecto para las lecciones que no tienen un archivo JSON propio
 */
function getDefaultLessonContext(): LessonContextData {
  return {
    context: {
      introduction: "En esta lección aprenderás conceptos importantes que te ayudarán a responder las preguntas correctamente.",
      sections: [
        {
          title: "Información General",
          icon: "BookOpen",
          content: "Esta lección contiene una serie de preguntas diseñadas para reforzar tu aprendizaje. Lee atentamente y analiza cada pregunta antes de responder."
        },
        {
          title: "Objetivos",
          icon: "Target",
          content: "Completar todos los desafíos de esta lección te ayudará a dominar el tema y avanzar en tu aprendizaje."
        },
        {
          title: "Estructura",
          icon: "ListChecks",
          content: "La lección está organizada en preguntas que aumentan gradualmente en dificultad. Cada respuesta correcta te acercará a completar la lección."
        },
        {
          title: "Consejos",
          icon: "LightbulbIcon",
          listItems: [
            "Lee cuidadosamente cada pregunta antes de responder",
            "Observa todas las opciones disponibles",
            "Tómate tu tiempo para pensar en la respuesta correcta",
            "Si te equivocas, perderás un corazón"
          ]
        }
      ]
    }
  };
} 