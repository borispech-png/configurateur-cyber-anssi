import React from 'react';
import { ClientInfo, BudgetPhase } from '../types';
import { ShoppingCart } from 'lucide-react';

interface UgapOrderSheetProps {
  clientInfo: ClientInfo;
  budget: BudgetPhase[];
  totalBudget: number;
}

const UgapOrderSheet = React.forwardRef<HTMLDivElement, UgapOrderSheetProps>(({ clientInfo, budget, totalBudget }, ref) => {
  
  // Extract all items with a UGAP reference
  const ugapItems = budget.flatMap(phase => 
    phase.items.filter(item => item.ugapRef)
  );

  const totalUgap = ugapItems.reduce((sum, item) => sum + item.cost, 0);

  return (
    <div ref={ref} className="bg-white p-8 md:p-12 max-w-4xl mx-auto print:p-0 print:max-w-none">
      
      {/* Header */}
      <div className="flex justify-between items-start border-b-2 border-gray-800 pb-6 mb-8">
        <div>
            <h1 className="text-3xl font-bold text-gray-900 uppercase tracking-wider mb-2">Fiche Projet UGAP</h1>
            <p className="text-sm text-gray-600">Document d'aide à la commande</p>
        </div>
        <div className="text-right">
            <div className="bg-blue-800 text-white font-bold py-2 px-4 rounded text-xl mb-1">UGAP</div>
            <p className="text-xs text-gray-500">Centrale d'Achat Public</p>
        </div>
      </div>

      {/* Client Info */}
      <div className="grid grid-cols-2 gap-8 mb-12">
        <div className="bg-gray-50 p-4 rounded border border-gray-200">
            <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-2">Bénéficiaire</h3>
            <p className="font-bold text-lg text-gray-900">{clientInfo.name}</p>
            <p className="text-gray-700">{clientInfo.type}</p>
            {clientInfo.size && <p className="text-gray-700">{clientInfo.size}</p>}
        </div>
        <div className="bg-gray-50 p-4 rounded border border-gray-200">
            <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-2">Contact</h3>
            <p className="font-bold text-gray-900">{clientInfo.contact || "N/A"}</p>
            <p className="text-gray-700">{clientInfo.phone || "N/A"}</p>
            <p className="text-gray-700 text-sm mt-2">Secteur: {clientInfo.sector}</p>
        </div>
      </div>

      {/* Order Table */}
      <div className="mb-8">
        <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <ShoppingCart size={24} className="text-blue-600"/>
            Liste des Solutions Identifiées
        </h2>
        
        {ugapItems.length > 0 ? (
            <table className="w-full border-collapse text-sm">
                <thead>
                    <tr className="bg-gray-100 border-b border-gray-300">
                        <th className="text-left py-3 px-4 font-semibold text-gray-700">Réf. UGAP</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-700">Marché</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-700">Désignation Solution</th>
                        <th className="text-right py-3 px-4 font-semibold text-gray-700">Budget Est. (HT)</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                    {ugapItems.map((item, idx) => (
                        <tr key={idx} className="hover:bg-gray-50">
                            <td className="py-3 px-4 font-mono font-bold text-blue-800">{item.ugapRef}</td>
                            <td className="py-3 px-4 text-gray-600">{item.marketRef || "N/A"}</td>
                            <td className="py-3 px-4">
                                <div className="font-semibold text-gray-900">{item.name}</div>
                                <div className="text-xs text-gray-500">{item.description}</div>
                            </td>
                            <td className="py-3 px-4 text-right font-bold text-gray-900">{item.cost.toLocaleString('fr-FR')} €</td>
                        </tr>
                    ))}
                </tbody>
                <tfoot>
                    <tr className="bg-blue-50 border-t-2 border-blue-200">
                        <td colSpan={3} className="py-4 px-4 text-right font-bold text-blue-900 uppercase">Total Estimé HT</td>
                        <td className="py-4 px-4 text-right font-bold text-xl text-blue-900">{totalUgap.toLocaleString('fr-FR')} €</td>
                    </tr>
                </tfoot>
            </table>
        ) : (
            <div className="text-center py-12 bg-gray-50 rounded border border-dashed border-gray-300">
                <p className="text-gray-500 italic">Aucune solution éligible UGAP identifiée dans le budget actuel.</p>
            </div>
        )}
      </div>

      {/* Disclaimer */}
      <div className="mt-12 pt-6 border-t border-gray-200 text-xs text-gray-500 text-justify">
        <p className="mb-2"><strong>Mentions Légales & Avertissement :</strong></p>
        <p>
            Ce document est généré automatiquement par le Configurateur Cyber ANSSI à titre indicatif. 
            Il ne constitue pas un bon de commande officiel ni un devis contractuel. 
            Les références et les prix sont donnés à titre d'estimation budgétaire (Prix Publics Indicatifs) et doivent être vérifiés auprès de votre interlocuteur UGAP habituel.
            L'ANSSI et l'éditeur de ce logiciel ne sauraient être tenus responsables des écarts de prix ou de disponibilité des solutions.
        </p>
        <p className="mt-4 text-right">Généré le {new Date().toLocaleDateString('fr-FR')}</p>
      </div>

    </div>
  );
});

UgapOrderSheet.displayName = 'UgapOrderSheet';

export default UgapOrderSheet;
