import React, { useState } from 'react';
import { Shield, ChevronRight, Lock, Upload, Image as ImageIcon } from 'lucide-react';
import { ClientInfo } from '../types';
import { BENCHMARKS } from '../constants';
import { APP_VERSION, BUILD_DATE } from '../version';

interface ClientInfoFormProps {
  clientInfo: ClientInfo;
  onClientInfoChange: (field: keyof ClientInfo, value: string) => void;
  onStart: () => void;
  themeSwitcher: React.ReactNode;
  onImport: (data: string) => void;
  isWebinaire?: boolean;
}

// Combined list of all sectors/types (benchmark keys cover all org types)
const ALL_SECTORS = Object.keys(BENCHMARKS);

const ClientInfoForm: React.FC<ClientInfoFormProps> = ({
  clientInfo, onClientInfoChange, onStart, themeSwitcher, onImport, isWebinaire = false
}) => {
  // In webinar mode, consent is already given on the previous screen
  const [consentGiven, setConsentGiven] = useState(isWebinaire);
  const [sectorSuggestions, setSectorSuggestions] = useState<string[]>([]);
  const [isSectorFocused, setIsSectorFocused] = useState(false);

  const handleFileImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) onImport(event.target.result as string);
      };
      reader.readAsText(file);
    }
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => onClientInfoChange('logo', reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  /**
   * Merged sector/type handler.
   * Stores in BOTH `sector` and `type` so the App.tsx benchmark lookup
   * (which checks both fields) works correctly regardless of which is set.
   */
  const handleSectorChange = (value: string) => {
    onClientInfoChange('sector', value);
    onClientInfoChange('type', value);
    if (value) {
      setSectorSuggestions(ALL_SECTORS.filter(s => s.toLowerCase().includes(value.toLowerCase())));
    } else {
      setSectorSuggestions([]);
    }
  };

  const handleSuggestionClick = (sector: string) => {
    onClientInfoChange('sector', sector);
    onClientInfoChange('type', sector);
    setSectorSuggestions([]);
    setIsSectorFocused(false);
  };

  // ─── WEBINAR MODE ───────────────────────────────────────────────────────────
  if (isWebinaire) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-100 dark:from-gray-800 dark:to-slate-900 flex items-center justify-center p-6">
        <div className="max-w-2xl w-full mx-auto">

          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 animate-fade-in-up">

            {/* Header with logos inline */}
            <div className="flex items-center justify-between gap-4 mb-6">
              {/* Logo SCC gauche */}
              <img
                src="/configurateur-cyber-anssi/logo-scc.jpg"
                alt="Logo SCC"
                className="h-12 object-contain flex-shrink-0"
                onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
              />
              {/* Titre centré */}
              <div className="text-center flex-1">
                <div className="inline-block bg-indigo-600 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-widest mb-2">
                  🎙️ Webinaire Cyber ANSSI
                </div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-1">
                  Identifiez-vous
                </h1>
                <p className="text-gray-500 dark:text-gray-400 text-sm">
                  Renseignez votre organisme, puis le questionnaire démarrera.
                </p>
              </div>
              {/* Logo UGAP droite */}
              <img
                src="/configurateur-cyber-anssi/logo-ugap.jpg"
                alt="Logo UGAP"
                className="h-12 object-contain flex-shrink-0"
                onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
              />
            </div>

            {/* Context */}
            <div className="bg-indigo-50 dark:bg-indigo-900/30 border-l-4 border-indigo-500 p-4 mb-6 rounded-r-lg">
              <p className="text-sm text-indigo-800 dark:text-indigo-200">
                🎯 <strong>Programme :</strong> 7 domaines de sécurité guidés par le commentateur.
                Un timer de 3 minutes s'activera après chaque domaine.
              </p>
            </div>

            {/* Fields */}
            <div className="space-y-4">

              {/* Nom organisme */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Nom de l'organisme *
                </label>
                <input
                  type="text"
                  value={clientInfo.name}
                  onChange={(e) => onClientInfoChange('name', e.target.value)}
                  className="w-full p-3 border-2 border-gray-300 dark:border-gray-600 rounded-lg focus:border-indigo-500 focus:outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder:text-gray-400"
                  placeholder="Ex : Mairie de Lyon, Conseil Départemental 69..."
                  autoFocus
                />
              </div>

              {/* Type / Secteur fusionné */}
              <div className={`relative ${isSectorFocused ? 'z-20' : ''}`}>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Type / Secteur d'organisme
                </label>
                <input
                  type="text"
                  value={clientInfo.sector || clientInfo.type}
                  onChange={(e) => handleSectorChange(e.target.value)}
                  onFocus={() => { setIsSectorFocused(true); setSectorSuggestions(ALL_SECTORS); }}
                  onBlur={() => setTimeout(() => setIsSectorFocused(false), 200)}
                  className="w-full p-3 border-2 border-gray-300 dark:border-gray-600 rounded-lg focus:border-indigo-500 focus:outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder:text-gray-400"
                  placeholder="Ex : Collectivité territoriale, Ministère..."
                  autoComplete="off"
                />
                {isSectorFocused && sectorSuggestions.length > 0 && (
                  <ul className="absolute w-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg mt-1 max-h-48 overflow-y-auto shadow-xl z-30">
                    {sectorSuggestions.map(s => (
                      <li
                        key={s}
                        onMouseDown={() => handleSuggestionClick(s)}
                        className="p-3 hover:bg-indigo-50 dark:hover:bg-indigo-900 cursor-pointer text-gray-700 dark:text-gray-200 text-sm"
                      >
                        {s}
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              {/* Taille */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Taille de la structure
                </label>
                <select
                  value={clientInfo.size}
                  onChange={(e) => onClientInfoChange('size', e.target.value)}
                  className="w-full p-3 border-2 border-gray-300 dark:border-gray-600 rounded-lg focus:border-indigo-500 focus:outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                >
                  <option value="">Sélectionner...</option>
                  <option value="< 50 agents">Moins de 50 agents</option>
                  <option value="50-200 agents">50 à 200 agents</option>
                  <option value="200-1000 agents">200 à 1000 agents</option>
                  <option value="> 1000 agents">Plus de 1000 agents</option>
                </select>
              </div>

              {/* Nom contact */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Votre nom / prénom
                </label>
                <input
                  type="text"
                  value={clientInfo.contact}
                  onChange={(e) => onClientInfoChange('contact', e.target.value)}
                  className="w-full p-3 border-2 border-gray-300 dark:border-gray-600 rounded-lg focus:border-indigo-500 focus:outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder:text-gray-400"
                  placeholder="Ex : Jean Dupont"
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Adresse email
                </label>
                <input
                  type="email"
                  value={clientInfo.email}
                  onChange={(e) => onClientInfoChange('email', e.target.value)}
                  className="w-full p-3 border-2 border-gray-300 dark:border-gray-600 rounded-lg focus:border-indigo-500 focus:outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder:text-gray-400"
                  placeholder="Ex : jean.dupont@mairie-lyon.fr"
                />
              </div>

            </div>

            {/* CTA */}
            <button
              onClick={onStart}
              disabled={!clientInfo.name}
              className={`w-full mt-6 py-4 rounded-xl font-bold text-white text-lg transition-all duration-300 flex items-center justify-center gap-2 ${
                clientInfo.name
                  ? 'bg-indigo-600 hover:bg-indigo-700 transform hover:scale-[1.02] shadow-lg'
                  : 'bg-gray-300 dark:bg-gray-600 cursor-not-allowed text-gray-400'
              }`}
            >
              <ChevronRight size={22} />
              Commencer le questionnaire
            </button>

            <p className="text-xs text-gray-400 dark:text-gray-500 text-center mt-4">
              v{APP_VERSION} — {BUILD_DATE}
            </p>
          </div>
        </div>
      </div>
    );
  }

  // ─── STANDARD MODE ──────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-800 dark:to-slate-900 p-8 flex items-center justify-center">
      <div className="max-w-3xl w-full mx-auto relative">
        <div className="absolute top-4 right-4 z-10">{themeSwitcher}</div>
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl p-8 animate-fade-in-up">

          <div className="text-center mb-8 animate-fade-in-up" style={{ animationDelay: '100ms' }}>
            <Shield className="mx-auto text-indigo-600 dark:text-indigo-400 mb-4" size={64} />
            <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-2">
              Configurateur Cyber ANSSI
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Audit de cybersécurité pour l'Administration Publique Française
            </p>
          </div>

          <div className="bg-blue-50 dark:bg-blue-900/50 border-l-4 border-blue-500 dark:border-blue-400 p-4 mb-8 animate-fade-in-up" style={{ animationDelay: '200ms' }}>
            <h3 className="font-semibold text-blue-900 dark:text-blue-200 mb-2">📋 Déroulement de l'audit</h3>
            <ul className="text-sm text-blue-800 dark:text-blue-300 space-y-1">
              <li>• <strong>Durée :</strong> 10-15 minutes</li>
              <li>• <strong>Questions :</strong> 7 domaines de sécurité (28 questions)</li>
              <li>• <strong>Livrables :</strong> Score de maturité + Recommandations ANSSI + Budget par phase</li>
              <li>• <strong>Sauvegarde automatique :</strong> Reprenez où vous en étiez</li>
            </ul>
          </div>

          <div className="space-y-4">

            {/* Logo Upload */}
            <div className="animate-fade-in-up" style={{ animationDelay: '250ms' }}>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Logo de l'organisme (optionnel)
              </label>
              <div className="flex items-center gap-4">
                {clientInfo.logo ? (
                  <div className="relative w-20 h-20 bg-gray-100 dark:bg-gray-700 rounded-lg border border-gray-300 dark:border-gray-600 flex items-center justify-center overflow-hidden">
                    <img src={clientInfo.logo} alt="Logo Client" className="object-contain w-full h-full" />
                    <button
                      onClick={() => onClientInfoChange('logo', '')}
                      className="absolute top-0 right-0 bg-red-500 text-white p-0.5 rounded-bl hover:bg-red-600"
                      title="Supprimer le logo"
                    >×</button>
                  </div>
                ) : (
                  <div className="w-20 h-20 bg-gray-50 dark:bg-gray-700 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600 flex items-center justify-center text-gray-400">
                    <ImageIcon size={24} />
                  </div>
                )}
                <label className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors">
                  <Upload size={16} className="text-gray-600 dark:text-gray-300" />
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-200">
                    {clientInfo.logo ? "Changer le logo" : "Importer un logo"}
                  </span>
                  <input type="file" accept="image/*" onChange={handleLogoUpload} className="hidden" />
                </label>
              </div>
            </div>

            {/* Nom organisme */}
            <div className="animate-fade-in-up" style={{ animationDelay: '300ms' }}>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Nom de l'organisme *
              </label>
              <input
                type="text"
                value={clientInfo.name}
                onChange={(e) => onClientInfoChange('name', e.target.value)}
                className="w-full p-3 border-2 border-gray-300 dark:border-gray-600 rounded-lg focus:border-indigo-500 focus:outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500"
                placeholder="Ex: Mairie de Paris, Conseil Départemental..."
              />
            </div>

            {/* Type / Secteur fusionné */}
            <div className={`relative animate-fade-in-up ${isSectorFocused ? 'z-20' : ''}`} style={{ animationDelay: '400ms' }}>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Type / Secteur d'organisme (pour un benchmark précis)
              </label>
              <input
                type="text"
                value={clientInfo.sector || clientInfo.type}
                onChange={(e) => handleSectorChange(e.target.value)}
                onFocus={() => { setIsSectorFocused(true); setSectorSuggestions(ALL_SECTORS); }}
                onBlur={() => setTimeout(() => setIsSectorFocused(false), 200)}
                className="w-full p-3 border-2 border-gray-300 dark:border-gray-600 rounded-lg focus:border-indigo-500 focus:outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500"
                placeholder="Ex: Collectivité territoriale, Établissement public..."
                autoComplete="off"
              />
              {isSectorFocused && sectorSuggestions.length > 0 && (
                <ul className="absolute w-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg mt-1 max-h-48 overflow-y-auto shadow-xl z-30">
                  {sectorSuggestions.map(s => (
                    <li
                      key={s}
                      onMouseDown={() => handleSuggestionClick(s)}
                      className="p-3 hover:bg-indigo-100 dark:hover:bg-indigo-900 cursor-pointer text-gray-700 dark:text-gray-200 text-sm"
                    >
                      {s}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Taille */}
            <div className="animate-fade-in-up" style={{ animationDelay: '500ms' }}>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Taille de la structure
              </label>
              <select
                value={clientInfo.size}
                onChange={(e) => onClientInfoChange('size', e.target.value)}
                className="w-full p-3 border-2 border-gray-300 dark:border-gray-600 rounded-lg focus:border-indigo-500 focus:outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              >
                <option value="">Sélectionner...</option>
                <option value="< 50 agents">Moins de 50 agents</option>
                <option value="50-200 agents">50 à 200 agents</option>
                <option value="200-1000 agents">200 à 1000 agents</option>
                <option value="> 1000 agents">Plus de 1000 agents</option>
              </select>
            </div>

            {/* Contact */}
            <div className="animate-fade-in-up" style={{ animationDelay: '600ms' }}>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Nom du contact (optionnel)
              </label>
              <input
                type="text"
                value={clientInfo.contact}
                onChange={(e) => onClientInfoChange('contact', e.target.value)}
                className="w-full p-3 border-2 border-gray-300 dark:border-gray-600 rounded-lg focus:border-indigo-500 focus:outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500"
                placeholder="Ex: Jean Dupont, DSI"
              />
            </div>

            {/* Email (remplace Téléphone) */}
            <div className="animate-fade-in-up" style={{ animationDelay: '700ms' }}>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Adresse email (optionnel)
              </label>
              <input
                type="email"
                value={clientInfo.email}
                onChange={(e) => onClientInfoChange('email', e.target.value)}
                className="w-full p-3 border-2 border-gray-300 dark:border-gray-600 rounded-lg focus:border-indigo-500 focus:outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500"
                placeholder="Ex: jean.dupont@collectivite.fr"
              />
            </div>

          </div>

          {/* RGPD (standard mode only) */}
          <div className="mt-6 bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 rounded-lg p-4 animate-fade-in-up" style={{ animationDelay: '800ms' }}>
            <div className="flex items-start">
              <Lock size={20} className="text-gray-500 dark:text-gray-400 mr-3 flex-shrink-0 mt-1" />
              <div>
                <h4 className="font-semibold text-gray-800 dark:text-gray-200">Confidentialité de vos données (RGPD)</h4>
                <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                  Les informations que vous saisissez sont stockées <strong>uniquement dans votre navigateur</strong> et ne sont jamais envoyées sur un serveur. La sauvegarde automatique permet de reprendre votre audit si vous quittez la page. Toutes les données sont effacées à la fermeture de votre navigateur.
                </p>
              </div>
            </div>
            <div className="mt-4">
              <label className="flex items-center text-sm text-gray-700 dark:text-gray-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={consentGiven}
                  onChange={(e) => setConsentGiven(e.target.checked)}
                  className="h-4 w-4 rounded border-gray-300 dark:border-gray-600 text-indigo-600 focus:ring-indigo-500 bg-gray-100 dark:bg-gray-700"
                />
                <span className="ml-2">J'ai lu et compris la notice sur la confidentialité de mes données.</span>
              </label>
            </div>
          </div>

          <button
            onClick={onStart}
            disabled={!clientInfo.name || !consentGiven}
            className={`w-full mt-8 py-4 rounded-lg font-semibold text-white transition-all duration-300 flex items-center justify-center gap-2 animate-fade-in-up ${
              clientInfo.name && consentGiven
                ? 'bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 transform hover:scale-105'
                : 'bg-gray-300 dark:bg-gray-600 cursor-not-allowed text-gray-500 dark:text-gray-400'
            }`}
            style={{ animationDelay: '900ms' }}
          >
            Commencer l'audit
            <ChevronRight size={20} />
          </button>

          <div className="mt-4 flex justify-center animate-fade-in-up" style={{ animationDelay: '950ms' }}>
            <label className="flex items-center gap-2 text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 cursor-pointer transition-colors">
              <Upload size={16} />
              <span>Charger un audit existant (.json)</span>
              <input type="file" accept=".json" onChange={handleFileImport} className="hidden" />
            </label>
          </div>

          <p className="text-xs text-gray-500 dark:text-gray-400 text-center mt-4 animate-fade-in-up" style={{ animationDelay: '1000ms' }}>
            <span>💾 Vos réponses sont sauvegardées automatiquement</span>
            <br />
            <span className="text-[10px] opacity-70">v{APP_VERSION} - {BUILD_DATE}</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ClientInfoForm;