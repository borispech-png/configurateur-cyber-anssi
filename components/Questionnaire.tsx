import React, { useEffect, useState } from 'react';
import { ChevronRight, ChevronLeft, FileText, Info, Save, CheckCircle } from 'lucide-react';
import { Domain, Answers, Question } from '../types';
import Modal from './Modal';

interface QuestionnaireProps {
  domains: Domain[];
  step: number;
  answers: Answers;
  onAnswer: (questionId: string, value: number) => void;
  onNext: () => void;
  onPrevious: () => void;
  domainColor: string;
}

const Questionnaire: React.FC<QuestionnaireProps> = ({ domains, step, answers, onAnswer, onNext, onPrevious, domainColor }) => {
  const [modalQuestion, setModalQuestion] = useState<Question | null>(null);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [step]);
  
  const currentDomain = domains[step];
  if (!currentDomain) {
    return <div className="text-center py-8"><p className="text-gray-600 dark:text-gray-400">Chargement...</p></div>;
  }

  const allQuestionsAnswered = currentDomain.questions.every(q => answers[q.id] !== undefined);
  const borderColorClass = domainColor.replace('bg-', 'border-');

  const handleOpenModal = (question: Question) => {
    setModalQuestion(question);
  };

  const handleCloseModal = () => {
    setModalQuestion(null);
  };

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
                      <button onClick={() => handleOpenModal(question)} className="ml-2 text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300" aria-label={`Plus d'informations sur ${question.text}`}>
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
                            answers[question.id] === optIdx
                              ? 'border-indigo-600 dark:border-indigo-400'
                              : 'border-gray-300 dark:border-gray-500'
                          }`}>
                            {answers[question.id] === optIdx && (
                              <div className="w-4 h-4 rounded-full bg-indigo-600 dark:bg-indigo-400" />
                            )}
                          </div>
                          <div className="flex-1">
                              <span className={`${
                                answers[question.id] === optIdx ? 'font-semibold text-indigo-900 dark:text-indigo-200' : 'text-gray-700 dark:text-gray-300'
                              }`}>
                                {option}
                              </span>
                              
                              {/* Nudge UGAP si réponse faible et solution existe */}
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
                disabled={!allQuestionsAnswered}
                className={`flex-1 py-4 rounded-lg font-semibold text-white transition flex items-center justify-center gap-2 ${
                  allQuestionsAnswered
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
                    Domaine suivant
                    <ChevronRight size={20} />
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

      <Modal
        isOpen={!!modalQuestion}
        onClose={handleCloseModal}
        title={modalQuestion?.text || ''}
      >
        <p className="text-gray-600 dark:text-gray-300 whitespace-pre-wrap">{modalQuestion?.help}</p>
      </Modal>
    </>
  );
};

export default Questionnaire;