import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { AlertCircle, CheckCircle2, Droplet, ArrowRight, ArrowLeft, Home } from "lucide-react";
import { Link } from "react-router-dom";

interface Question {
  id: number;
  question: string;
  description: string;
  correctAnswer: "yes" | "no";
  category: string;
}

const questions: Question[] = [
  {
    id: 1,
    question: "Are you currently taking any medication (e.g., antibiotics, blood thinners)?",
    description: "Certain medications, such as antibiotics or blood thinners, can affect the quality and safety of donated blood.",
    correctAnswer: "no",
    category: "medication"
  },
  {
    id: 2,
    question: "Are you between 18 to 65 years of age?",
    description: "For your safety, there are minimum and maximum ages for blood donation. The minimum age is 18 and the maximum age is 65 for first-time donors.",
    correctAnswer: "yes",
    category: "age"
  },
  {
    id: 3,
    question: "Is your body weight at least 45 kg?",
    description: "For safe blood donation, your body must have enough blood volume to recover quickly after donating. A minimum weight of 45 kg ensures that you can donate without putting yourself at risk of weakness or complications.",
    correctAnswer: "yes",
    category: "weight"
  },
  {
    id: 4,
    question: "Have you had any infection, fever, cold, cough, weakness, dizziness, or fatigue today?",
    description: "If you're feeling unwell, your body needs its resources to recover, and donating blood may worsen your condition.",
    correctAnswer: "no",
    category: "health"
  },
  {
    id: 5,
    question: "Have you undergone any surgery or major dental procedure recently (last 6–12 months)?",
    description: "Recent surgeries or major dental work may involve infections, healing wounds, or medication use that make donation unsafe.",
    correctAnswer: "no",
    category: "surgery"
  },
  {
    id: 6,
    question: "Did you have at least 6 hours of sleep last night?",
    description: "Adequate rest before donation ensures your body is in a stable condition, helping you avoid dizziness or fatigue afterward.",
    correctAnswer: "yes",
    category: "rest"
  },
  {
    id: 7,
    question: "Did you eat a light (non-oily) meal 2–3 hours before donating?",
    description: "Eating a light, non-oily meal before donating helps maintain stable blood sugar and reduces the risk of dizziness during or after donation.",
    correctAnswer: "yes",
    category: "meal"
  },
  {
    id: 8,
    question: "Have you had any tattoos, piercings, or acupuncture in the last 6 months?",
    description: "These procedures may carry a risk of infections like hepatitis or HIV if done with unsterile equipment.",
    correctAnswer: "no",
    category: "tattoo"
  },
  {
    id: 9,
    question: "Have you consumed alcohol in the last 24 hours?",
    description: "Alcohol affects hydration levels, blood composition, and judgment, making blood donation unsafe. It can also impair the quality of the donated blood.",
    correctAnswer: "no",
    category: "alcohol"
  }
];

