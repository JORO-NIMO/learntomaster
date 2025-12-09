import { Subject, LearnerProfile, Topic, Lesson, Assessment, Question, LearnerProgress, AdaptiveRecommendation } from '@/types';

// Mock Learner Profile
export const mockLearner: LearnerProfile = {
  id: 'learner-001',
  email: 'student@learn2master.ug',
  name: 'Nakato Sarah',
  role: 'learner',
  avatar: '',
  schoolId: 'school-001',
  createdAt: new Date('2024-01-15'),
  grade: 'S5',
  stream: 'Sciences',
  enrolledSubjects: ['math', 'physics', 'chemistry', 'biology'],
  overallMastery: 68,
  totalXp: 4520,
  streak: 7,
  preferences: {
    learningPace: 'moderate',
    preferredContentType: ['interactive', 'video'],
    dailyGoalMinutes: 45,
    notificationsEnabled: true,
  },
};

// Mock Subjects aligned with Uganda A-Level CBC
export const mockSubjects: Subject[] = [
  {
    id: 'math',
    name: 'Mathematics',
    code: 'MTH',
    description: 'Advanced Mathematics covering Pure Mathematics, Mechanics, and Statistics',
    icon: '📐',
    color: '#3b82f6',
    topics: [],
    competencies: [],
  },
  {
    id: 'physics',
    name: 'Physics',
    code: 'PHY',
    description: 'Explore mechanics, electricity, waves, and modern physics concepts',
    icon: '⚛️',
    color: '#8b5cf6',
    topics: [],
    competencies: [],
  },
  {
    id: 'chemistry',
    name: 'Chemistry',
    code: 'CHM',
    description: 'Physical, Organic, and Inorganic Chemistry fundamentals',
    icon: '🧪',
    color: '#10b981',
    topics: [],
    competencies: [],
  },
  {
    id: 'biology',
    name: 'Biology',
    code: 'BIO',
    description: 'Cell biology, genetics, ecology, and human physiology',
    icon: '🧬',
    color: '#22c55e',
    topics: [],
    competencies: [],
  },
  {
    id: 'geography',
    name: 'Geography',
    code: 'GEO',
    description: 'Physical and human geography with focus on East Africa',
    icon: '🌍',
    color: '#f59e0b',
    topics: [],
    competencies: [],
  },
  {
    id: 'economics',
    name: 'Economics',
    code: 'ECO',
    description: 'Micro and macroeconomics with Ugandan context',
    icon: '📊',
    color: '#ef4444',
    topics: [],
    competencies: [],
  },
  {
    id: 'history',
    name: 'History',
    code: 'HIS',
    description: 'African and World History with emphasis on Uganda',
    icon: '📜',
    color: '#78716c',
    topics: [],
    competencies: [],
  },
  {
    id: 'english',
    name: 'English Language',
    code: 'ENG',
    description: 'Advanced English language skills and literature',
    icon: '📚',
    color: '#0ea5e9',
    topics: [],
    competencies: [],
  },
];

// Mock Topics for Mathematics
export const mockMathTopics: Topic[] = [
  {
    id: 'math-topic-1',
    subjectId: 'math',
    name: 'Algebra & Functions',
    description: 'Polynomials, functions, equations and inequalities',
    order: 1,
    lessons: [],
    estimatedHours: 25,
  },
  {
    id: 'math-topic-2',
    subjectId: 'math',
    name: 'Coordinate Geometry',
    description: 'Lines, circles, and conic sections in the coordinate plane',
    order: 2,
    lessons: [],
    estimatedHours: 20,
  },
  {
    id: 'math-topic-3',
    subjectId: 'math',
    name: 'Calculus',
    description: 'Differentiation and integration techniques',
    order: 3,
    lessons: [],
    estimatedHours: 35,
  },
  {
    id: 'math-topic-4',
    subjectId: 'math',
    name: 'Trigonometry',
    description: 'Trigonometric functions, identities, and equations',
    order: 4,
    lessons: [],
    estimatedHours: 18,
  },
  {
    id: 'math-topic-5',
    subjectId: 'math',
    name: 'Statistics & Probability',
    description: 'Data analysis, probability distributions, and inference',
    order: 5,
    lessons: [],
    estimatedHours: 22,
  },
];

