import React, { useState } from 'react';
import { ClientInfo, BudgetPhase } from '../types';
import { CheckCircle2, Mail, Download, Loader2, AlertTriangle, Send } from 'lucide-react';

interface WebinarSubmitPanelProps {
  clientInfo: ClientInfo;
  maturity: number;
  domainScores: { [key: string]: number };
  totalBudget: number;
  nbCritiques: number;
  onDownloadPdf: () => void;
}

type SubmitState = 'idle' | 'sending' | 'success' | 'error';

const COLLECTOR_EMAIL = 'bpehcevski@fr.scc.com';
// Web3Forms key - domain restricted to borispech-png.github.io (safe to embed)
const WEB3FORMS_KEY = import.meta.env.VITE_WEB3FORMS_KEY || '8667d234-bbb9-4398-9837-60846441b244';

const WebinarSubmitPanel: React.FC<WebinarSubmitPanelProps> = ({
  clientInfo,
  maturity,
  domainScores,
  totalBudget,
  nbCritiques,
  onDownloadPdf,
}) => {
  const [submitState, setSubmitState] = useState<SubmitState>('idle');
  const [errorMsg, setErrorMsg] = useState('');
  const [submitted, setSubmitted] = useState(false);

  // Format domain scores as readable string
  const domainSummary = Object.entries(domainScores)
    .map(([domain, score]) => `${domain}: ${score}%`)
    .join(' | ');

  const handleAutoSubmit = async () => {
    setSubmitState('sending');
    setErrorMsg('');

    // Use FormData to avoid CORS preflight issues
    const formData = new FormData();
    formData.append('access_key', WEB3FORMS_KEY);
    formData.append('subject', `[Webinaire Cyber ANSSI] Rapport - ${clientInfo.name}`);
    formData.append('from_name', 'Configurateur Cyber ANSSI - Webinaire');
    formData.append('Organisme', clientInfo.name);
    formData.append('Type', clientInfo.type || 'Non renseigne');
    formData.append('Taille', clientInfo.size || 'Non renseignee');
    formData.append('Secteur', clientInfo.sector || 'Non renseigne');
    formData.append('Contact', clientInfo.contact || 'Non renseigne');
    formData.append('Email', clientInfo.email || 'Non renseigne');
    formData.append('Score_Global', `${maturity}%`);
    formData.append('Nb_Points_Critiques', String(nbCritiques));
    formData.append('Budget_Estime_HT', `${totalBudget.toLocaleString('fr-FR')} EUR`);
    formData.append('Scores_par_Domaine', Object.entries(domainScores).map(([d, s]) => `${d}: ${s}%`).join(' | '));
    formData.append('Date_Soumission', new Date().toLocaleString('fr-FR'));

    let web3Success = false;

    try {
      // 8-second timeout — don't make participants wait too long
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 8000);

      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        body: formData,
        signal: controller.signal,
      });
      clearTimeout(timeout);

      if (response.ok) {
        const result = await response.json();
        if (result.success) web3Success = true;
      }
    } catch {
      // Network/CORS/timeout — silent fail, fallback to mailto below
    }

    if (web3Success) {
      // Web3Forms succeeded
      setSubmitState('success');
      setSubmitted(true);
    } else {
      // Automatic mailto fallback — opens mail client directly, no extra click needed
      handleMailto();
      setSubmitState('success');
      setSubmitted(true);
      setErrorMsg('mailto'); // flag to show specific message
    }
  };

  const handleMailto = () => {
    const subject = encodeURIComponent(`[Webinaire Cyber ANSSI] Rapport PDF - ${clientInfo.name}`);
    const body = encodeURIComponent(
      `Bonjour,\n\nVeuillez trouver ci-joint mon rapport d'audit cyber.\n\n` +
      `Organisme : ${clientInfo.name}\n` +
      `Score global : ${maturity}%\n` +
      `Points critiques : ${nbCritiques}\n` +
      `Budget estimé : ${totalBudget.toLocaleString('fr-FR')} €\n\n` +
      `Cordialement,\n${clientInfo.contact || clientInfo.name}`
    );
    window.location.href = `mailto:${COLLECTOR_EMAIL}?subject=${subject}&body=${body}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-lg w-full p-8 animate-fade-in-up">
        
        {/* Header */}
        <div className="text-center mb-6">
          <div className="text-5xl mb-4">🎉</div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            Audit terminé !
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Votre score de maturité est de{' '}
            <strong className={`text-xl ${maturity >= 70 ? 'text-green-600' : maturity >= 40 ? 'text-yellow-600' : 'text-red-600'}`}>
              {maturity}%
            </strong>
          </p>
        </div>

        {/* Score Recap */}
        <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4 mb-6 text-sm text-gray-700 dark:text-gray-300">
          <p><strong>Organisme :</strong> {clientInfo.name}</p>
          <p><strong>Points critiques :</strong> {nbCritiques}</p>
          <p><strong>Budget estimé :</strong> {totalBudget.toLocaleString('fr-FR')} €</p>
        </div>

        {/* Step 1: Download PDF */}
        <div className="mb-4">
          <p className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-2">
            Étape 1 — Téléchargez votre rapport
          </p>
          <button
            onClick={onDownloadPdf}
            className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-semibold transition-colors"
          >
            <Download size={18} />
            Télécharger mon rapport PDF
          </button>
        </div>

        {/* Step 2: Send results */}
        <div className="mb-4">
          <p className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-2">
            Étape 2 — Envoyez vos résultats au webinaire
          </p>

          {submitted ? (
            <div className="flex items-center gap-3 p-4 bg-green-50 dark:bg-green-900/30 rounded-lg border border-green-200 dark:border-green-700">
              <CheckCircle2 className="text-green-600 dark:text-green-400 shrink-0" size={24} />
              <div>
                {errorMsg === 'mailto' ? (
                  <>
                    <p className="font-bold text-green-800 dark:text-green-200">Client mail ouvert ✉️</p>
                    <p className="text-xs text-green-700 dark:text-green-300">
                      Envoyez l'email qui vient de s'ouvrir dans votre messagerie (pensez à joindre le PDF). Merci de votre participation !
                    </p>
                  </>
                ) : (
                  <>
                    <p className="font-bold text-green-800 dark:text-green-200">Résultats envoyés automatiquement ✅</p>
                    <p className="text-xs text-green-700 dark:text-green-300">
                      Merci. Restez connecté(e) au webinaire pour la restitution collective.
                    </p>
                  </>
                )}
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              {/* Auto submit */}
              {WEB3FORMS_KEY ? (
                <button
                  onClick={handleAutoSubmit}
                  disabled={submitState === 'sending'}
                  className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white rounded-lg font-semibold transition-colors"
                >
                  {submitState === 'sending' ? (
                    <><Loader2 size={18} className="animate-spin" />Envoi en cours...</>
                  ) : (
                    <><Send size={18} />Envoyer automatiquement mes résultats</>
                  )}
                </button>
              ) : null}

              {/* Error */}
              {submitState === 'error' && (
                <div className="flex items-start gap-2 p-3 bg-red-50 dark:bg-red-900/30 rounded-lg text-sm text-red-700 dark:text-red-300">
                  <AlertTriangle size={16} className="shrink-0 mt-0.5" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {/* Mailto fallback */}
              <button
                onClick={handleMailto}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-white dark:bg-gray-700 border-2 border-gray-300 dark:border-gray-600 hover:border-indigo-400 text-gray-700 dark:text-gray-200 rounded-lg font-semibold transition-colors"
              >
                <Mail size={18} />
                Envoyer par email (avec PDF en pièce jointe)
              </button>
              <p className="text-xs text-center text-gray-400">
                L'email s'ouvrira dans votre client mail. Pensez à joindre le PDF téléchargé.
              </p>
            </div>
          )}
        </div>

        {/* Dismiss */}
        {submitted && (
          <div className="text-center mt-4">
            <p className="text-sm text-indigo-600 dark:text-indigo-400 font-semibold">
              🎙️ Le commentateur va maintenant analyser les résultats collectifs.
            </p>
          </div>
        )}

      </div>
    </div>
  );
};

export default WebinarSubmitPanel;