const DonorEligibilityCheck = () => {
  const navigate = useNavigate();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<{ [key: number]: "yes" | "no" }>({});
  const [showResults, setShowResults] = useState(false);

  const progress = ((currentQuestion + 1) / questions.length) * 100;
  const currentQ = questions[currentQuestion];

  const handleAnswer = (answer: "yes" | "no") => {
    console.log("Answer clicked:", answer, "for question:", currentQ.id);
    setAnswers({ ...answers, [currentQ.id]: answer });
    console.log("Updated answers:", { ...answers, [currentQ.id]: answer });
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setShowResults(true);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const checkEligibility = () => {
    let eligible = true;
    const failedQuestions: Question[] = [];

    questions.forEach((q) => {
      if (answers[q.id] !== q.correctAnswer) {
        eligible = false;
        failedQuestions.push(q);
      }
    });

    return { eligible, failedQuestions };
  };

  const { eligible, failedQuestions } = showResults ? checkEligibility() : { eligible: true, failedQuestions: [] };

  if (showResults) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-pink-50 to-orange-50 py-12 px-4">
        <div className="container mx-auto max-w-3xl">
          <Link to="/home" className="inline-flex items-center gap-2 text-primary hover:underline mb-6">
            <Home className="w-4 h-4" />
            Back to Home
          </Link>

          <Card className="p-8 md:p-12 bg-white/95 backdrop-blur-xl shadow-2xl border border-white/50">
            {eligible ? (
              <>
                {/* Eligible Result */}
                <div className="text-center mb-8">
                  <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle2 className="w-12 h-12 text-green-600" />
                  </div>
                  <h1 className="text-4xl font-bold text-green-600 mb-4">
                    🎉 You're Eligible to Donate!
                  </h1>
                  <p className="text-xl text-gray-700 mb-6">
                    Congratulations! You meet all the requirements for blood donation.
                  </p>
                  <div className="bg-green-50 border-l-4 border-green-500 p-4 mb-6">
                    <p className="text-sm text-green-800">
                      Your donation can save up to <strong>3 lives</strong>! Thank you for being a hero.
                    </p>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button
                    onClick={() => navigate("/donor-register")}
                    size="lg"
                    className="bg-gradient-to-r from-[#C8102E] to-[#a00d25] hover:from-[#a00d25] hover:to-[#800a1f] text-white rounded-full px-8 py-6 text-lg"
                  >
                    <Droplet className="w-5 h-5 mr-2" />
                    Proceed to Registration
                  </Button>
                  <Button
                    onClick={() => navigate("/events")}
                    variant="outline"
                    size="lg"
                    className="rounded-full px-8 py-6 text-lg"
                  >
                    Find Donation Camps
                  </Button>
                </div>
              </>
            ) : (
              <>
                {/* Not Eligible Result */}
                <div className="text-center mb-8">
                  <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <AlertCircle className="w-12 h-12 text-red-600" />
                  </div>
                  <h1 className="text-4xl font-bold text-red-600 mb-4">
                    Currently Not Eligible
                  </h1>
                  <p className="text-xl text-gray-700 mb-6">
                    Based on your responses, you are not eligible to donate blood at this time.
                  </p>
                </div>

                {/* Failed Questions */}
                <div className="bg-red-50 border-l-4 border-red-500 p-6 mb-6">
                  <h3 className="font-bold text-red-800 mb-3">Reasons for Ineligibility:</h3>
                  <ul className="space-y-2">
                    {failedQuestions.map((q) => (
                      <li key={q.id} className="text-sm text-red-700 flex items-start gap-2">
                        <span className="text-red-500 mt-1">•</span>
                        <span>{q.description}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Information */}
                <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6">
                  <p className="text-sm text-blue-800">
                    <strong>Don't worry!</strong> These restrictions are temporary and for your safety. 
                    You may be eligible to donate in the future once these conditions change.
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button
                    onClick={() => {
                      setShowResults(false);
                      setCurrentQuestion(0);
                      setAnswers({});
                    }}
                    variant="outline"
                    size="lg"
                    className="rounded-full px-8 py-6"
                  >
                    Retake Quiz
                  </Button>
                  <Button
                    onClick={() => navigate("/home")}
                    size="lg"
                    className="rounded-full px-8 py-6"
                  >
                    Back to Home
                  </Button>
                </div>
              </>
            )}
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-pink-50 to-orange-50 py-12 px-4">
      <div className="container mx-auto max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <Link to="/home" className="inline-flex items-center gap-2 text-primary hover:underline mb-6">
            <Home className="w-4 h-4" />
            Back to Home
          </Link>
          <div className="flex items-center justify-center gap-3 mb-4">
            <Droplet className="w-10 h-10 text-[#C8102E]" />
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900">
              Check Your Eligibility
            </h1>
          </div>
          <p className="text-lg text-gray-600">
            Answer these questions to see if you're eligible to donate blood
          </p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-700">
              Question {currentQuestion + 1} of {questions.length}
            </span>
            <span className="text-sm font-medium text-gray-700">
              {Math.round(progress)}% Complete
            </span>
          </div>
          <Progress value={progress} className="h-3" />
        </div>

        {/* Question Card */}
        <Card className="p-8 md:p-12 bg-white/95 backdrop-blur-xl shadow-2xl border border-white/50 animate-fade-in">
          <div className="mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
              {currentQ.question}
            </h2>
            <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r-lg">
              <p className="text-gray-700 leading-relaxed">
                {currentQ.description}
              </p>
            </div>
          </div>

          {/* Answer Options */}
          <div className="space-y-4 mb-8">
            <button
              type="button"
              onClick={() => handleAnswer("yes")}
              className={`w-full flex items-center justify-center space-x-3 border-2 rounded-xl p-6 transition-all text-lg font-medium ${
                answers[currentQ.id] === "yes"
                  ? "border-green-500 bg-green-50 text-green-700"
                  : "border-gray-200 hover:border-green-500 hover:bg-green-50 text-gray-700"
              }`}
            >
              <span className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                answers[currentQ.id] === "yes" ? "border-green-500 bg-green-500" : "border-gray-300"
              }`}>
                {answers[currentQ.id] === "yes" && (
                  <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                )}
              </span>
              <span className="flex-1 text-left">Yes</span>
            </button>
            
            <button
              type="button"
              onClick={() => handleAnswer("no")}
              className={`w-full flex items-center justify-center space-x-3 border-2 rounded-xl p-6 transition-all text-lg font-medium ${
                answers[currentQ.id] === "no"
                  ? "border-red-500 bg-red-50 text-red-700"
                  : "border-gray-200 hover:border-red-500 hover:bg-red-50 text-gray-700"
              }`}
            >
              <span className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                answers[currentQ.id] === "no" ? "border-red-500 bg-red-500" : "border-gray-300"
              }`}>
                {answers[currentQ.id] === "no" && (
                  <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                )}
              </span>
              <span className="flex-1 text-left">No</span>
            </button>
          </div>

          {/* Navigation Buttons */}
          <div className="flex justify-between gap-4">
            <Button
              onClick={handlePrevious}
              disabled={currentQuestion === 0}
              variant="outline"
              size="lg"
              className="rounded-full"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Previous
            </Button>
            <Button
              onClick={handleNext}
              disabled={!answers[currentQ.id]}
              size="lg"
              className="bg-gradient-to-r from-[#C8102E] to-[#a00d25] hover:from-[#a00d25] hover:to-[#800a1f] text-white rounded-full"
            >
              {currentQuestion === questions.length - 1 ? "See Results" : "Next"}
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </Card>

        {/* Tips Section */}
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-600">
            💡 <strong>Tip:</strong> Answer honestly to ensure your safety and the safety of blood recipients.
          </p>
        </div>
      </div>
    </div>
  );
};

export default DonorEligibilityCheck;