// Mock Lessons for Algebra topic
export const mockLessons: Lesson[] = [
  {
    id: 'lesson-alg-1',
    topicId: 'math-topic-1',
    title: 'Introduction to Polynomials',
    description: 'Learn about polynomial expressions, degree, and basic operations',
    order: 1,
    type: 'mixed',
    duration: 30,
    content: {
      sections: [
        {
          id: 'sec-1',
          type: 'text',
          title: 'What is a Polynomial?',
          content: 'A polynomial is an algebraic expression consisting of variables and coefficients, involving only addition, subtraction, multiplication, and non-negative integer exponents.',
        },
        {
          id: 'sec-2',
          type: 'example',
          title: 'Examples of Polynomials',
          content: '• 3x² + 2x - 5 (Quadratic polynomial)\n• x³ - 4x² + x + 1 (Cubic polynomial)\n• 5 (Constant polynomial)',
        },
        {
          id: 'sec-3',
          type: 'interactive',
          title: 'Practice: Identify the Degree',
          content: 'interactive-degree-identifier',
        },
      ],
      resources: [
        {
          id: 'res-1',
          type: 'pdf',
          title: 'Polynomial Worksheet',
          url: '/resources/polynomials.pdf',
        },
      ],
    },
    assessments: [],
    competencyIndicators: ['ci-math-alg-1', 'ci-math-alg-2'],
    prerequisites: [],
  },
  {
    id: 'lesson-alg-2',
    topicId: 'math-topic-1',
    title: 'Factoring Polynomials',
    description: 'Master techniques for factoring polynomial expressions',
    order: 2,
    type: 'mixed',
    duration: 45,
    content: {
      sections: [],
      resources: [],
    },
    assessments: [],
    competencyIndicators: ['ci-math-alg-3'],
    prerequisites: ['lesson-alg-1'],
  },
  {
    id: 'lesson-alg-3',
    topicId: 'math-topic-1',
    title: 'Quadratic Equations',
    description: 'Solve quadratic equations using multiple methods',
    order: 3,
    type: 'interactive',
    duration: 50,
    content: {
      sections: [],
      resources: [],
    },
    assessments: [],
    competencyIndicators: ['ci-math-alg-4', 'ci-math-alg-5'],
    prerequisites: ['lesson-alg-2'],
  },
];

// Mock Quiz Questions
export const mockQuizQuestions: Question[] = [
  {
    id: 'q-1',
    type: 'multiple_choice',
    question: 'What is the degree of the polynomial 4x³ - 2x² + 7x - 1?',
    options: ['1', '2', '3', '4'],
    correctAnswer: '3',
    explanation: 'The degree of a polynomial is the highest power of the variable. Here, the highest power is 3 (from 4x³), so the degree is 3.',
    hint: 'Look for the term with the largest exponent.',
    difficulty: 'easy',
    points: 10,
  },
  {
    id: 'q-2',
    type: 'multiple_choice',
    question: 'Factor completely: x² - 9',
    options: ['(x-3)(x-3)', '(x+3)(x+3)', '(x-3)(x+3)', '(x-9)(x+1)'],
    correctAnswer: '(x-3)(x+3)',
    explanation: 'This is a difference of squares: a² - b² = (a-b)(a+b). Here, x² - 9 = x² - 3² = (x-3)(x+3).',
    hint: 'This is a difference of two perfect squares.',
    difficulty: 'medium',
    points: 15,
  },
  {
    id: 'q-3',
    type: 'multiple_choice',
    question: 'Solve: x² + 5x + 6 = 0',
    options: ['x = -2, x = -3', 'x = 2, x = 3', 'x = -2, x = 3', 'x = 2, x = -3'],
    correctAnswer: 'x = -2, x = -3',
    explanation: 'Factor the quadratic: x² + 5x + 6 = (x+2)(x+3) = 0. Setting each factor to zero: x+2=0 gives x=-2, x+3=0 gives x=-3.',
    hint: 'Find two numbers that multiply to 6 and add to 5.',
    difficulty: 'medium',
    points: 15,
  },
  {
    id: 'q-4',
    type: 'true_false',
    question: 'Every polynomial of degree n has exactly n roots.',
    options: ['True', 'False'],
    correctAnswer: 'False',
    explanation: 'A polynomial of degree n has at most n roots (by the Fundamental Theorem of Algebra), but some roots may be complex or repeated. The statement as given is not always true for real numbers.',
    difficulty: 'hard',
    points: 20,
  },
  {
    id: 'q-5',
    type: 'fill_blank',
    question: 'The quadratic formula is x = (-b ± √(b² - ___)) / 2a',
    correctAnswer: '4ac',
    explanation: 'The complete quadratic formula is x = (-b ± √(b² - 4ac)) / 2a, used to solve ax² + bx + c = 0.',
    hint: 'Think about the discriminant.',
    difficulty: 'easy',
    points: 10,
  },
];

