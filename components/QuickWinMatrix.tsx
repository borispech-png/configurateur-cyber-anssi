import React from 'react';
import { ScatterChart, Scatter, XAxis, YAxis, ZAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine, Cell } from 'recharts';
import { Recommendation } from '../types';

interface QuickWinMatrixProps {
  recommendations: Recommendation[];
}

const QuickWinMatrix: React.FC<QuickWinMatrixProps> = ({ recommendations }) => {
  // Mapper les recommandations
  const data = recommendations
    .filter(rec => rec.effort && rec.impact) // Garder uniquement celles avec Effort/Impact définis
    .map(rec => ({
      name: rec.question, // Question text (shortened if needed)
      x: rec.effort,      // Axe X : 1=Facile -> 3=Difficile
      y: rec.impact,      // Axe Y : 1=Faible -> 3=Critique
      z: 100,             // Taille du point
      fullText: rec.question,
      domain: rec.domain
    }));

  if (data.length === 0) return null; // Pas de données

  // Configuration des zones (Quadrants)
  // X: Effort (1-3), Y: Impact (1-3)
  // Quick Wins: Effort Bas, Impact Haut
  // Major Projects: Effort Haut, Impact Haut
  
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const point = payload[0].payload;
      return (
        <div className="bg-white dark:bg-gray-800 p-3 border border-gray-200 dark:border-gray-700 shadow-lg rounded-lg text-xs z-50 max-w-[200px]">
          <p className="font-bold text-gray-900 dark:text-gray-100 mb-1">{point.domain}</p>
          <p className="text-gray-600 dark:text-gray-300">{point.fullText}</p>
          <div className="mt-2 flex justify-between font-mono text-gray-500">
             <span>Effort: {point.x}</span>
             <span>Impact: {point.y}</span>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full h-[400px] relative bg-white dark:bg-gray-800/50 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
      
      {/* Background Labels */}
      <div className="absolute top-4 left-4 text-green-600 font-bold bg-green-100 px-2 py-1 rounded text-xs opacity-80 z-10">
        🚀 QUICK WINS
      </div>
      <div className="absolute top-4 right-4 text-yellow-600 font-bold bg-yellow-100 px-2 py-1 rounded text-xs opacity-80 z-10">
        🏗️ PROJETS MAJEURS
      </div>
      <div className="absolute bottom-4 left-4 text-gray-500 font-bold bg-gray-100 px-2 py-1 rounded text-xs opacity-80 z-10">
        📝 TÂCHES SIMPLES
      </div>
       <div className="absolute bottom-4 right-4 text-red-500 font-bold bg-red-100 px-2 py-1 rounded text-xs opacity-80 z-10">
        ⚠️ TÂCHES COMPLEXES
      </div>


      <ResponsiveContainer width="100%" height="100%">
        <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            type="number" 
            dataKey="x" 
            name="Effort" 
            domain={[0.5, 3.5]} 
            ticks={[1, 2, 3]}
            tickFormatter={(val) => val === 1 ? 'Facile' : val === 2 ? 'Moyen' : 'Difficile'}
            stroke="#94a3b8"
          />
          <YAxis 
            type="number" 
            dataKey="y" 
            name="Impact" 
            domain={[0.5, 3.5]} 
            ticks={[1, 2, 3]}
            tickFormatter={(val) => val === 1 ? 'Faible' : val === 2 ? 'Important' : 'Critique'}
             stroke="#94a3b8"
          />
          <ZAxis type="number" dataKey="z" range={[100, 300]} />
          <Tooltip content={<CustomTooltip />} cursor={{ strokeDasharray: '3 3' }} />
          
          {/* Reference Lines to split quadrants */}
          <ReferenceLine x={2} stroke="#cbd5e1" strokeWidth={2} strokeDasharray="5 5" />
          <ReferenceLine y={2} stroke="#cbd5e1" strokeWidth={2} strokeDasharray="5 5" />

          <Scatter name="Recommandations" data={data} fill="#6366f1">
            {data.map((entry, index) => {
                 // Color logic based on quadrant
                 let color = '#9ca3af'; // Grey default
                 if (entry.x <= 2 && entry.y >= 2) color = '#16a34a'; // Quick Win (Green)
                 if (entry.x > 2 && entry.y >= 2) color = '#eab308'; // Major Project (Yellow)
                 
                 return <Cell key={`cell-${index}`} fill={color} />;
            })}
          </Scatter>
        </ScatterChart>
      </ResponsiveContainer>
    </div>
  );
};

export default QuickWinMatrix;
