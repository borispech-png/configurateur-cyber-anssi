import React, { useEffect, useState, useRef } from 'react';
import { ChevronRight, ChevronLeft, FileText, Info, Save, CheckCircle, Clock, SkipForward, Settings2 } from 'lucide-react';
import { Domain, Answers, Question } from '../types';
import Modal from './Modal';

const WEBINAR_TIMER_SECONDS = 3 * 60; // 3 minutes

interface QuestionnaireProps {
  domains: Domain[];
  step: number;
  answers: Answers;
  onAnswer: (questionId: string, value: number) => void;
  onNext: () => void;
  onPrevious: () => void;
  domainColor: string;
  isWebinaire?: boolean;
  isHost?: boolean; // Secret host/presenter mode — shows timer controls
}

const Questionnaire: React.FC<QuestionnaireProps> = ({
  domains, step, answers, onAnswer, onNext, onPrevious, domainColor, isWebinaire = false, isHost = false
}) => {
  const [modalQuestion, setModalQuestion] = useState<Question | null>(null);

  // --- Timer configuration (host can change duration) ---
  const DURATION_OPTIONS = [
    { label: '30 sec (test)', value: 30 },
    { label: '1 minute', value: 60 },
    { label: '2 minutes', value: 120 },
    { label: '3 minutes', value: 180 },
    { label: '5 minutes', value: 300 },
    { label: '10 minutes', value: 600 },
  ];
  const [timerDuration, setTimerDuration] = useState(WEBINAR_TIMER_SECONDS);

  // --- Timer state (webinar mode only) ---
  // timerActive: countdown is running
  // timeLeft: seconds remaining
  // timerDone: countdown finished, user can proceed
  const [timerActive, setTimerActive] = useState(false);
  const [timeLeft, setTimeLeft] = useState(WEBINAR_TIMER_SECONDS);
  const [timerDone, setTimerDone] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const currentDomain = domains[step];
  const allQuestionsAnswered = currentDomain?.questions.every(q => answers[q.id] !== undefined) ?? false;

  // Reset timer each time the domain changes
  useEffect(() => {
    setTimerActive(false);
    setTimerDone(false);
    setTimeLeft(timerDuration);
    if (intervalRef.current) clearInterval(intervalRef.current);
  }, [step, timerDuration]);

  // Start timer when all questions are answered in webinar mode
  useEffect(() => {
    if (!isWebinaire) return;
    if (allQuestionsAnswered && !timerActive && !timerDone) {
      setTimerActive(true);
    }
  }, [allQuestionsAnswered, isWebinaire, timerActive, timerDone]);

  // Countdown logic
  useEffect(() => {
    if (!timerActive) return;
    intervalRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(intervalRef.current!);
          setTimerActive(false);
          setTimerDone(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [timerActive]);

  // HOST: skip timer instantly
  const handleSkipTimer = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setTimerActive(false);
    setTimerDone(true);
    setTimeLeft(0);
  };

  // HOST: change duration and reset timer
  const handleChangeDuration = (newDuration: number) => {
    setTimerDuration(newDuration);
    // Will be picked up by the reset effect on next domain,
    // but also update current timer display if not yet started
    if (!timerActive && !timerDone) setTimeLeft(newDuration);
  };

  // Can the user go to next domain?
  const canProceed = isWebinaire
    ? allQuestionsAnswered && timerDone
    : allQuestionsAnswered;

  // Format seconds to MM:SS
  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  // Progress % for the ring
  const progressPct = ((WEBINAR_TIMER_SECONDS - timeLeft) / WEBINAR_TIMER_SECONDS) * 100;
  const radius = 36;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progressPct / 100) * circumference;

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [step]);

  if (!currentDomain) {
    return <div className="text-center py-8"><p className="text-gray-600 dark:text-gray-400">Chargement...</p></div>;
  }

  const borderColorClass = domainColor.replace('bg-', 'border-');

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-800 dark:to-slate-900 p-8 flex items-center justify-center">
        <div className="max-w-4xl w-full mx-auto">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl p-8">
            {/* Progress bar */}
            <div className="mb-8">
              <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-2">
                <span className="font-semibold">Progression de l'audit</span>
                <span className="font-semibold">{step + 1}/{domains.length} domaines</span>
              </div>
              <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-indigo-500 to-indigo-600 transition-all duration-300"
                  style={{ width: `${((step + 1) / domains.length) * 100}%` }}
                />
              </div>
              <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
                <span>Début</span>
                <span>{Math.round(((step + 1) / domains.length) * 100)}% complété</span>
                <span>Fin</span>
              </div>
            </div>

            {/* Domain header */}
            <div className="mb-8 pb-6 border-b-2 border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-3 mb-2">
                <span className="text-5xl">{currentDomain.icon}</span>
                <div>
                  <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100">{currentDomain.title}</h2>
                  <p className="text-gray-600 dark:text-gray-400 mt-1">{currentDomain.description}</p>
                </div>
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                Domaine {step + 1} sur {domains.length} • {currentDomain.questions.length} questions
              </p>
            </div>

            {/* Questions */}
            <div className="space-y-8 mb-8">
              {currentDomain.questions.map((question, qIdx) => (
                <div key={question.id} className={`bg-gray-50 dark:bg-gray-900/50 rounded-lg p-6 border-l-4 ${borderColorClass}`}>
                  <div className="flex items-start justify-between mb-4">
                    <h3 className="font-semibold text-lg text-gray-900 dark:text-gray-100 flex-1">
                      {qIdx + 1}. {question.text}
                    </h3>
                    {question.help && (
                      <button onClick={() => setModalQuestion(question)} className="ml-2 text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300" aria-label={`Plus d'informations sur ${question.text}`}>
                        <Info size={20} />
                      </button>
                    )}
                  </div>
                  <div className="space-y-2">
                    {question.options.map((option, optIdx) => (
                      <button
                        key={optIdx}
                        onClick={() => onAnswer(question.id, optIdx)}
                        className={`w-full text-left p-4 rounded-lg border-2 transition relative ${
                          answers[question.id] === optIdx
                            ? `border-indigo-600 bg-indigo-50 dark:bg-indigo-900/50 dark:border-indigo-400 shadow-md`
                            : 'border-gray-200 dark:border-gray-600 hover:border-indigo-300 dark:hover:border-indigo-500 hover:bg-white dark:hover:bg-gray-700 hover:shadow'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                            answers[question.id] === optIdx ? 'border-indigo-600 dark:border-indigo-400' : 'border-gray-300 dark:border-gray-500'
                          }`}>
                            {answers[question.id] === optIdx && (
                              <div className="w-4 h-4 rounded-full bg-indigo-600 dark:bg-indigo-400" />
                            )}
                          </div>
                          <div className="flex-1">
                            <span className={`${answers[question.id] === optIdx ? 'font-semibold text-indigo-900 dark:text-indigo-200' : 'text-gray-700 dark:text-gray-300'}`}>
                              {option}
                            </span>
                            {answers[question.id] === optIdx && optIdx < 2 && question.ugapSuggestion && (
                              <div className="text-xs text-indigo-600 dark:text-indigo-400 mt-1 font-semibold flex items-center gap-1 animate-fade-in-up">
                                <span role="img" aria-label="ugap">🛍️</span> Solution UGAP identifiée
                              </div>
                            )}
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="mb-6 text-center">
              <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center justify-center gap-1">
                <Save size={14} />
                Sauvegarde automatique activée
              </p>
            </div>

            {/* ===== WEBINAR TIMER PANEL ===== */}
            {isWebinaire && allQuestionsAnswered && !timerDone && (
              <div className="mb-6 p-5 bg-amber-50 dark:bg-amber-900/20 border-2 border-amber-300 dark:border-amber-600 rounded-xl text-center animate-fade-in-up">
                <p className="font-bold text-amber-800 dark:text-amber-200 text-base mb-1">
                  🎙️ Bravo ! Attendez le commentateur
                </p>
                <p className="text-sm text-amber-700 dark:text-amber-300 mb-4">
                  Toutes vos réponses sont enregistrées. Le domaine suivant s'ouvrira dans :
                </p>

                {/* Countdown ring */}
                <div className="flex justify-center mb-3">
                  <div className="relative w-24 h-24">
                    <svg className="w-full h-full -rotate-90" viewBox="0 0 88 88">
                      {/* Background circle */}
                      <circle cx="44" cy="44" r={radius} fill="none" stroke="#fde68a" strokeWidth="6" />
                      {/* Progress arc */}
                      <circle
                        cx="44" cy="44" r={radius} fill="none"
                        stroke="#d97706"
                        strokeWidth="6"
                        strokeLinecap="round"
                        strokeDasharray={circumference}
                        strokeDashoffset={strokeDashoffset}
                        style={{ transition: 'stroke-dashoffset 1s linear' }}
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-2xl font-bold font-mono text-amber-700 dark:text-amber-300">
                        {formatTime(timeLeft)}
                      </span>
                    </div>
                  </div>
                </div>
                <p className="text-xs text-amber-600 dark:text-amber-400 italic">
                  Profitez de ce temps pour noter vos observations.
                </p>

                {/* ===== SECRET HOST CONTROLS (invisible for participants) ===== */}
                {isHost && (
                  <div className="mt-4 pt-4 border-t border-amber-300 dark:border-amber-600">
                    <p className="text-xs text-amber-700 dark:text-amber-300 font-bold mb-2 flex items-center justify-center gap-1">
                      <Settings2 size={13} /> Contrôles Animateur
                    </p>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-2">
                      {/* Skip button */}
                      <button
                        onClick={handleSkipTimer}
                        className="flex items-center gap-1.5 px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-lg transition-colors"
                      >
                        <SkipForward size={14} />
                        Passer le timer
                      </button>
                      {/* Duration selector */}
                      <select
                        value={timerDuration}
                        onChange={(e) => handleChangeDuration(Number(e.target.value))}
                        title="Durée du timer"
                        className="px-3 py-2 text-xs rounded-lg border border-amber-400 bg-white dark:bg-gray-700 text-amber-800 dark:text-amber-200 font-semibold focus:outline-none cursor-pointer"
                      >
                        {DURATION_OPTIONS.map(opt => (
                          <option key={opt.value} value={opt.value}>{opt.label}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Timer done confirmation */}
            {isWebinaire && timerDone && allQuestionsAnswered && step < domains.length - 1 && (
              <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border-2 border-green-300 dark:border-green-600 rounded-xl text-center">
                <p className="font-bold text-green-800 dark:text-green-200 flex items-center justify-center gap-2">
                  <CheckCircle size={18} />
                  Le prochain domaine est maintenant disponible !
                </p>
              </div>
            )}

            {/* Navigation */}
            <div className="flex gap-4">
              <button
                onClick={onPrevious}
                disabled={step === 0}
                className={`flex-1 py-4 rounded-lg font-semibold transition flex items-center justify-center gap-2 ${
                  step === 0
                    ? 'bg-gray-200 text-gray-400 dark:bg-gray-700 dark:text-gray-500 cursor-not-allowed'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-600 dark:text-gray-200 dark:hover:bg-gray-500'
                }`}
              >
                <ChevronLeft size={20} />
                Domaine précédent
              </button>
              <button
                onClick={onNext}
                disabled={!canProceed}
                className={`flex-1 py-4 rounded-lg font-semibold text-white transition flex items-center justify-center gap-2 ${
                  canProceed
                    ? 'bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600'
                    : 'bg-gray-300 dark:bg-gray-600 cursor-not-allowed text-gray-500 dark:text-gray-400'
                }`}
              >
                {step === domains.length - 1 ? (
                  <>
                    <FileText size={20} />
                    Voir le récapitulatif
                  </>
                ) : (
                  <>
                    {isWebinaire && timerActive ? (
                      <><Clock size={20} /> En attente du commentateur...</>
                    ) : (
                      <>Domaine suivant <ChevronRight size={20} /></>
                    )}
                  </>
                )}
              </button>
            </div>

            {!allQuestionsAnswered && (
              <p className="text-center text-sm text-orange-600 dark:text-orange-400 mt-3 font-semibold">
                ⚠️ Veuillez répondre à toutes les questions pour continuer
              </p>
            )}
          </div>
        </div>
      </div>

      <Modal isOpen={!!modalQuestion} onClose={() => setModalQuestion(null)} title={modalQuestion?.text || ''}>
        <p className="text-gray-600 dark:text-gray-300 whitespace-pre-wrap">{modalQuestion?.help}</p>
      </Modal>
    </>
  );
};

export default Questionnaire;