/**
 * Simulated generated exercises endpoints with sample data taken from the Figma mockups.
 *
 * @author G0nz4loQu3dena
 * @packageDocumentation
 */

import type { ExercisesContract } from '@/services/exercises.contract'
import type { CourseExerciseCatalog } from '@/types/exercise'
import { SUBTOPICS } from './courses.mock'
import { isEmptyScenario, respond } from './scenario'

/**
 * Sample exercise catalogs of the teacher's courses.
 */
export const EXERCISE_CATALOGS: CourseExerciseCatalog[] = [
  {
    courseId: 'course-1',
    generatedCount: 40,
    subtopics: [
      {
        subtopicId: 'sub-1',
        subtopicName: 'Recursividad y Backtracking',
        generatedCount: 20,
        approvedCount: 18,
        discardedCount: 2,
        exercises: [
          {
            id: 'ex-1',
            subtopicId: 'sub-1',
            statement: '¿Cuál es el valor retornado por fact(4)?',
            code: 'int fact(int n) {\n  if (n <= 1) return 1;\n  return n * fact(n - 1);\n}',
            summary: 'Opción múltiple · Dificultad media',
            difficulty: 'Dificultad media',
            generatedAt: 'Hoy, 10:12',
            sourceMaterial: 'recursividad.pdf',
            status: 'approved',
            options: [
              { letter: 'A', text: '12', isCorrect: false },
              { letter: 'B', text: '24', isCorrect: true },
              { letter: 'C', text: '16', isCorrect: false },
              { letter: 'D', text: '4', isCorrect: false },
            ],
            checks: [
              { label: 'Corrección técnica', passed: true, detail: 'La respuesta 24 es única y se comprobó ejecutando el código.' },
              { label: 'Nivel de dificultad', passed: true, detail: 'Estimada media, coherente con el dominio objetivo del subtema.' },
              { label: 'Anclaje curricular', passed: true, detail: 'Basado en recursividad.pdf, páginas 6 y 7.' },
            ],
          },
          {
            id: 'ex-2',
            subtopicId: 'sub-1',
            statement: '¿Cuántas llamadas realiza fib(5) sin memoización?',
            code: 'int fib(int n) {\n  if (n < 2) return n;\n  return fib(n - 1) + fib(n - 2);\n}',
            summary: 'Opción múltiple · Dificultad declarada alta',
            difficulty: 'Dificultad declarada alta',
            generatedAt: 'Hoy, 10:12',
            sourceMaterial: 'recursividad.pdf',
            status: 'discarded',
            options: [
              { letter: 'A', text: '8', isCorrect: false },
              { letter: 'B', text: '9', isCorrect: false },
              { letter: 'C', text: '15', isCorrect: true },
              { letter: 'D', text: '25', isCorrect: false },
            ],
            checks: [
              { label: 'Corrección técnica', passed: true, detail: 'La respuesta 15 es única y verificable.' },
              { label: 'Nivel de dificultad', passed: false, detail: 'Declarada alta pero estimada baja: no corresponde al nivel objetivo.' },
              { label: 'Anclaje curricular', passed: true, detail: 'Basado en recursividad.pdf, página 9.' },
            ],
          },
        ],
      },
      {
        subtopicId: 'sub-2',
        subtopicName: 'Árboles Binarios de Búsqueda',
        generatedCount: 20,
        approvedCount: 18,
        discardedCount: 2,
        exercises: [
          {
            id: 'ex-3',
            subtopicId: 'sub-2',
            statement: '¿Qué garantiza el recorrido in-order en un BST?',
            code: '',
            summary: 'Opción múltiple · Dificultad baja',
            difficulty: 'Dificultad baja',
            generatedAt: 'Ayer, 16:40',
            sourceMaterial: 'arboles-bst.pdf',
            status: 'approved',
            options: [
              { letter: 'A', text: 'Visita los nodos por niveles', isCorrect: false },
              { letter: 'B', text: 'Visita las claves en orden ascendente', isCorrect: true },
              { letter: 'C', text: 'Visita primero la raíz', isCorrect: false },
              { letter: 'D', text: 'Visita primero las hojas', isCorrect: false },
            ],
            checks: [
              { label: 'Corrección técnica', passed: true, detail: 'La propiedad del BST asegura una única respuesta correcta.' },
              { label: 'Nivel de dificultad', passed: true, detail: 'Estimada baja, coherente con el dominio objetivo del subtema.' },
              { label: 'Anclaje curricular', passed: true, detail: 'Basado en arboles-bst.pdf, página 4.' },
            ],
          },
        ],
      },
    ],
  },
  { courseId: 'course-2', generatedCount: 0, subtopics: [] },
]

/**
 * Simulated implementation of {@link ExercisesContract}.
 */
export const exercisesMock: ExercisesContract = {
  listCatalogs: () => respond(isEmptyScenario() ? [] : EXERCISE_CATALOGS),
  generate: (_courseId, subtopicId) =>
    respond({
      subtopicName: SUBTOPICS.find((subtopic) => subtopic.id === subtopicId)?.name ?? '',
      generatedCount: 10,
      approvedCount: 9,
      discardedCount: 1,
    }),
}
