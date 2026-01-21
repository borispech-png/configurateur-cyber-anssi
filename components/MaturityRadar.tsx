import React from 'react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts';
import { DOMAINS } from '../constants';

interface MaturityRadarProps {
  domainScores: { [key: string]: number };
  projectedScores?: { [key: string]: number };
}

const MaturityRadar: React.FC<MaturityRadarProps> = ({ domainScores, projectedScores }) => {
  // Transformation des données pour le graphique radar
  const data = DOMAINS.map(domain => {
    // On nettoie le titre pour l'affichage
    const shortLabel = domain.title.replace(/[\u{1F600}-\u{1F6FF}|[\u{2600}-\u{26FF}]/gu, '').trim().split(' ')[0];
    
    const score = domainScores[domain.title] || 0;
    const projected = projectedScores ? (projectedScores[domain.title] || 0) : 0;

    return {
      subject: domain.title,
      score: Math.round(score),
      projected: Math.round(projected),
      fullMark: 100,
    };
  });

  return (
    <div className="w-full h-[300px] flex items-center justify-center">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart cx="50%" cy="50%" outerRadius="75%" data={data}>
          <PolarGrid gridType="polygon" />
          <PolarAngleAxis dataKey="subject" tick={{ fill: '#4B5563', fontSize: 10 }} />
          <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
          
          {/* Score Actuel */}
          <Radar
            name="Maturité Actuelle"
            dataKey="score"
            stroke="#4f46e5"
            strokeWidth={2}
            fill="#6366f1"
            fillOpacity={projectedScores ? 0.3 : 0.6} // More transparent if comparison active
          />

          {/* Score Projeté (si simulation active) */}
          {projectedScores && (
             <Radar
              name="Maturité Projetée"
              dataKey="projected"
              stroke="#10b981" // Green
              strokeWidth={3}
              fill="#34d399"
              fillOpacity={0.4}
              strokeDasharray="5 5"
            />
          )}

          {/* Legend to make it clear */}
          {projectedScores && (
              <text x="50%" y="95%" textAnchor="middle" dominantBaseline="middle" className="text-xs fill-gray-500">
                  Bleu: Actuel | Vert: Projeté
              </text>
          )}

        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default MaturityRadar;
