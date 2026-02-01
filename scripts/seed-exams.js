const mongoose = require("mongoose");
const fs = require("fs");
const path = require("path");

// Direct connection string for environments with SRV resolution issues
const MONGODB_URI = "mongodb://alexlamper:alexlamper@ac-s8m3361-shard-00-00.ehvonkm.mongodb.net:27017,ac-s8m3361-shard-00-01.ehvonkm.mongodb.net:27017,ac-s8m3361-shard-00-02.ehvonkm.mongodb.net:27017/gratis-theorie?ssl=true&replicaSet=atlas-11sn9i-shard-0&authSource=admin&retryWrites=true&w=majority";

const QuestionSchema = new mongoose.Schema({
  index: { type: Number, required: true },
  question_text: { type: String, required: true },
  answers: [{ type: String }],
  correct_answer_indices: [{ type: mongoose.Schema.Types.Mixed }],
  correct_answer_raw: { type: mongoose.Schema.Types.Mixed }, 
  image: { type: String },
  explanation: { type: String },
});

const ExamSchema = new mongoose.Schema({
  exam_id: { type: Number, required: true, unique: true },
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  questions: [QuestionSchema],
  created_at: { type: Date, default: Date.now },
}, { collection: "exams" });

const Exam = mongoose.models.Exam || mongoose.model("Exam", ExamSchema);

async function seedExams() {
  try {
    console.log("Attempting direct connection to MongoDB shards...");
    await mongoose.connect(MONGODB_URI, {
      serverSelectionTimeoutMS: 20000, 
    });
    console.log(" Successfully connected to MongoDB via direct shard connection.");

    const examsDir = path.join(__dirname, "../scraped-data/scraped_exams_fast");
    if (!fs.existsSync(examsDir)) {
        throw new Error(`Directory not found: ${examsDir}`);
    }
    
    const files = fs.readdirSync(examsDir).filter(f => f.endsWith(".json"));
    console.log(`Found ${files.length} exam files to seed.`);

    const allExams = [];

    for (const file of files) {
      const filePath = path.join(examsDir, file);
      const data = JSON.parse(fs.readFileSync(filePath, "utf8"));

      const exam_id = data.exam_id;
      const slug = `oefenexamen-auto-${exam_id}`;
      const title = `Oefenexamen Auto ${exam_id}`;

      const questions = data.questions.map(q => {
        let imagePath = null;
        if (q.image) {
          const urlMatch = q.image.match(/\/([^\/\?]+)\.jpg/);
          if (urlMatch) {
            imagePath = `/images/exams/${urlMatch[1]}.jpg`;
          }
        }

        const options = q.answers || [];
        if (options.length === 0) {
            // Fill with defaults if missing, similar to frontend logic
            if (q.correct_answer_indices?.length === 3) {
                // Hazard detection
            }
        }

        return {
          index: q.index,
          question_text: q.question,
          answers: options,
          correct_answer_indices: q.correct_answer_indices || [],
          correct_answer_raw: q.correct_answer_raw || null,
          image: imagePath,
          explanation: q.explanation || ""
        };
      });

      const examData = {
        exam_id,
        title,
        slug,
        questions
      };

      allExams.push(examData);

      await Exam.findOneAndUpdate(
        { exam_id },
        examData,
        { upsert: true, new: true }
      );
      console.log(`- Seeded ${title}`);
    }

    const fallbackPath = path.join(__dirname, "../docs/exams.json");
    fs.writeFileSync(fallbackPath, JSON.stringify(allExams, null, 2));
    console.log(" All exams seeded and local fallback updated.");
  } catch (error) {
    console.error("\n SEEDING FAILED:");
    console.error(error.message);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
  }
}

seedExams();
