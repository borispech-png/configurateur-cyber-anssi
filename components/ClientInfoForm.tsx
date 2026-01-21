import React, { useState } from 'react';
import { Shield, ChevronRight, Lock, Upload, Image as ImageIcon } from 'lucide-react';
import { ClientInfo } from '../types';
import { BENCHMARKS } from '../constants';

interface ClientInfoFormProps {
  clientInfo: ClientInfo;
  onClientInfoChange: (field: keyof ClientInfo, value: string) => void;
  onStart: () => void;
  themeSwitcher: React.ReactNode;
  onImport: (data: string) => void;
}

const ClientInfoForm: React.FC<ClientInfoFormProps> = ({ clientInfo, onClientInfoChange, onStart, themeSwitcher, onImport }) => {
  const [consentGiven, setConsentGiven] = useState(false);
  const [sectorSuggestions, setSectorSuggestions] = useState<string[]>([]);
  const [isSectorInputFocused, setIsSectorInputFocused] = useState(false);

  const benchmarkSectors = Object.keys(BENCHMARKS);
  
  const handleFileImport = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
          const reader = new FileReader();
          reader.onload = (event) => {
              if (event.target?.result) {
                  onImport(event.target.result as string);
              }
          };
          reader.readAsText(file);
      }
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
          const reader = new FileReader();
          reader.onloadend = () => {
              onClientInfoChange('logo', reader.result as string);
          };
          reader.readAsDataURL(file);
      }
  };

  const handleSectorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    onClientInfoChange('sector', value);
    if (value) {
      const filtered = benchmarkSectors.filter(sector =>
        sector.toLowerCase().includes(value.toLowerCase())
      );
      setSectorSuggestions(filtered);
    } else {
      setSectorSuggestions([]);
    }
  };
  
  const handleSuggestionClick = (sector: string) => {
    onClientInfoChange('sector', sector);
    setSectorSuggestions([]);
    setIsSectorInputFocused(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-800 dark:to-slate-900 p-8 flex items-center justify-center">
      <div className="max-w-3xl w-full mx-auto relative">
        <div className="absolute top-4 right-4 z-10">
            {themeSwitcher}
        </div>
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
                            >
                                ×
                            </button>
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

            <div className="animate-fade-in-up" style={{ animationDelay: '400ms' }}>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Type d'organisme
              </label>
              <select
                value={clientInfo.type}
                onChange={(e) => onClientInfoChange('type', e.target.value)}
                className="w-full p-3 border-2 border-gray-300 dark:border-gray-600 rounded-lg focus:border-indigo-500 focus:outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              >
                <option value="">Sélectionner...</option>
                <option value="Collectivité territoriale">Collectivité territoriale</option>
                <option value="Ministère">Ministère</option>
                <option value="Établissement public">Établissement public</option>
                <option value="Agence d'État">Agence d'État</option>
                <option value="Préfecture">Préfecture</option>
                <option value="Autre">Autre</option>
              </select>
            </div>

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

            <div className={`relative animate-fade-in-up ${isSectorInputFocused ? 'z-20' : ''}`} style={{ animationDelay: '600ms' }}>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Secteur d'activité (pour un benchmark plus précis)
              </label>
              <input
                type="text"
                value={clientInfo.sector}
                onChange={handleSectorChange}
                onFocus={() => {
                  setIsSectorInputFocused(true);
                  if (!clientInfo.sector) setSectorSuggestions(benchmarkSectors);
                }}
                onBlur={() => setTimeout(() => setIsSectorInputFocused(false), 200)}
                className="w-full p-3 border-2 border-gray-300 dark:border-gray-600 rounded-lg focus:border-indigo-500 focus:outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500"
                placeholder="Ex: Santé, Éducation, ou sélectionnez un type"
                autoComplete="off"
              />
              {isSectorInputFocused && sectorSuggestions.length > 0 && (
                <ul className="absolute z-10 w-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg mt-1 max-h-48 overflow-y-auto shadow-lg">
                  {sectorSuggestions.map(suggestion => (
                    <li
                      key={suggestion}
                      onMouseDown={() => handleSuggestionClick(suggestion)}
                      className="p-3 hover:bg-indigo-100 dark:hover:bg-indigo-900 cursor-pointer text-gray-700 dark:text-gray-200"
                    >
                      {suggestion}
                    </li>
                  ))}
                </ul>
              )}
            </div>
            
            <div className="animate-fade-in-up" style={{ animationDelay: '700ms' }}>
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

              <div className="animate-fade-in-up" style={{ animationDelay: '800ms' }}>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Téléphone (optionnel)
                </label>
                <input
                  type="tel"
                  value={clientInfo.phone}
                  onChange={(e) => onClientInfoChange('phone', e.target.value)}
                  className="w-full p-3 border-2 border-gray-300 dark:border-gray-600 rounded-lg focus:border-indigo-500 focus:outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500"
                  placeholder="Ex: 01 23 45 67 89"
                />
              </div>
          </div>
          
          <div className="mt-6 bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 rounded-lg p-4 animate-fade-in-up" style={{ animationDelay: '900ms' }}>
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
            style={{ animationDelay: '1000ms' }}
          >
            Commencer l'audit
            <ChevronRight size={20} />
          </button>

          <div className="mt-4 flex justify-center animate-fade-in-up" style={{ animationDelay: '1050ms' }}>
              <label className="flex items-center gap-2 text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 cursor-pointer transition-colors">
                  <Upload size={16} />
                  <span>Charger un audit existant (.json)</span>
                  <input type="file" accept=".json" onChange={handleFileImport} className="hidden" />
              </label>
          </div>

          <p className="text-xs text-gray-500 dark:text-gray-400 text-center mt-4 animate-fade-in-up" style={{ animationDelay: '1100ms' }}>
            💾 Vos réponses sont sauvegardées automatiquement
          </p>
        </div>
      </div>
    </div>
  );
};

export default ClientInfoForm;