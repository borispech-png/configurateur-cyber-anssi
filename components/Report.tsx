import React, { useRef, useEffect, useState } from 'react';
import { useReactToPrint } from 'react-to-print';
import { Shield, ChevronLeft, Download, BarChart3, ListChecks, Target, CreditCard, Award, GitMerge, Info, Link, RefreshCw, ShoppingBag, Book, Save } from 'lucide-react';
import { ClientInfo, Recommendation, BudgetPhase, Theme, Answers, Benchmark } from '../types';
import { DOMAINS, ANSSI_SOLUTIONS, GLOSSARY, BUDGET_ITEMS } from '../constants';
import RadialProgress from './RadialProgress';
import MaturityRadar from './MaturityRadar';
import QuickWinMatrix from './QuickWinMatrix';
import HighlightGlossary from './HighlightGlossary';
import { ToggleLeft, ToggleRight, ArrowRight } from 'lucide-react';

interface ReportProps {
  clientInfo: ClientInfo;
  maturity: number;
  domainScores: { [key: string]: number };
  recommendations: Recommendation[];
  budget: BudgetPhase[];
  totalBudget: number;
  theme: Theme;
  themeSwitcher: React.ReactNode;
  onBack: () => void;
  onReset: () => void;
  answers: Answers;
  benchmark: Benchmark | null;
  onExport: () => void;
}

