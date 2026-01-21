import React from 'react';
import { Shield, ChevronLeft, FileText, BarChart3 } from 'lucide-react';
import { Domain, Recommendation, Benchmark, ClientInfo } from '../types';
import { DOMAINS } from '../constants';
import RadialProgress from './RadialProgress';

// Fix: Defined the missing SummaryProps interface.
interface SummaryProps {
  clientInfo: ClientInfo;
  maturity: number;
  domainScores: { [key: string]: number };
  recommendations: Recommendation[];
  benchmark: Benchmark | null;
  onEdit: () => void;
  onGenerateReport: () => void;
}

const DomainScoreCard: React.FC<{ domain: Domain; score: number }> = ({ domain, score }) => (
  <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 flex items-center gap-4 justify-between">
    <div className="flex items-center gap-3">
      <span className="text-3xl">{domain.icon}</span>
      <span className="font-semibold text-gray-800 dark:text-gray-200">{domain.title}</span>
    </div>
    <div className="flex-shrink-0">
      <RadialProgress score={score} size={60} strokeWidth={7} />
    </div>
  </div>
);


const Summary: React.FC<SummaryProps> = ({ clientInfo, maturity, domainScores, recommendations, benchmark, onEdit, onGenerateReport }) => {
  const criticalCount = recommendations.filter(r => r.level === 'critique').length;
  const importantCount = recommendations.filter(r => r.level === 'important').length;
  
  const getMaturityText = (score: number) => {
    if (score < 40) return 'Initial';
    if (score < 70) return 'Géré';
    return 'Optimisé';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-800 dark:to-slate-900 p-8 flex items-center justify-center">
      <div className="max-w-5xl w-full mx-auto">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl p-8">
          <div className="text-center mb-8">
            <Shield className="mx-auto text-indigo-600 dark:text-indigo-400 mb-4" size={64} />
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">Récapitulatif de l'Audit</h1>
            <p className="text-gray-600 dark:text-gray-400">Vérification avant génération du rapport complet</p>
          </div>

          {/* Score global */}
          <div className="bg-gradient-to-r from-indigo-600 to-indigo-700 text-white rounded-lg p-6 mb-8 flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="flex-1">
              <h2 className="text-2xl font-bold mb-2">Score de Maturité Global</h2>
              <p className="text-indigo-100">{clientInfo.name}</p>
              <p className="mt-2 text-lg font-semibold bg-white/20 px-3 py-1 rounded-full inline-block">
                Niveau : {getMaturityText(maturity)}
              </p>
            </div>
            <div className="flex-shrink-0">
              <RadialProgress score={maturity} size={130} strokeWidth={12} />
            </div>
          </div>

          {/* Scores par domaine */}
          <div className="mb-8">
            <h3 className="text-xl font-bold text-gray-900 dark:text-gray-200 mb-4">Scores par Domaine</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {DOMAINS.map((domain) => (
                <DomainScoreCard key={domain.title} domain={domain} score={domainScores[domain.title] || 0} />
              ))}
            </div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            <div className="bg-red-50 dark:bg-red-900/40 border-2 border-red-200 dark:border-red-700 rounded-lg p-4 text-center">
              <div className="text-3xl font-bold text-red-600 dark:text-red-400">{criticalCount}</div>
              <div className="text-sm text-red-800 dark:text-red-200 font-semibold mt-1">Points critiques</div>
            </div>
            <div className="bg-yellow-50 dark:bg-yellow-900/40 border-2 border-yellow-200 dark:border-yellow-700 rounded-lg p-4 text-center">
              <div className="text-3xl font-bold text-yellow-600 dark:text-yellow-400">{importantCount}</div>
              <div className="text-sm text-yellow-800 dark:text-yellow-200 font-semibold mt-1">Points importants</div>
            </div>
            <div className="bg-blue-50 dark:bg-blue-900/40 border-2 border-blue-200 dark:border-blue-700 rounded-lg p-4 text-center">
              <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">{DOMAINS.reduce((acc, d) => acc + d.questions.length, 0)}</div>
              <div className="text-sm text-blue-800 dark:text-blue-200 font-semibold mt-1">Questions analysées</div>
            </div>
          </div>

          {/* Benchmark */}
          {benchmark && (
            <div className="bg-blue-50 dark:bg-blue-900/50 border-l-4 border-blue-500 dark:border-blue-400 rounded-r-lg p-6 mb-8">
              <h3 className="font-bold text-blue-900 dark:text-blue-200 mb-2 flex items-center gap-2">
                <BarChart3 size={20} />
                Comparaison Sectorielle
              </h3>
              <div className="flex items-center gap-4">
                <div>
                  <p className="text-sm text-blue-800 dark:text-blue-300 mb-1">{benchmark.description}</p>
                  <div className="flex items-center gap-4">
                    <div>
                      <span className="text-xs text-blue-700 dark:text-blue-300">Votre score</span>
                      <div className="text-2xl font-bold text-blue-900 dark:text-blue-200">{maturity}%</div>
                    </div>
                    <div className="text-blue-400 dark:text-blue-500 text-2xl">vs</div>
                    <div>
                      <span className="text-xs text-blue-700 dark:text-blue-300">Moyenne secteur</span>
                      <div className="text-2xl font-bold text-blue-900 dark:text-blue-200">{benchmark.avgMaturity}%</div>
                    </div>
                  </div>
                </div>
              </div>
              <p className={`mt-3 text-sm font-semibold ${
                maturity >= benchmark.avgMaturity ? 'text-green-700 dark:text-green-400' : 'text-orange-700 dark:text-orange-400'
              }`}>
                {maturity >= benchmark.avgMaturity 
                  ? '✅ Au-dessus de la moyenne sectorielle'
                  : '⚠️ En-dessous de la moyenne sectorielle'}
              </p>
              <div className="mt-2 text-xs text-gray-600 dark:text-gray-400">
                {maturity >= benchmark.avgMaturity ? (
                  <p>Cela indique une bonne prise en compte des enjeux de cybersécurité par rapport à vos pairs. Il est important de maintenir cet effort pour conserver cette avance et continuer à améliorer votre posture de sécurité.</p>
                ) : (
                  <p>Cela suggère un décalage qui pourrait vous exposer à des risques plus élevés que des organismes similaires. Il est recommandé de prioriser les actions correctives pour atteindre, à minima, le niveau de maturité moyen de votre secteur.</p>
                )}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={onEdit}
              className="flex-1 bg-gray-200 text-gray-700 dark:bg-gray-600 dark:text-gray-200 px-6 py-4 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-500 transition font-semibold flex items-center justify-center gap-2"
            >
              <ChevronLeft size={20} />
              Modifier les réponses
            </button>
            <button
              onClick={onGenerateReport}
              className="flex-1 bg-indigo-600 text-white px-6 py-4 rounded-lg hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 transition font-semibold flex items-center justify-center gap-2"
            >
              <FileText size={20} />
              Générer le rapport complet
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Summary;