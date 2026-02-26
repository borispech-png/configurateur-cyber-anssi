import React, { useState } from 'react';
import { Shield, CheckCircle2, Lock, Users, FileText, Eye } from 'lucide-react';

interface WebinarConsentScreenProps {
  onConsent: () => void;
}

const WebinarConsentScreen: React.FC<WebinarConsentScreenProps> = ({ onConsent }) => {
  const [checked1, setChecked1] = useState(false); // Consent données
  const [checked2, setChecked2] = useState(false); // Consent webinaire

  const canProceed = checked1 && checked2;

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-100 dark:from-gray-900 dark:to-slate-900 flex items-center justify-center p-6">
      <div className="max-w-2xl w-full">

        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-indigo-100 dark:bg-indigo-900 rounded-full mb-4">
            <Shield className="text-indigo-600 dark:text-indigo-400" size={40} />
          </div>
          <div className="inline-block bg-indigo-600 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-widest mb-4">
            🎙️ Webinaire Cyber ANSSI
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            Avant de commencer
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Merci de lire et accepter les conditions d'utilisation de ce questionnaire.
          </p>
        </div>

        {/* Card consentement */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden">

          {/* Bloc info usage */}
          <div className="p-6 border-b border-gray-100 dark:border-gray-700">
            <h2 className="font-bold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
              <Eye size={18} className="text-indigo-500" />
              Comment vos données seront utilisées
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="flex flex-col items-center text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
                <Lock size={24} className="text-blue-600 dark:text-blue-400 mb-2" />
                <p className="text-xs font-semibold text-blue-900 dark:text-blue-200">Stockage local</p>
                <p className="text-xs text-blue-700 dark:text-blue-300 mt-1">
                  Vos réponses restent dans votre navigateur. Aucun serveur ne les stocke.
                </p>
              </div>
              <div className="flex flex-col items-center text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-xl">
                <Users size={24} className="text-green-600 dark:text-green-400 mb-2" />
                <p className="text-xs font-semibold text-green-900 dark:text-green-200">Analyse collective</p>
                <p className="text-xs text-green-700 dark:text-green-300 mt-1">
                  Vos scores agrégés (anonymisés) servent à la restitution collective du webinaire.
                </p>
              </div>
              <div className="flex flex-col items-center text-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-xl">
                <FileText size={24} className="text-purple-600 dark:text-purple-400 mb-2" />
                <p className="text-xs font-semibold text-purple-900 dark:text-purple-200">Rapport individuel</p>
                <p className="text-xs text-purple-700 dark:text-purple-300 mt-1">
                  Votre rapport détaillé est généré localement et vous appartient. Vous choisissez de l'envoyer.
                </p>
              </div>
            </div>
          </div>

          {/* Bloc checkboxes */}
          <div className="p-6 space-y-4">
            <h2 className="font-bold text-gray-900 dark:text-gray-100 mb-2 flex items-center gap-2">
              <CheckCircle2 size={18} className="text-green-500" />
              Vos consentements
            </h2>

            {/* Checkbox 1 */}
            <label
              className={`flex items-start gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                checked1
                  ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20'
                  : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
              }`}
            >
              <input
                type="checkbox"
                checked={checked1}
                onChange={(e) => setChecked1(e.target.checked)}
                className="mt-1 h-5 w-5 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer shrink-0"
              />
              <div>
                <p className="font-semibold text-gray-800 dark:text-gray-200 text-sm">
                  Traitement des données (RGPD)
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  J'accepte que mes réponses soient traitées conformément au RGPD. 
                  Les données sont stockées <strong>uniquement dans mon navigateur</strong> et ne sont pas transmises à des tiers sans mon consentement.
                  Je peux demander la suppression de mes données à tout moment en effaçant le cache de mon navigateur.
                </p>
              </div>
            </label>

            {/* Checkbox 2 */}
            <label
              className={`flex items-start gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                checked2
                  ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20'
                  : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
              }`}
            >
              <input
                type="checkbox"
                checked={checked2}
                onChange={(e) => setChecked2(e.target.checked)}
                className="mt-1 h-5 w-5 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer shrink-0"
              />
              <div>
                <p className="font-semibold text-gray-800 dark:text-gray-200 text-sm">
                  Partage des résultats pour le webinaire
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  J'accepte que mes <strong>résultats agrégés et anonymisés</strong> (scores par domaine, budget estimé) 
                  soient partagés avec l'animateur du webinaire SCC à des fins d'analyse collective.
                  Mon organisme sera identifié dans le rapport transmis.
                </p>
              </div>
            </label>
          </div>

          {/* Bouton */}
          <div className="px-6 pb-6">
            <button
              onClick={onConsent}
              disabled={!canProceed}
              className={`w-full py-4 rounded-xl font-bold text-white text-lg transition-all duration-300 flex items-center justify-center gap-3 ${
                canProceed
                  ? 'bg-indigo-600 hover:bg-indigo-700 transform hover:scale-[1.02] shadow-lg shadow-indigo-200 dark:shadow-indigo-900'
                  : 'bg-gray-300 dark:bg-gray-700 cursor-not-allowed text-gray-400 dark:text-gray-500'
              }`}
            >
              {canProceed ? (
                <>
                  <CheckCircle2 size={22} />
                  Je consens — Commencer le questionnaire
                </>
              ) : (
                'Veuillez cocher les deux cases pour continuer'
              )}
            </button>
            <p className="text-xs text-center text-gray-400 dark:text-gray-500 mt-3">
              Organisateur : SCC France — bpehcevski@fr.scc.com
            </p>
          </div>

        </div>
      </div>
    </div>
  );
};

export default WebinarConsentScreen;
