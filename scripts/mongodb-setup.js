const db = this.db
const use = db.use

// Switch to the gratis-theorie database
use("gratis-theorie")

// Create the questions collection with sample data
db.questions.insertMany([
  // AUTO CATEGORY QUESTIONS
  {
    question: "Wat is de maximumsnelheid binnen de bebouwde kom?",
    options: ["30 km/h", "50 km/h", "60 km/h", "70 km/h"],
    correctAnswer: 1,
    explanation: "Binnen de bebouwde kom is de maximumsnelheid 50 km/h, tenzij anders aangegeven.",
    category: "auto",
    difficulty: "easy",
    createdAt: new Date(),
  },
  {
    question: "Wanneer moet je je richtingaanwijzer gebruiken?",
    options: [
      "Alleen bij het afslaan",
      "Bij elke verandering van richting of rijstrook",
      "Alleen op de snelweg",
      "Alleen bij het parkeren",
    ],
    correctAnswer: 1,
    explanation:
      "Je moet altijd je richtingaanwijzer gebruiken bij elke verandering van richting of rijstrook om andere weggebruikers te waarschuwen.",
    category: "auto",
    difficulty: "easy",
    createdAt: new Date(),
  },
  {
    question: "Wat betekent een geel verkeerslicht?",
    options: ["Doorrijden is toegestaan", "Stop, tenzij dit gevaarlijk is", "Snelheid verhogen", "Alleen voor bussen"],
    correctAnswer: 1,
    explanation:
      "Geel licht betekent dat je moet stoppen, tenzij dit gevaarlijk zou zijn (bijvoorbeeld als je al heel dicht bij het stoplicht bent).",
    category: "auto",
    difficulty: "medium",
    createdAt: new Date(),
  },
  {
    question: "Wat is de minimale volgafstand op de snelweg bij 100 km/h?",
    options: ["1 seconde", "2 seconden", "3 seconden", "4 seconden"],
    correctAnswer: 2,
    explanation:
      "De minimale volgafstand op de snelweg is 3 seconden. Dit geeft je voldoende tijd om te reageren bij noodremmen.",
    category: "auto",
    difficulty: "medium",
    createdAt: new Date(),
  },
  {
    question: "Wanneer mag je een doorgetrokken streep overschrijden?",
    options: ["Nooit", "Bij inhalen", "Alleen in noodgevallen", "Bij het verlaten van de weg"],
    correctAnswer: 3,
    explanation:
      "Een doorgetrokken streep mag alleen worden overschreden bij het verlaten van de weg (bijvoorbeeld bij het inrijden van een oprit).",
    category: "auto",
    difficulty: "hard",
    createdAt: new Date(),
  },
  {
    question: "Wat is de maximale alcoholpromillage voor beginnende bestuurders?",
    options: ["0,0‰", "0,2‰", "0,5‰", "0,8‰"],
    correctAnswer: 0,
    explanation: "Voor beginnende bestuurders (eerste 5 jaar na het behalen van het rijbewijs) geldt 0,0‰ alcohol.",
    category: "auto",
    difficulty: "medium",
    createdAt: new Date(),
  },
  {
    question: "Hoe lang is een Nederlandse rijbewijs geldig?",
    options: ["5 jaar", "10 jaar", "15 jaar", "Levenslang"],
    correctAnswer: 1,
    explanation: "Een Nederlands rijbewijs is 10 jaar geldig en moet daarna worden verlengd.",
    category: "auto",
    difficulty: "easy",
    createdAt: new Date(),
  },
  {
    question: "Wat moet je doen bij een voorrangsbord (driehoek met punt naar beneden)?",
    options: [
      "Stoppen",
      "Voorrang verlenen aan alle verkeer",
      "Alleen voorrang verlenen aan verkeer van rechts",
      "Snelheid minderen",
    ],
    correctAnswer: 1,
    explanation: "Bij een voorrangsbord moet je voorrang verlenen aan al het verkeer op de kruisende weg.",
    category: "auto",
    difficulty: "medium",
    createdAt: new Date(),
  },
])

// Create indexes for better performance
db.questions.createIndex({ category: 1 })
db.questions.createIndex({ difficulty: 1 })
db.questions.createIndex({ category: 1, difficulty: 1 })

// Create categories collection with metadata
db.categories.insertMany([
  {
    id: "auto",
    name: "Auto (Categorie B)",
    description: "Theorie-examen voor personenauto's en lichte bedrijfsvoertuigen",
    minimumAge: 17,
    maxWeight: 3500,
    maxPassengers: 8,
    active: true,
    createdAt: new Date(),
  },
  {
    id: "scooter",
    name: "Scooter (Categorie AM)",
    description: "Theorie-examen voor bromfietsen en lichte quadricycles",
    minimumAge: 16,
    maxSpeed: 45,
    maxEngine: 50,
    active: true,
    createdAt: new Date(),
  },
  {
    id: "motor",
    name: "Motor (Categorie A)",
    description: "Theorie-examen voor motorfietsen en zware quadricycles",
    minimumAge: 18,
    subcategories: ["A1", "A2", "A"],
    active: true,
    createdAt: new Date(),
  },
])

console.log("Database setup completed successfully!")
console.log("Collections created: questions, categories")
console.log("Sample data inserted for all categories")
