import React from 'react';
import { BudgetPhase } from '../types';
import { Calendar, CheckCircle2, ArrowRight } from 'lucide-react';

interface ImplementationPlanProps {
  budget: BudgetPhase[];
}

const ImplementationPlan = React.forwardRef<HTMLDivElement, ImplementationPlanProps>(({ budget }, ref) => {
  const currentDate = new Date();
  
  // Helper to calculate dates
  const addMonths = (date: Date, months: number) => {
    const d = new Date(date);
    d.setMonth(d.getMonth() + months);
    return d.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' });
  };

  const getTimeline = (phaseIndex: number) => {
      if (phaseIndex === 0) return { start: "Immédiat", end: "Mois +6", duration: "6 mois", color: "bg-blue-600" }; // Phase 1
      if (phaseIndex === 1) return { start: "Mois +6", end: "Mois +12", duration: "6 mois", color: "bg-indigo-600" }; // Phase 2
      return { start: "Mois +12", end: "Mois +24", duration: "12 mois", color: "bg-purple-600" }; // Phase 3
  };

  return (
    <div ref={ref} className="bg-white p-8 md:p-12 max-w-4xl mx-auto font-sans text-gray-900 print:p-0 print:max-w-none">
      
      {/* Header */}
      <div className="border-b-2 border-gray-800 pb-6 mb-8 flex justify-between items-end">
        <div>
            <h1 className="text-3xl font-bold text-gray-900 uppercase tracking-wider mb-2 flex items-center gap-3">
                <Calendar size={32} className="text-blue-600"/>
                Planning Directeur
            </h1>
            <p className="text-sm text-gray-600">Feuille de route de sécurisation sur 24 mois</p>
        </div>
        <div className="text-right text-sm text-gray-500">
            Généré le {currentDate.toLocaleDateString('fr-FR')}
        </div>
      </div>

      {/* Timeline Visuelle (Gantt simplifié) */}
      <div className="mb-12 no-print">
          <div className="flex w-full h-4 rounded-full overflow-hidden mb-2">
              <div className="w-1/4 bg-blue-500"></div>
              <div className="w-1/4 bg-indigo-500"></div>
              <div className="w-2/4 bg-purple-500"></div>
          </div>
          <div className="flex justify-between text-xs text-gray-500 font-semibold uppercase tracking-wider">
              <span>T0 (Aujourd'hui)</span>
              <span>T+6 Mois</span>
              <span>T+12 Mois</span>
              <span>T+24 Mois</span>
          </div>
      </div>

      {/* Détail des Phases */}
      <div className="space-y-8 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-300 before:to-transparent">
        
        {budget.map((phase, index) => {
            const timeline = getTimeline(index);
            
            return (
                <div key={index} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active print-break-inside-avoid page-break-inside-avoid break-inside-avoid">
                    
                    {/* Icone Centrale */}
                    <div className="flex items-center justify-center w-10 h-10 rounded-full border border-white bg-slate-300 group-[.is-active]:bg-blue-500 text-slate-500 group-[.is-active]:text-emerald-50 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2">
                        <span className="font-bold">{index + 1}</span>
                    </div>
                    
                    {/* Carte Contenu */}
                    <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-white p-6 rounded border border-slate-200 shadow-sm">
                        <div className="flex items-center justify-between mb-2">
                             <div className="font-bold text-slate-900">{phase.name}</div>
                             <time className="font-mono italic text-xs text-slate-500">{timeline.start} - {timeline.end}</time>
                        </div>
                        <div className={`inline-block px-2 py-0.5 rounded text-xs font-bold text-white mb-4 ${timeline.color}`}>
                            Durée estimée : {timeline.duration}
                        </div>
                        
                        <div className="space-y-3">
                            {phase.items.map((item, idx) => (
                                <div key={idx} className="flex items-start gap-2 text-sm text-slate-600">
                                    <CheckCircle2 size={16} className="text-green-500 mt-0.5 shrink-0" />
                                    <span>{item.name}</span>
                                </div>
                            ))}
                        </div>

                        {/* Objectif de fin de phase */}
                        <div className="mt-4 pt-4 border-t border-slate-100 text-xs text-slate-500 flex items-center gap-2">
                            <ArrowRight size={14} className="text-slate-400"/>
                            <span>Objectif : {phase.description}</span>
                        </div>
                    </div>

                </div>
            );
        })}
      </div>

      {/* Footer */}
      <div className="mt-12 p-4 bg-gray-50 rounded text-xs text-gray-500 text-center italic border border-gray-200">
        Ce planning est indicatif. La mise en œuvre dépendra de la disponibilité des équipes, des délais d'approvisionnement et des contraintes budgétaires réelles.
      </div>

    </div>
  );
});

ImplementationPlan.displayName = 'ImplementationPlan';

export default ImplementationPlan;
