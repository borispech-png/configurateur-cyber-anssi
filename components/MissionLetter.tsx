import React from 'react';
import { ClientInfo } from '../types';

interface MissionLetterProps {
  clientInfo: ClientInfo;
}

const MissionLetter = React.forwardRef<HTMLDivElement, MissionLetterProps>(({ clientInfo }, ref) => {
  const date = new Date().toLocaleDateString('fr-FR', { year: 'numeric', month: 'long', day: 'numeric' });

  return (
    <div ref={ref} className="bg-white p-12 max-w-4xl mx-auto font-serif text-gray-900 leading-relaxed print:p-0 print:max-w-none">
      
      {/* Header */}
      <div className="flex justify-between items-start mb-16">
        <div>
            {clientInfo.logo && <img src={clientInfo.logo} alt="Logo" className="h-16 mb-4 object-contain" />}
            <p className="font-bold text-lg">{clientInfo.name}</p>
            <p>{clientInfo.type}</p>
            <p>{clientInfo.size}</p>
        </div>
        <div className="text-right">
            <p className="font-bold">À l'attention de la Direction Générale</p>
            <p>Objet : Cadrage de la mission de sécurisation</p>
            <p className="mt-4">Fait à Paris, le {date}</p>
        </div>
      </div>

      {/* Body */}
      <h1 className="text-2xl font-bold text-center mb-12 uppercase border-b border-gray-900 pb-4 inline-block mx-auto">Lettre de Mission</h1>

      <div className="space-y-6 text-justify">
        <p>Madame, Monsieur,</p>

        <p>
            Dans un contexte de recrudescence des cybermenaces visant le secteur public et privé, la sécurité de nos systèmes d'information est devenue un enjeu stratégique majeur.
            La protection de nos données, la continuité de nos services et la confiance de nos usagers/clients en dépendent.
        </p>

        <p>
            Par la présente, je mandate officiellement le lancement du projet de <strong>Mise en Conformité et Sécurisation du Système d'Information</strong> de <strong>{clientInfo.name}</strong>.
        </p>

        <p>
            Cette mission, basée sur le diagnostic initial réalisé ce jour, a pour objectifs prioritaires :
        </p>

        <ul className="list-disc pl-8 space-y-2">
            <li>La protection immédiate des actifs critiques contre les ransomwares (Sauvegardes immuables, EDR).</li>
            <li>La mise en conformité avec les référentiels en vigueur (ANSSI, NIS 2, RGPD).</li>
            <li>La sensibilisation et la formation de l'ensemble des collaborateurs aux risques numériques.</li>
            <li>L'assurance de la continuité d'activité en cas de sinistre majeur.</li>
        </ul>

        <p>
            Je désigne <strong>{clientInfo.contact || "le Responsable SI"}</strong> comme chef de projet opérationnel. 
            Il/Elle dispose de mon soutien total pour engager les ressources nécessaires et arbitrer les choix techniques, dans le respect du budget prévisionnel validé.
        </p>

        <p>
            J'attends un point d'avancement trimestriel sur la mise en œuvre de cette feuille de route.
        </p>

        <p>
            Je vous prie d'agréer, Madame, Monsieur, l'expression de ma considération distinguée.
        </p>
      </div>

      {/* Signature */}
      <div className="mt-16 flex justify-end">
        <div className="text-center">
            <p className="mb-24"><strong>La Direction</strong></p>
            <div className="border-t border-gray-400 w-48 pt-2">
                <p className="text-xs text-gray-500">Signature & Cachet</p>
            </div>
        </div>
      </div>

       {/* Footer */}
       <div className="mt-24 text-center text-xs text-gray-500 border-t pt-4">
            <p>Document généré par le Configurateur Cyber ANSSI - {clientInfo.name}</p>
       </div>

    </div>
  );
});

MissionLetter.displayName = 'MissionLetter';

export default MissionLetter;
