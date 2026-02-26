import React, { useState, useEffect, useMemo, useCallback } from 'react';
import ClientInfoForm from './components/ClientInfoForm';
import Questionnaire from './components/Questionnaire';
import Summary from './components/Summary';
import Report from './components/Report';
import ThemeSwitcher from './components/ThemeSwitcher';
import LoginScreen from './components/LoginScreen';
import { ClientInfo, Answers, Domain, Recommendation, BudgetPhase, Theme } from './types';
import { DOMAINS, BENCHMARKS, BUDGET_ITEMS } from './constants';
import { useWebinaire } from './hooks/useWebinaire';
import WebinarConsentScreen from './components/WebinarConsentScreen';

type View = 'clientInfo' | 'questionnaire' | 'summary' | 'report';

const App: React.FC = () => {
  const { isWebinaire, isHost } = useWebinaire();
  // In webinar mode, skip the login screen entirely
  const [isAuthenticated, setIsAuthenticated] = useState(isWebinaire);
  // In webinar mode, show consent screen first
  const [consentGiven, setConsentGiven] = useState(!isWebinaire);
  const [view, setView] = useState<View>('clientInfo');
  const [step, setStep] = useState<number>(0);
  const [clientInfo, setClientInfo] = useState<ClientInfo>({
    name: '', type: '', size: '', sector: '', contact: '', email: ''
  });
  const [answers, setAnswers] = useState<Answers>({});
  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof window !== 'undefined' && window.localStorage) {
        const storedTheme = window.localStorage.getItem('theme') as Theme;
        if (storedTheme) return storedTheme;
        if (window.matchMedia('(prefers-color-scheme: dark)').matches) return 'dark';
    }
    return 'light';
  });
  
  const toggleTheme = useCallback(() => {
    setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
  }, []);

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);


  // Auto-save logic
  useEffect(() => {
    if (!isAuthenticated) return;
    const saveData = { clientInfo, answers, step, view, timestamp: new Date().toISOString() };
    if (clientInfo.name) {
      sessionStorage.setItem('cyber-audit', JSON.stringify(saveData));
    }
  }, [clientInfo, answers, step, view, isAuthenticated]);

  // Restore logic
  useEffect(() => {
    const saved = sessionStorage.getItem('cyber-audit');
    if (saved) {
      try {
        const data = JSON.parse(saved);
        const savedDate = new Date(data.timestamp);
        const now = new Date();
        const hoursDiff = (now.getTime() - savedDate.getTime()) / (1000 * 60 * 60);
        
        // In webinar mode, don't offer to restore a previous session - always start fresh
        if (!isWebinaire && hoursDiff < 24 && data.clientInfo?.name) {
          if (confirm(`Reprendre l'audit de "${data.clientInfo.name}" commencé il y a ${Math.round(hoursDiff)}h ?`)) {
            setClientInfo(data.clientInfo);
            setAnswers(data.answers);
            setStep(data.step);
            setView(data.view || 'questionnaire');
          }
        }
      } catch (e) {
        console.error('Erreur chargement données:', e);
      }
    }
  }, [isWebinaire]);

  // Scroll to top on view change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [view]);

  const handleClientInfoChange = useCallback((field: keyof ClientInfo, value: string) => {
    setClientInfo(prev => ({ ...prev, [field]: value }));
  }, []);

  const handleAnswerChange = useCallback((questionId: string, value: number) => {
    setAnswers(prev => ({ ...prev, [questionId]: value }));
  }, []);

  const handleNextStep = useCallback(() => {
    if (step < DOMAINS.length - 1) {
      setStep(prev => prev + 1);
    } else {
      setView('summary');
    }
  }, [step]);

  const handlePreviousStep = useCallback(() => {
    if (step > 0) {
      setStep(prev => prev - 1);
    }
  }, [step]);

  // --- Calculations ---
  const calculations = useMemo(() => {
    const calculateMaturity = (): number => {
      let totalScore = 0;
      let maxScore = 0;
      DOMAINS.forEach(domain => {
        domain.questions.forEach(q => {
          maxScore += (q.options.length - 1) * q.weight;
          const answer = answers[q.id];
          if (answer !== undefined) {
            totalScore += answer * q.weight;
          }
        });
      });
      if (maxScore === 0) return 0;
      return Math.round((totalScore / maxScore) * 100);
    };

    const calculateDomainScores = (): { [key: string]: number } => {
      const scores: { [key: string]: number } = {};
      DOMAINS.forEach(domain => {
        let totalScore = 0;
        let maxScore = 0;
        domain.questions.forEach(q => {
          maxScore += (q.options.length - 1) * q.weight;
          const answer = answers[q.id];
          if (answer !== undefined) {
            totalScore += answer * q.weight;
          }
        });
        scores[domain.title] = maxScore > 0 ? Math.round((totalScore / maxScore) * 100) : 0;
      });
      return scores;
    };

    const generateRecommendations = (): Recommendation[] => {
      const recs: Recommendation[] = [];
      DOMAINS.forEach(domain => {
        domain.questions.forEach(q => {
          const answer = answers[q.id] || 0;
          if (answer < 2) {
            recs.push({
              domain: domain.title,
              domainIcon: domain.icon,
              question: q.text,
              level: answer === 0 ? 'critique' : 'important',
              priority: q.weight,
              currentState: q.options[answer],
              targetState: q.options[q.options.length - 1],
              questionId: q.id,
              ugapSuggestion: q.ugapSuggestion,
              effort: q.effort, // Propager l'effort
              impact: q.impact, // Propager l'impact
            });
          }
        });
      });
      return recs.sort((a, b) => {
        if (a.level === 'critique' && b.level !== 'critique') return -1;
        if (a.level !== 'critique' && b.level === 'critique') return 1;
        return b.priority - a.priority;
      });
    };

    const generateBudget = (recs: Recommendation[]): BudgetPhase[] => {
        const phases: BudgetPhase[] = [
            { name: 'Phase 1 : Socle de sécurité', period: '0-6 mois', description: 'Mise en conformité minimale ANSSI - Protection de base', items: [], total: 0, recurrentTotal: 0, priority: 'Critique' },
            { name: 'Phase 2 : Détection & réponse', period: '6-12 mois', description: 'Capacités de supervision, détection et réaction', items: [], total: 0, recurrentTotal: 0, priority: 'Important' },
            { name: 'Phase 3 : Optimisation & amélioration', period: '12-24 mois', description: 'Automatisation et amélioration continue', items: [], total: 0, recurrentTotal: 0, priority: 'Recommandé' }
        ];

        recs.forEach(rec => {
            const budgetItem = BUDGET_ITEMS[rec.questionId];
            if (budgetItem) {
                const phase = phases[budgetItem.phase];
                if (!phase.items.find(i => i.name === budgetItem.name)) {
                    phase.items.push(budgetItem);
                    phase.total += budgetItem.cost;
                    phase.recurrentTotal += (budgetItem.recurrent || 0); // Ajouter le récurrent
                }
            }
        });
        return phases;
    };

    const getBenchmark = () => {
      // Prioritize the specific sector field if it matches a benchmark key
      if (clientInfo.sector && BENCHMARKS[clientInfo.sector]) {
        return BENCHMARKS[clientInfo.sector];
      }
      // Fallback to the general type field
      if (clientInfo.type && BENCHMARKS[clientInfo.type]) {
        return BENCHMARKS[clientInfo.type];
      }
      // If no match, return null
      return null;
    };

    const recommendations = generateRecommendations();
    const budget = generateBudget(recommendations);
    const totalBudget = budget.reduce((sum, phase) => sum + phase.total, 0);
    const benchmark = getBenchmark();

    return {
      maturity: calculateMaturity(),
      domainScores: calculateDomainScores(),
      recommendations,
      budget,
      totalBudget,
      benchmark,
    };
  }, [answers, clientInfo.type, clientInfo.sector]);
  
  const handleReset = useCallback(() => {
    if (confirm("Attention, cela va effacer toutes les données de l'audit actuel. Voulez-vous continuer ?")) {
      sessionStorage.removeItem('cyber-audit');
      setClientInfo({ name: '', type: '', size: '', sector: '', contact: '', phone: '' });
      setAnswers({});
      setStep(0);
      setView('clientInfo');
    }
  }, []);

  const themeSwitcher = <ThemeSwitcher theme={theme} onToggle={toggleTheme} />;

  const handleExportAudit = useCallback(() => {
    const data = {
      clientInfo,
      answers,
      step,
      view: 'report', // Force resume at report
      timestamp: new Date().toISOString(),
      version: '1.0'
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `audit_${clientInfo.name.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, [clientInfo, answers, step]);

  const handleImportAudit = useCallback((jsonData: string) => {
      try {
          const data = JSON.parse(jsonData);
          // Very basic validation
          if (data.clientInfo && data.answers) {
              setClientInfo(data.clientInfo);
              setAnswers(data.answers);
              setStep(data.step || 0);
              setView(data.view || 'summary');
              alert(`Audit importé avec succès : ${data.clientInfo.name}`);
          } else {
              alert("Fichier invalide : format incorrect.");
          }
      } catch (e) {
          console.error("Erreur import", e);
          alert("Erreur lors de la lecture du fichier.");
      }
  }, []);

  // --- Render logic ---
  // Webinar: show consent screen first if not yet consented
  if (isWebinaire && !consentGiven) {
    return <WebinarConsentScreen onConsent={() => setConsentGiven(true)} />;
  }

  if (!isAuthenticated) {
    return (
      <>
        <div className="fixed top-4 right-4 z-50">
           {themeSwitcher}
        </div>
        <LoginScreen onLogin={() => setIsAuthenticated(true)} />
      </>
    );
  }

  switch (view) {
    case 'clientInfo':
      return <ClientInfoForm 
                clientInfo={clientInfo} 
                onClientInfoChange={handleClientInfoChange} 
                onStart={() => setView('questionnaire')} 
                themeSwitcher={themeSwitcher}
                onImport={handleImportAudit}
                isWebinaire={isWebinaire}
             />;
    
    case 'questionnaire':
      return <Questionnaire 
                domains={DOMAINS} 
                step={step} 
                answers={answers} 
                onAnswer={handleAnswerChange} 
                onNext={handleNextStep} 
                onPrevious={handlePreviousStep}
                domainColor={DOMAINS[step]?.color || 'bg-gray-500'}
                isWebinaire={isWebinaire}
                isHost={isHost}
             />;
      
    case 'summary':
      return <Summary {...calculations} clientInfo={clientInfo} onEdit={() => setView('questionnaire')} onGenerateReport={() => setView('report')} />;
      
    case 'report':
      return <Report 
                {...calculations} 
                clientInfo={clientInfo} 
                answers={answers} 
                onBack={() => setView('summary')} 
                onReset={handleReset} 
                onExport={handleExportAudit}
                theme={theme} 
                themeSwitcher={themeSwitcher}
                isWebinaire={isWebinaire}
             />;
      
    default:
      return <div>Erreur: Vue non reconnue.</div>;
  }
};

export default App;