const Report: React.FC<ReportProps> = ({ clientInfo, maturity, domainScores, recommendations, budget, totalBudget, theme, themeSwitcher, onBack, onReset, answers, benchmark, onExport }) => {
  const reportRef = useRef<HTMLDivElement>(null);
  const [activeSection, setActiveSection] = useState<string>('synthese');
  const sectionRefs = useRef<{[key: string]: HTMLElement | null}>({});
  
  // -- Simulation State --
  const [selectedPhases, setSelectedPhases] = useState<number[]>([]);

  // -- Simulation Logic --
  const projectedData = React.useMemo(() => {
    if (selectedPhases.length === 0) return null;

    // 1. Identify questions fixed by selected phases
    const fixedQuestions = new Set<string>();
    selectedPhases.forEach(phaseIndex => {
        // Find all budget items belonging to this phase
        Object.values(BUDGET_ITEMS).forEach(item => {
            if (item.phase === phaseIndex) {
                 // BUDGET_ITEMS keys are questionIds, but here we iterate values.
                 // We need to find the key. Actually budget items are indexed by questionID in constants.
                 // So we need to iterate entries.
            }
        });
        Object.entries(BUDGET_ITEMS).forEach(([qId, item]) => {
            if (item.phase === phaseIndex) {
                fixedQuestions.add(qId);
            }
        });
    });

    // 2. Patch answers
    const patchedAnswers = { ...answers };
    // We need to find the max score index for each fixed question
    DOMAINS.forEach(d => {
        d.questions.forEach(q => {
            if (fixedQuestions.has(q.id)) {
                // Set to max score (last option)
                patchedAnswers[q.id] = q.options.length - 1;
            }
        });
    });

    // 3. Recalculate Scores (Duplicated logic from App.tsx for local simulation)
    let totalScore = 0;
    let maxScore = 0;
    const pDomainScores: { [key: string]: number } = {};

    DOMAINS.forEach(domain => {
        let dTotal = 0;
        let dMax = 0;
        domain.questions.forEach(q => {
            dMax += (q.options.length - 1) * q.weight;
            const ans = patchedAnswers[q.id];
             if (ans !== undefined) {
                dTotal += ans * q.weight;
            }
        });
        pDomainScores[domain.title] = dMax > 0 ? Math.round((dTotal / dMax) * 100) : 0;
        totalScore += dTotal;
        maxScore += dMax;
    });

    const pMaturity = maxScore === 0 ? 0 : Math.round((totalScore / maxScore) * 100);
    
    return {
        maturity: pMaturity,
        domainScores: pDomainScores,
        gain: pMaturity - maturity
    };

  }, [answers, selectedPhases, maturity]);


  const handleDownload = useReactToPrint({
    contentRef: reportRef,
    documentTitle: `Audit_Cyber_ANSSI_${clientInfo.name}`,
    pageStyle: `
      @page {
        size: A4;
        margin: 10mm;
      }
      @media print {
        body {
          -webkit-print-color-adjust: exact;
        }
        header, nav, button, .no-print {
          display: none !important;
        }
        main {
           width: 100% !important;
           margin: 0 !important;
           padding: 0 !important;
           box-shadow: none !important;
        }
        section {
            break-inside: auto;
            page-break-inside: auto;
        }
        h2 {
            break-after: avoid;
            page-break-after: avoid;
        }
        .print-break-avoid {
            break-inside: avoid !important;
            page-break-inside: avoid !important;
            display: block !important;
        }
      }
    `
  });

    const togglePhase = (phaseIndex: number) => {
        setSelectedPhases(prev => 
            prev.includes(phaseIndex) 
            ? prev.filter(p => p !== phaseIndex) 
            : [...prev, phaseIndex]
        );
    };

    // --- RENDER HELPERS ---
    const getPhaseCost = (phaseIndex: number) => {
        return budget[phaseIndex]?.total || 0;
    }

  const sections = [
      { id: 'synthese', label: 'Synthèse Managériale', icon: BarChart3 },
      { id: 'resilience', label: 'Focus Cyber-Résilience', icon: Shield },
      { id: 'scores', label: 'Scores de Maturité', icon: GitMerge },
      { id: 'recommandations', label: 'Recommandations Priorisées', icon: ListChecks },
      { id: 'budget', label: 'Budget Prévisionnel', icon: CreditCard },
      { id: 'catalogue', label: 'Solutions Qualifiées ANSSI', icon: Award },
      { id: 'glossaire', label: 'Glossaire Pédagogique', icon: Book }
  ];

  useEffect(() => {
    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    setActiveSection(entry.target.id);
                }
            });
        },
        { rootMargin: '-20% 0px -80% 0px', threshold: 0 }
    );

    Object.values(sectionRefs.current).forEach(section => {
        if (section) {
            observer.observe(section);
        }
    });

    return () => {
        Object.values(sectionRefs.current).forEach(section => {
            if (section) {
                observer.unobserve(section);
            }
        });
    };
  }, []);


  
  const getMaturityText = (score: number) => {
    if (score < 40) return { text: 'Initial', color: 'text-red-500' };
    if (score < 70) return { text: 'Géré', color: 'text-yellow-500' };
    return { text: 'Optimisé', color: 'text-green-500' };
  };

  const maturityDetails = getMaturityText(maturity);
  
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('fr-FR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
  };

  /* --- LOGIC PROPOSITION 4: Hardware Obsolescence Logic --- */
  const getHardwareRefreshRecommendation = () => {
      // obs-1: Serveurs (0=Vieux/Risque, 3=Recent/Top)
      // obs-2: Stockage (0=EOS/Risque, 3=Support J+1)
      const serverAgeIdx = answers['obs-1'] || 0;
      const storageSupportIdx = answers['obs-2'] || 0;

      // Logic INVERTED: Low index = High Risk
      const needsServerRefresh = serverAgeIdx <= 1; // 0 (>7ans) or 1 (5-7ans)
      const needsStorageRefresh = storageSupportIdx <= 1; // 0 (EOS) or 1 (Pas de baie/Risque)

      if (!needsServerRefresh && !needsStorageRefresh) return null;

      return {
          title: "Plan de Renouvellement Urgent (Cyber-Compliance)",
          items: [
              ...(needsServerRefresh ? [{
                  label: "Renouvellement Compute",
                  desc: "Vos serveurs sont trop anciens pour être sécurisés efficacement (Firmware/TPM).",
                  ugap: "HPE ProLiant Gen11 / Dell PowerEdge",
                  ref: "Marché Serveurs"
              }] : []),
              ...(needsStorageRefresh ? [{
                  label: "Modernisation Stockage",
                  desc: "Stockage hors support = Risque maximal de perte de données sans recours.",
                  ugap: "PureStorage / NetApp / HPE Alletra",
                  ref: "Marché Stockage"
              }] : [])
          ]
      };
  };
  const hardwareRec = getHardwareRefreshRecommendation();

  return (
    <div className="bg-gray-100 dark:bg-slate-900">
        {/* Header */}
        <header className="sticky top-0 z-40 bg-white dark:bg-gray-800 shadow-md">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-3 flex justify-between items-center">
                <div className="flex items-center gap-3">
                    {clientInfo.logo ? (
                        <img src={clientInfo.logo} alt="Logo Client" className="h-10 w-auto object-contain" />
                    ) : (
                        <Shield className="text-indigo-600 dark:text-indigo-400" size={32} />
                    )}
                    <h1 className="text-xl font-bold text-gray-800 dark:text-gray-200 hidden sm:block">Rapport d'Audit Cyber</h1>
                </div>
                <div className="flex items-center gap-2">
                     <button
                        onClick={onExport}
                        className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors no-print"
                        title="Sauvegarder le dossier client (JSON)"
                    >
                        <Save size={18} />
                        <span className="hidden sm:inline">Sauvegarder</span>
                    </button>
                    <button
                        onClick={handleDownload}
                        className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors no-print"
                    >
                        <Download size={18} />
                        <span className="hidden sm:inline">Télécharger PDF</span>
                    </button>
                    <button
                        onClick={onReset}
                        className="flex items-center gap-2 px-4 py-2 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 rounded-lg transition-colors no-print"
                        title="Réinitialiser"
                    >
                        <RefreshCw size={18} />
                    </button>
                    <button onClick={onBack} className="px-4 py-2 text-sm font-semibold text-gray-700 dark:text-gray-200 bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500 rounded-lg transition flex items-center gap-2">
                        <ChevronLeft size={16} />
                        Retour
                    </button>
                    {themeSwitcher}
                </div>
            </div>
        </header>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
            <div className="sm:flex sm:gap-8">
                {/* Side Navigation */}
                <nav className="hidden sm:block w-64 flex-shrink-0">
                    <div className="sticky top-24">
                        <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">Sections du Rapport</h3>
                        <ul className="space-y-2">
                            {sections.map(section => (
                                <li key={section.id}>
                                    <a
                                        href={`#${section.id}`}
                                        className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                                            activeSection === section.id
                                                ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/50 dark:text-indigo-300'
                                                : 'text-gray-600 hover:bg-gray-200 dark:text-gray-300 dark:hover:bg-gray-700'
                                        }`}
                                    >
                                        <section.icon size={18} />
                                        <span>{section.label}</span>
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>
                </nav>

                {/* Main Content */}
                <main ref={reportRef} className="flex-1 min-w-0">
                    <div className="bg-white dark:bg-gray-800 p-8 sm:p-12 rounded-xl shadow-lg">
                        {/* Report Header */}
                        <div className="text-center pb-8 border-b-2 border-gray-200 dark:border-gray-700">
                            <Shield className="mx-auto text-indigo-600 dark:text-indigo-400 mb-4" size={56} />
                            <h1 className="text-4xl font-extrabold text-gray-900 dark:text-gray-100">Rapport d'Audit de Cybersécurité</h1>
                            <p className="mt-2 text-lg text-gray-600 dark:text-gray-400">Basé sur les recommandations de l'ANSSI</p>
                        </div>

                        {/* Client Info */}
                        <div className="mt-8 grid grid-cols-2 gap-x-8 gap-y-4 text-sm text-gray-700 dark:text-gray-300">
                            <div><strong>Organisme :</strong> {clientInfo.name}</div>
                            <div><strong>Type :</strong> {clientInfo.type}</div>
                            <div><strong>Date du rapport :</strong> {formatDate(new Date())}</div>
                            <div><strong>Taille :</strong> {clientInfo.size}</div>
                            {clientInfo.contact && <div><strong>Contact :</strong> {clientInfo.contact}</div>}
                            {clientInfo.phone && <div><strong>Téléphone :</strong> {clientInfo.phone}</div>}
                        </div>

                        {/* --- Hardware Obsolescence Alert (Si détecté) --- */}
                        {hardwareRec && (
                          <section id="hardware" className="mt-12 bg-orange-50 dark:bg-orange-900/30 border-l-4 border-orange-500 p-6 rounded-md print-break-avoid">
                              <h2 className="text-2xl font-bold text-orange-800 dark:text-orange-200 flex items-center gap-3 mb-4">
                                  <ShoppingBag size={28} />
                                  {hardwareRec.title}
                              </h2>
                              <p className="text-gray-700 dark:text-gray-300 mb-4">
                                  L'audit a révélé une obsolescence matérielle critique. Avant même de parler logiciel, il est impératif de <strong>renouveler le socle physique</strong> pour garantir un niveau de sécurité minimal.
                              </p>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                  {hardwareRec.items.map((item, idx) => (
                                      <div key={idx} className="bg-white dark:bg-gray-800 p-4 rounded shadow-sm border border-orange-200 dark:border-orange-800">
                                          <h3 className="font-bold text-lg text-gray-900 dark:text-gray-100">{item.label}</h3>
                                          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 mb-3">{item.desc}</p>
                                          
                                          <div className="bg-orange-100 dark:bg-orange-900/50 p-2 rounded text-sm">
                                              <strong className="text-orange-800 dark:text-orange-300 block">Solution UGAP :</strong>
                                              <span className="text-gray-800 dark:text-gray-200">{item.ugap}</span>
                                              <span className="block text-xs text-gray-500 dark:text-gray-400 mt-1 italic">{item.ref}</span>
                                          </div>
                                      </div>
                                  ))}
                              </div>
                          </section>
                        )}

                        {/* --- Synthèse Managériale --- */}
                        {/* Fix: Changed ref callback to use a block body to prevent returning a value. */}
                        <section id="synthese" ref={el => { sectionRefs.current['synthese'] = el; }} className="mt-12 scroll-mt-20">
                            <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-3 mb-6">
                                <BarChart3 size={32} className="text-indigo-600 dark:text-indigo-400"/>
                                Synthèse Managériale
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div className="md:col-span-1 flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-700/50 rounded-lg p-6">
                                     <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">Score de Maturité Global</h3>
                                     <RadialProgress score={maturity} size={150} strokeWidth={12} />
                                     <p className={`mt-4 text-2xl font-bold ${maturityDetails.color}`}>{maturityDetails.text}</p>
                                </div>
                                <div className="md:col-span-2 space-y-4 text-gray-700 dark:text-gray-300 text-base">
                                    <p>
                                      Cet audit révèle un niveau de maturité en cybersécurité de <strong>{maturity}%</strong>,
                                      plaçant l'organisme au niveau <strong className={maturityDetails.color}>{maturityDetails.text}</strong>.
                                    </p>
                                    <p>
                                      L'analyse a identifié <strong className="text-red-600 dark:text-red-400">{recommendations.filter(r => r.level === 'critique').length} points critiques</strong> et <strong className="text-yellow-600 dark:text-yellow-400">{recommendations.filter(r => r.level === 'important').length} points importants</strong> qui nécessitent une attention particulière.
                                      Les domaines les plus faibles sont ceux de <strong className="text-gray-900 dark:text-gray-100">{Object.entries(domainScores).sort(([,a],[,b]) => a-b)[0][0]}</strong> et <strong className="text-gray-900 dark:text-gray-100">{Object.entries(domainScores).sort(([,a],[,b]) => a-b)[1][0]}</strong>,
                                      indiquant des lacunes dans les contrôles de sécurité fondamentaux.
                                    </p>
                                    <p>
                                      Un plan d'action en 3 phases est proposé pour adresser ces risques, avec un budget estimé à <strong>{totalBudget.toLocaleString('fr-FR')} €</strong>.
                                      La priorité doit être mise sur la <strong>Phase 1 (Socle de sécurité)</strong> pour corriger les vulnérabilités les plus urgentes et renforcer la posture de défense de l'organisme.
                                    </p>

                                    {/* --- BENCHMARK INTEGRATION --- */}
                                    {benchmark && (
                                      <div className={`mt-6 p-4 rounded-lg border-l-4 print-break-avoid ${maturity >= benchmark.avgMaturity ? 'bg-green-50 dark:bg-green-900/30 border-green-500' : 'bg-orange-50 dark:bg-orange-900/30 border-orange-500'}`}>
                                          <h4 className="font-bold text-lg flex items-center gap-2 mb-2 text-gray-800 dark:text-gray-200">
                                              <BarChart3 size={20} />
                                              Positionnement Sectoriel : {clientInfo.sector}
                                          </h4>
                                          <p className="text-sm text-gray-700 dark:text-gray-300 mb-3">
                                              {maturity >= benchmark.avgMaturity 
                                                  ? <span>Bravo, votre maturité est supérieure de <strong>{maturity - benchmark.avgMaturity} points</strong> à la moyenne du secteur ({benchmark.avgMaturity}%).</span>
                                                  : <span>Attention, votre maturité est inférieure de <strong>{benchmark.avgMaturity - maturity} points</strong> à la moyenne du secteur ({benchmark.avgMaturity}%).</span>
                                              }
                                              <br/>
                                              <span className="italic mt-1 block">{benchmark.description}</span>
                                          </p>
                                          
                                          <div className="mt-3">
                                              <p className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1">Top Risques du secteur :</p>
                                              <div className="flex flex-wrap gap-2">
                                                  {benchmark.topRisks.map(risk => (
                                                      <span key={risk} className="px-2 py-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded text-xs font-semibold text-gray-700 dark:text-gray-300">
                                                          {risk}
                                                      </span>
                                                  ))}
                                              </div>
                                          </div>
                                      </div>
                                    )}
                                </div>
                            </div>
                        </section>

                        {/* --- Focus Cyber-Résilience --- */}
                        <section id="resilience" ref={el => { sectionRefs.current['resilience'] = el; }} className="mt-16 scroll-mt-20">
                             <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-3 mb-6">
                                <Shield size={32} className="text-indigo-600 dark:text-indigo-400"/>
                                Focus : Cyber-Résilience & Sauvegarde
                            </h2>
                            <div className="bg-indigo-900 text-white rounded-lg p-6 shadow-lg mb-8 print-break-avoid">
                                <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                                    <ShoppingBag size={24} className="text-yellow-400" />
                                    Recommandation Spécifique UGAP
                                </h3>
                                <p className="mb-4 text-indigo-100">
                                    Basé sur votre volumétrie déclarée de <strong>{(() => {
                                        const idx = answers['res-3'] || 0;
                                        return ["< 10 To", "10 - 50 To", "50 - 150 To", "> 150 To"][idx];
                                    })()}</strong> (Back-end) :
                                </p>
                                
                                {(() => {
                                    const idx = answers['res-3'] || 0;
                                    const rec = idx <= 1 ? {
                                        product: "HPE StoreOnce / Dell Data Domain",
                                        desc: "Appliance de stockage avec déduplication agressive et verrouillage objet (Immutabilité). Idéal pour optimiser le stockage et garantir l'intégrité.",
                                        vendors: ["HPE", "Dell", "Quantum"]
                                    } : {
                                        product: "Rubrik Security Cloud / Dell Cyber Recovery",
                                        desc: "Plateforme de sécurité des données Zero Trust. Architecture Scale-out avec détection d'anomalies (Ransomware) et restauration chirurgicale.",
                                        vendors: ["Rubrik", "Dell", "HPE Zerto"]
                                    };

                                    return (
                                        <div className="bg-white/10 rounded-md p-4 border border-white/20">
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <h4 className="text-lg font-bold text-white">{rec.product}</h4>
                                                    <p className="text-sm text-indigo-200 mt-1">{rec.desc}</p>
                                                </div>
                                                <span className="bg-yellow-400 text-indigo-900 text-xs font-bold px-2 py-1 rounded uppercase tracking-wider">
                                                    Marché UGAP
                                                </span>
                                            </div>
                                            <div className="mt-3 flex gap-2">
                                                {rec.vendors.map(v => (
                                                    <span key={v} className="text-xs font-semibold bg-indigo-800 px-2 py-1 rounded text-indigo-200">{v}</span>
                                                ))}
                                            </div>
                                        </div>
                                    );
                                })()}
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="bg-gray-50 dark:bg-gray-700/50 p-5 rounded-lg border-l-4 border-blue-500">
                                    <h4 className="font-bold text-gray-900 dark:text-gray-100 mb-2">Pourquoi l'Immutabilité ?</h4>
                                    <p className="text-sm text-gray-600 dark:text-gray-300">
                                        <HighlightGlossary text="Les ransomwares modernes s'attaquent d'abord aux sauvegardes pour empêcher la restauration. L'immutabilité (WORM) garantit techniquement qu'aucune donnée ne peut être modifiée avant expiration." />
                                    </p>
                                </div>
                                <div className="bg-gray-50 dark:bg-gray-700/50 p-5 rounded-lg border-l-4 border-indigo-500">
                                    <h4 className="font-bold text-gray-900 dark:text-gray-100 mb-2">Le concept d'Air-Gap</h4>
                                    <p className="text-sm text-gray-600 dark:text-gray-300">
                                        <HighlightGlossary text="La règle du 3-2-1 impose une copie hors-site. L'Air-Gap isole cette copie du réseau. Les solutions de Cyber Recovery Vault automatisent cette isolation." />
                                    </p>
                                </div>
                            </div>
                        </section>

                        {/* --- Scores de Maturité --- */}
                        {/* Fix: Changed ref callback to use a block body to prevent returning a value. */}
                        <section id="scores" ref={el => { sectionRefs.current['scores'] = el; }} className="mt-16 scroll-mt-20">
                           <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-3 mb-6">
                                <GitMerge size={32} className="text-indigo-600 dark:text-indigo-400"/>
                                Scores de Maturité par Domaine
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              {DOMAINS.map(domain => {
                                const score = domainScores[domain.title] || 0;
                                return (
                                  <div key={domain.title} className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-5 flex items-center gap-4">
                                      <div className="flex-shrink-0">
                                          <RadialProgress score={score} size={80} strokeWidth={8} />
                                      </div>
                                      <div>
                                          <h4 className="font-bold text-lg text-gray-900 dark:text-gray-200">{domain.title}</h4>
                                          <p className="text-sm text-gray-600 dark:text-gray-400">{domain.description}</p>
                                      </div>
                                  </div>
                                );
                              })}
                            </div>
                        </section>

                        {/* --- Recommandations --- */}
                        {/* Fix: Changed ref callback to use a block body to prevent returning a value. */}
                        <section id="recommandations" ref={el => { sectionRefs.current['recommandations'] = el; }} className="mt-16 scroll-mt-20">
                            <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-3 mb-6">
                                <ListChecks size={32} className="text-indigo-600 dark:text-indigo-400"/>
                                Recommandations Priorisées
                            </h2>
                            
                            {/* --- Quick Win Matrix (Nouveau) --- */}
                            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 mb-8 print-break-avoid">
                                <h3 className="text-lg font-bold text-gray-800 dark:text-gray-200 mb-2 flex items-center gap-2">
                                    <Target size={20} className="text-blue-500"/>
                                    Matrice de Priorisation (Quick Wins)
                                </h3>
                                <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
                                    Ce graphique vous aide à décider par quoi commencer. Privilégiez les actions situées dans la zone <strong>"Quick Wins"</strong> (Impact élevé, Effort faible).
                                </p>
                                <QuickWinMatrix recommendations={recommendations} />
                            </div>

                            <div className="space-y-4">
                                {recommendations.map((rec, index) => (
                                    <div key={index} className={`print-break-avoid border-l-4 rounded-r-lg p-5 ${rec.level === 'critique' ? 'border-red-500 bg-red-50 dark:bg-red-900/40' : 'border-yellow-500 bg-yellow-50 bg-yellow-900/40'}`}>
                                        <div className="flex items-start gap-3">
                                            <span className="text-2xl mt-1">{rec.domainIcon}</span>
                                            <div>
                                                <span className={`text-xs font-bold uppercase px-2 py-1 rounded-full ${rec.level === 'critique' ? 'bg-red-200 text-red-800 dark:bg-red-700 dark:text-red-100' : 'bg-yellow-200 text-yellow-800 dark:bg-yellow-700 dark:text-yellow-100'}`}>
                                                  {rec.level}
                                                </span>
                                                <h4 className="font-bold text-lg text-gray-900 dark:text-gray-100 mt-2">
                                                    <HighlightGlossary text={rec.question} />
                                                </h4>
                                                <div className="text-sm mt-2 space-y-1 text-gray-700 dark:text-gray-300">
                                                  <p><strong>État actuel :</strong> {rec.currentState}</p>
                                                  <p className="flex items-center gap-2">
                                                    <Target size={16} className="text-green-600 dark:text-green-400" />
                                                    <strong>Objectif :</strong> <span className="font-semibold text-green-800 dark:text-green-300">{rec.targetState}</span>
                                                  </p>
                                                  {rec.ugapSuggestion && (
                                                    <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                                                        <div className="flex items-start gap-2 bg-blue-50 dark:bg-blue-900/30 p-2 rounded-md">
                                                            <ShoppingBag className="text-blue-600 dark:text-blue-400 mt-1 flex-shrink-0" size={16} />
                                                            <div>
                                                                <h5 className="text-sm font-bold text-blue-800 dark:text-blue-300">Solution UGAP Recommandée : {rec.ugapSuggestion.name}</h5>
                                                                <p className="text-xs text-blue-700 dark:text-blue-200 mt-1 mb-2">{rec.ugapSuggestion.description}</p>
                                                                <div className="flex flex-wrap gap-2 mb-1">
                                                                    {rec.ugapSuggestion.vendors.map(v => (
                                                                        <span key={v} className="px-1.5 py-0.5 bg-white dark:bg-blue-900 border border-blue-200 dark:border-blue-700 rounded text-[10px] uppercase font-bold text-blue-600 dark:text-blue-300 tracking-wider font-sans">{v}</span>
                                                                    ))}
                                                                </div>
                                                                {rec.ugapSuggestion.marketRef && <p className="text-[10px] font-mono mt-1 text-gray-500 dark:text-gray-400">Ref: {rec.ugapSuggestion.marketRef}</p>}
                                                            </div>
                                                        </div>
                                                    </div>
                                                  )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>

                        {/* --- Budget --- */}
                        {/* Fix: Changed ref callback to use a block body to prevent returning a value. */}
                        <section id="budget" ref={el => { sectionRefs.current['budget'] = el; }} className="mt-16 scroll-mt-20 print-break-avoid">
                           <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-3 mb-6">
                                <CreditCard size={32} className="text-indigo-600 dark:text-indigo-400"/>
                                Budget Prévisionnel & Services
                            </h2>
                            
                            {/* --- Cost of Inaction Estimation --- */}
                            <div className="bg-gray-100 dark:bg-gray-700/50 p-6 rounded-lg mb-8 border border-gray-200 dark:border-gray-600">
                                <h4 className="font-bold text-lg text-gray-800 dark:text-gray-200 mb-4 flex items-center gap-2">
                                    <BarChart3 size={20} className="text-gray-500" />
                                    Estimation du Retour sur Investissement (ROI)
                                </h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="bg-white dark:bg-gray-800 p-4 rounded-md shadow-sm border-l-4 border-indigo-500">
                                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Budget de Remédiation (Estimé)</p>
                                        <p className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">{totalBudget.toLocaleString('fr-FR')} €</p>
                                        <p className="text-xs text-gray-400 mt-2">Investissement planifié sur 24 mois</p>
                                    </div>
                                    <div className="bg-white dark:bg-gray-800 p-4 rounded-md shadow-sm border-l-4 border-red-500">
                                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Coût Estimé d'une Cyberattaque (Inaction)</p>
                                        <p className="text-2xl font-bold text-red-600 dark:text-red-400">
                                            {(() => {
                                                let agents = 30; // < 50
                                                if(clientInfo.size === '50-200 agents') agents = 125;
                                                if(clientInfo.size === '200-1000 agents') agents = 600;
                                                if(clientInfo.size === '> 1000 agents') agents = 2000;
                                                return (agents * 2500).toLocaleString('fr-FR');
                                            })()} € *
                                        </p>
                                        <p className="text-xs text-gray-400 mt-2">* Basé sur un impact moyen de 2 500€ / agent (Rançons, Arrêt de service, Rétablissement)</p>
                                    </div>
                                </div>
                                <p className="text-xs text-gray-500 italic mt-4">
                                    Note : Investir dans la cybersécurité coûte en moyenne 10 à 20 fois moins cher que de subir une attaque majeure (Ransomware).
                                </p>
                            </div>

                            <div className="space-y-8">
                                {budget.map((phase) => (
                                    <div key={phase.name} className="print-break-avoid border-2 border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
                                        <div className={`p-4 ${
                                              phase.priority === 'Critique' ? 'bg-red-100 dark:bg-red-900/50' :
                                              phase.priority === 'Important' ? 'bg-yellow-100 dark:bg-yellow-900/50' :
                                              'bg-blue-100 dark:bg-blue-900/50'
                                          }`}>
                                            <h3 className={`text-xl font-bold ${
                                              phase.priority === 'Critique' ? 'text-red-900 dark:text-red-200' :
                                              phase.priority === 'Important' ? 'text-yellow-900 dark:text-yellow-200' :
                                              'text-blue-900 dark:text-blue-200'
                                            }`}>{phase.name}</h3>
                                            <p className={`text-sm font-semibold ${
                                              phase.priority === 'Critique' ? 'text-red-700 dark:text-red-300' :
                                              phase.priority === 'Important' ? 'text-yellow-700 dark:text-yellow-300' :
                                              'text-blue-700 dark:text-blue-300'
                                            }`}>{phase.period} • {phase.description}</p>
                                        </div>
                                        <div className="p-4">
                                            <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                                              {phase.items.map(item => (
                                                  <li key={item.name} className="py-3 flex justify-between items-start">
                                                      <div>
                                                          <div className="font-semibold text-gray-800 dark:text-gray-200 flex items-center gap-2">
                                                            <HighlightGlossary text={item.name} />
                                                            {item.anssiCertified && <span className="text-xs font-bold text-white bg-blue-600 px-2 py-0.5 rounded-full">Qualifié ANSSI</span>}
                                                          </div>
                                                          <div className="text-xs text-gray-500 dark:text-gray-400">
                                                              <HighlightGlossary text={item.description} />
                                                          </div>
                                                      </div>
                                                      </div>
                                                      <p className="font-bold text-gray-900 dark:text-gray-100 whitespace-nowrap">{item.cost.toLocaleString('fr-FR')} €</p>
                                                  </li>
                                              ))}
                                            </ul>
                                        </div>
                                        <div className="bg-gray-100 dark:bg-gray-700/50 p-4 flex justify-between items-center">
                                            <span className="font-bold text-lg text-gray-900 dark:text-gray-100">Total Phase</span>
                                            <span className="font-bold text-xl text-indigo-600 dark:text-indigo-400">{phase.total.toLocaleString('fr-FR')} €</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            
                            {/* --- TCO Table --- */}
                            <div className="mt-8 bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 overflow-hidden print-break-avoid">
                                <div className="bg-gray-50 dark:bg-gray-700 px-6 py-4 border-b border-gray-200 dark:border-gray-600">
                                    <h3 className="text-lg font-bold text-gray-800 dark:text-gray-200 flex items-center gap-2">
                                        <CreditCard size={20} className="text-indigo-600 dark:text-indigo-400"/>
                                        Vision Financière TCO 36 mois
                                    </h3>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">Projection des coûts d'investissement (CAPEX) et de fonctionnement (OPEX)</p>
                                </div>
                                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700 text-sm">
                                    <thead className="bg-gray-50 dark:bg-gray-800">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Phase</th>
                                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Année 1 (Invest.)</th>
                                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Année 2 (MCO)</th>
                                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Année 3 (MCO)</th>
                                            <th className="px-6 py-3 text-right text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Total TCO</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                                        {budget.map((phase) => (
                                            <tr key={phase.name}>
                                                <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900 dark:text-gray-100">{phase.name}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-right text-gray-700 dark:text-gray-300">{(phase.total).toLocaleString('fr-FR')} €</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-right text-gray-500 dark:text-gray-400">{(phase.recurrentTotal).toLocaleString('fr-FR')} €</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-right text-gray-500 dark:text-gray-400">{(phase.recurrentTotal).toLocaleString('fr-FR')} €</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-right font-bold text-indigo-600 dark:text-indigo-400">
                                                    {(phase.total + phase.recurrentTotal * 2).toLocaleString('fr-FR')} €
                                                </td>
                                            </tr>
                                        ))}
                                        {/* TOTAL ROW */}
                                        <tr className="bg-indigo-50 dark:bg-indigo-900/30 font-bold">
                                            <td className="px-6 py-4 whitespace-nowrap text-indigo-900 dark:text-indigo-200">TOTAL CUMULÉ</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-indigo-900 dark:text-indigo-200">{totalBudget.toLocaleString('fr-FR')} €</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-indigo-900 dark:text-indigo-200">
                                                {budget.reduce((acc, p) => acc + p.recurrentTotal, 0).toLocaleString('fr-FR')} €
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-indigo-900 dark:text-indigo-200">
                                                {budget.reduce((acc, p) => acc + p.recurrentTotal, 0).toLocaleString('fr-FR')} €
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-indigo-700 dark:text-indigo-100 text-lg">
                                                {(totalBudget + budget.reduce((acc, p) => acc + p.recurrentTotal, 0) * 2).toLocaleString('fr-FR')} €
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>

                            <div className="mt-8 bg-blue-50 dark:bg-blue-900/50 border-l-4 border-blue-500 rounded-r-lg p-4">
                                <div className="flex">
                                    <div className="flex-shrink-0">
                                        <Info className="h-5 w-5 text-blue-500 dark:text-blue-400 mt-0.5" />
                                    </div>
                                    <div className="ml-3">
                                        <h3 className="text-md font-semibold text-blue-900 dark:text-blue-200">À propos des estimations :</h3>
                                        <div className="mt-2 text-sm text-blue-800 dark:text-blue-300">
                                            <ul className="list-disc space-y-1 pl-5">
                                                <li>Les coûts sont des <strong>ordres de grandeur budgétaires</strong> pour une entité de taille moyenne et non des devis formels.</li>
                                                <li>Ils incluent généralement les licences et les services d'intégration de base.</li>
                                                <li>Les produits mentionnés (ex: Stormshield, Tehtris) sont des <strong>exemples représentatifs</strong> privilégiant les solutions souveraines (françaises/européennes) et qualifiées/recommandées par l'ANSSI.</li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="mt-12">
                                <div className="flex items-center gap-3 mb-6">
                                    <span className="h-8 w-1.5 bg-indigo-500 rounded" />
                                    <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                                        Conformité et Référentiels
                                    </h2>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center bg-gray-50 dark:bg-gray-700/50 p-6 rounded-lg mb-8">
                                {/* Global Score */}
                                <div className="flex flex-col items-center justify-center">
                                    <RadialProgress
                                        score={projectedData ? projectedData.maturity : maturity}
                                        size={200}
                                        strokeWidth={15}
                                        label={projectedData ? "Maturité Projetée" : "Maturité Globale"}
                                        color={projectedData ? '#10b981' : undefined}
                                    />
                                    {projectedData && (
                                        <div className="mt-2 text-center animate-bounce">
                                            <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 rounded-full text-sm font-bold">
                                                <ArrowRight size={14} />+ {projectedData.gain} points
                                            </span>
                                        </div>
                                    )}
                                </div>
                                
                                {/* Radar Chart & Sim Controls */}
                                <div className="flex flex-col items-center justify-center w-full">
                                    <h4 className="text-gray-500 dark:text-gray-300 text-sm font-semibold uppercase tracking-wider mb-2 text-center">
                                        Répartition par domaine
                                    </h4>
                                    <MaturityRadar domainScores={domainScores} projectedScores={projectedData?.domainScores} />
                                    
                                    {/* SIMULATION CONTROLS */}
                                    <div className="mt-4 w-full bg-indigo-50 dark:bg-indigo-900/30 p-4 rounded-lg border border-indigo-100 dark:border-indigo-800 no-print">
                                        <h5 className="text-xs font-bold text-indigo-800 dark:text-indigo-200 uppercase mb-3 flex items-center gap-2">
                                            <Target size={14} /> Simulateur "Avant / Après"
                                        </h5>
                                        <div className="flex flex-col gap-2">
                                            {[0, 1].map((phaseIndex) => (
                                                <button
                                                    key={phaseIndex}
                                                    onClick={() => togglePhase(phaseIndex)}
                                                    className={`flex items-center justify-between p-2 rounded text-sm transition-colors ${
                                                        selectedPhases.includes(phaseIndex)
                                                        ? 'bg-indigo-600 text-white shadow-md'
                                                        : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                                                    }`}
                                                >
                                                    <div className="flex items-center gap-2">
                                                        {selectedPhases.includes(phaseIndex) ? <ToggleRight size={18} /> : <ToggleLeft size={18} />}
                                                        <span>Simuler Phase {phaseIndex + 1}</span>
                                                    </div>
                                                    <span className="font-mono text-xs opacity-90">
                                                        +{getPhaseCost(phaseIndex).toLocaleString('fr-FR')} €
                                                    </span>
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                                <div className="bg-gray-50 dark:bg-gray-700/50 p-6 rounded-lg">
                                    <p className="text-gray-700 dark:text-gray-300">
                                        Cet audit et les recommandations qui en découlent sont alignés avec les principaux référentiels de cybersécurité en vigueur en France et en Europe. L'objectif est de vous fournir une feuille de route pragmatique pour élever votre niveau de protection et de conformité.
                                    </p>
                                    <ul className="mt-4 space-y-3">
                                        <li>
                                            <a href="https://www.ssi.gouv.fr/guide/guide-dhygiene-informatique/" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300 font-semibold transition-colors group">
                                                <Link size={16} />
                                                <span className="group-hover:underline">Guide d'hygiène informatique de l'ANSSI</span>
                                            </a>
                                        </li>
                                        <li>
                                            <a href="https://www.ssi.gouv.fr/entreprise/reglementation/confiance-numerique/le-referentiel-general-de-securite-rgs/" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300 font-semibold transition-colors group">
                                                <Link size={16} />
                                                <span className="group-hover:underline">Référentiel Général de Sécurité (RGS)</span>
                                            </a>
                                        </li>
                                        <li>
                                            <a href="https://www.cnil.fr/fr/reglement-europeen-protection-donnees" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300 font-semibold transition-colors group">
                                                <Link size={16} />
                                                <span className="group-hover:underline">Règlement Général sur la Protection des Données (RGPD)</span>
                                            </a>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </section>

                        {/* --- Module "Indicateur NIS2" --- */}
                        <section id="nis2" className="mt-16 scroll-mt-20 print-break-avoid">
                             <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-3 mb-6">
                                <Award size={32} className="text-purple-600 dark:text-purple-400"/>
                                Indicateur de Conformité NIS 2
                            </h2>
                            
                            {/* Calculation Logic (Inline) */}
                            {(() => {
                                // Filter NIS2 questions
                                const nis2Questions = DOMAINS.flatMap(d => d.questions).filter(q => q.nis2);
                                const totalNis2 = nis2Questions.length;
                                const compliantNis2 = nis2Questions.filter(q => (answers[q.id] || 0) >= 2).length;
                                const nis2Score = totalNis2 > 0 ? Math.round((compliantNis2 / totalNis2) * 100) : 0;
                                const blockers = nis2Questions.filter(q => (answers[q.id] || 0) < 2);

                                return (
                                    <div className="bg-purple-50 dark:bg-purple-900/20 border-l-4 border-purple-500 rounded-lg p-6">
                                        <div className="flex flex-col md:flex-row items-center gap-8 mb-6">
                                            {/* Gauge NIS2 */}
                                             <div className="flex flex-col items-center">
                                                <div className="relative w-32 h-32">
                                                    <svg className="w-full h-full" viewBox="0 0 36 36">
                                                        <path
                                                            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                                            fill="none"
                                                            stroke="#E9D5FF"
                                                            strokeWidth="4"
                                                            className="dark:stroke-purple-900"
                                                        />
                                                        <path
                                                            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                                            fill="none"
                                                            stroke="#9333EA"
                                                            strokeWidth="4"
                                                            strokeDasharray={`${nis2Score}, 100`}
                                                            className="animate-[progress_1s_ease-out_forwards]"
                                                        />
                                                        <text x="18" y="20.35" className="text-[8px] font-bold fill-purple-700 dark:fill-purple-300" textAnchor="middle">{nis2Score}%</text>
                                                    </svg>
                                                </div>
                                                <span className="text-sm font-bold text-purple-800 dark:text-purple-300 mt-2">Score NIS 2</span>
                                            </div>

                                            <div className="flex-1">
                                                <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-2">
                                                    {nis2Score >= 80 ? "Conformité avancée" : nis2Score >= 50 ? "Conformité partielle" : "Non-conforme"}
                                                </h3>
                                                <p className="text-gray-600 dark:text-gray-300 mb-4">
                                                    La directive NIS 2 impose des mesures strictes pour les entités essentielles et importantes. 
                                                    {blockers.length > 0 
                                                        ? ` Vous avez ${blockers.length} points bloquants critiques à traiter en priorité.`
                                                        : " Vous respectez les pré-requis fondamentaux identifiés."}
                                                </p>
                                                <p className="text-xs text-gray-500 dark:text-gray-500 italic">
                                                    * Cet indicateur se base sur les 10 piliers essentiels (MFA, Sauvegardes, Incidents...) de la directive.
                                                </p>
                                            </div>
                                        </div>

                                        {/* Blockers List */}
                                        {blockers.length > 0 && (
                                            <div className="bg-white dark:bg-gray-800 rounded-md p-4 shadow-sm border border-purple-200 dark:border-purple-800">
                                                <h4 className="font-bold text-red-600 dark:text-red-400 mb-3 flex items-center gap-2">
                                                    <Info size={18} />
                                                    Points Bloquants NIS 2 ({blockers.length})
                                                </h4>
                                                <ul className="space-y-2">
                                                    {blockers.map(q => (
                                                        <li key={q.id} className="flex items-start gap-2 text-sm text-gray-700 dark:text-gray-300">
                                                            <span className="text-red-500 font-bold">❌</span>
                                                            <span>
                                                                <span className="font-semibold">{q.text}</span>
                                                                <span className="block text-xs text-gray-500 mt-0.5">
                                                                    Actuel : {q.options[answers[q.id] || 0]}
                                                                </span>
                                                            </span>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        )}
                                    </div>
                                );
                            })()}
                        </section>

                         {/* --- ANSSI Solutions --- */}
                        {/* Fix: Changed ref callback to use a block body to prevent returning a value. */}
                        <section id="catalogue" ref={el => { sectionRefs.current['catalogue'] = el; }} className="mt-16 scroll-mt-20">
                            <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-3 mb-6">
                                <Award size={32} className="text-indigo-600 dark:text-indigo-400"/>
                                Catalogue de Solutions Qualifiées ANSSI
                            </h2>
                            <p className="text-gray-600 dark:text-gray-400 mb-6">
                                Pour mettre en œuvre vos recommandations, l'ANSSI qualifie des produits et services de cybersécurité dont le niveau de robustesse et de confiance a été vérifié. Voici une sélection de prestataires par domaine pour vous guider.
                            </p>
                            <div className="space-y-6">
                                {ANSSI_SOLUTIONS.map(category => (
                                    <div key={category.domain} className="border-2 border-gray-200 dark:border-gray-700 rounded-lg">
                                        <div className="bg-gray-100 dark:bg-gray-700/50 p-4">
                                            <h3 className="text-xl font-bold text-gray-900 dark:text-gray-200 flex items-center gap-3">
                                                <span>{category.icon}</span>
                                                {category.domain}
                                            </h3>
                                            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{category.description}</p>
                                        </div>
                                        <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                                            {category.solutions.map(solution => (
                                                <div key={solution.name} className="print-break-avoid bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-md p-3">
                                                    <h4 className="font-semibold text-gray-800 dark:text-gray-200">{solution.name}</h4>
                                                    <p className="text-xs text-gray-500 dark:text-gray-400 font-semibold">{solution.provider}</p>
                                                    {solution.description && <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">{solution.description}</p>}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>

                         {/* --- Glossaire Pédagogique --- */}
                        <section id="glossaire" ref={el => { sectionRefs.current['glossaire'] = el; }} className="mt-16 scroll-mt-20 print-break-avoid">
                             <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-3 mb-6">
                                <Book size={32} className="text-indigo-600 dark:text-indigo-400"/>
                                Glossaire Pédagogique
                            </h2>
                            <p className="text-gray-600 dark:text-gray-400 mb-6">
                                Définitions simples des termes techniques et acronymes utilisés dans ce rapport pour faciliter la compréhension par les décideurs non-techniques.
                            </p>
                            <div className="grid grid-cols-1 gap-4">
                                {Object.entries(GLOSSARY).sort(([a], [b]) => a.localeCompare(b)).map(([term, def]) => (
                                    <div key={term} className="bg-gray-50 dark:bg-gray-700/50 p-3 rounded-md border-l-4 border-indigo-300 dark:border-indigo-600">
                                        <h4 className="font-bold text-gray-900 dark:text-gray-100 text-sm">{term}</h4>
                                        <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">{def}</p>
                                    </div>
                                ))}
                            </div>
                        </section>
                    </div>
                </main>
            </div>
        </div>
    </div>
  );
};

export default Report;