// Mock Learner Progress
export const mockProgress: LearnerProgress = {
  learnerId: 'learner-001',
  subjectId: 'math',
  topicProgresses: [
    {
      topicId: 'math-topic-1',
      completedLessons: ['lesson-alg-1', 'lesson-alg-2'],
      masteryLevel: 'proficient',
      masteryScore: 78,
      timeSpent: 120,
      assessmentScores: [
        {
          assessmentId: 'assess-1',
          score: 85,
          maxScore: 100,
          completedAt: new Date('2024-11-20'),
          timeSpent: 25,
          attempts: 1,
          answers: [],
        },
      ],
    },
    {
      topicId: 'math-topic-2',
      completedLessons: ['lesson-coord-1'],
      masteryLevel: 'developing',
      masteryScore: 52,
      timeSpent: 45,
      assessmentScores: [],
    },
    {
      topicId: 'math-topic-3',
      completedLessons: [],
      masteryLevel: 'novice',
      masteryScore: 0,
      timeSpent: 0,
      assessmentScores: [],
    },
  ],
  overallMastery: 68,
  lastAccessedAt: new Date(),
};

// Mock Recommendations from AI Engine
export const mockRecommendations: AdaptiveRecommendation[] = [
  {
    type: 'lesson',
    itemId: 'lesson-alg-3',
    reason: 'Continue your progress in Algebra - you\'re doing great!',
    priority: 'high',
    estimatedTime: 50,
  },
  {
    type: 'practice',
    itemId: 'practice-alg-2',
    reason: 'Strengthen your factoring skills with extra practice',
    priority: 'medium',
    estimatedTime: 20,
  },
  {
    type: 'review',
    itemId: 'lesson-alg-1',
    reason: 'Quick review to reinforce polynomial basics',
    priority: 'low',
    estimatedTime: 15,
  },
];

// Subject progress data for dashboard
export const mockSubjectProgress = [
  { subject: 'Mathematics', progress: 68, lessons: 12, completed: 8 },
  { subject: 'Physics', progress: 45, lessons: 15, completed: 7 },
  { subject: 'Chemistry', progress: 72, lessons: 14, completed: 10 },
  { subject: 'Biology', progress: 58, lessons: 16, completed: 9 },
];

// Weekly activity data
export const mockWeeklyActivity = [
  { day: 'Mon', minutes: 45 },
  { day: 'Tue', minutes: 60 },
  { day: 'Wed', minutes: 30 },
  { day: 'Thu', minutes: 75 },
  { day: 'Fri', minutes: 50 },
  { day: 'Sat', minutes: 90 },
  { day: 'Sun', minutes: 40 },
];
