import React from 'react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts';
import { DOMAINS } from '../constants';

import { Benchmark } from '../types';

interface MaturityRadarProps {
  domainScores: { [key: string]: number };
  projectedScores?: { [key: string]: number };
  benchmark?: Benchmark | null;
}

const MaturityRadar: React.FC<MaturityRadarProps> = ({ domainScores, projectedScores, benchmark }) => {
  // Transformation des données pour le graphique radar
  const data = DOMAINS.map(domain => {
    // On nettoie le titre pour l'affichage
    const shortLabel = domain.title.replace(/[\u{1F600}-\u{1F6FF}|[\u{2600}-\u{26FF}]/gu, '').trim().split(' ')[0];
    
    const score = domainScores[domain.title] || 0;
    const projected = projectedScores ? (projectedScores[domain.title] || 0) : 0;
    const benchmarkScore = benchmark ? benchmark.avgMaturity : 0;

    return {
      subject: domain.title,
      score: Math.round(score),
      projected: Math.round(projected),
      benchmark: benchmarkScore,
      fullMark: 100,
    };
  });

  return (
    <div className="w-full h-[350px] flex items-center justify-center">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart cx="50%" cy="50%" outerRadius="70%" data={data}>
          <PolarGrid gridType="polygon" />
          <PolarAngleAxis dataKey="subject" tick={{ fill: '#4B5563', fontSize: 11 }} />
          <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
          
          {/* Score Actuel */}
          <Radar
            name="Maturité Actuelle"
            dataKey="score"
            stroke="#4f46e5"
            strokeWidth={3}
            fill="#6366f1"
            fillOpacity={projectedScores ? 0.3 : 0.6}
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

          {/* Benchmark Sectoriel */}
          {benchmark && (
             <Radar
              name={`Moyenne ${benchmark.description.split(' ')[0] || 'Secteur'}`}
              dataKey="benchmark"
              stroke="#9CA3AF" // Gray 400
              strokeWidth={2}
              fill="#9CA3AF"
              fillOpacity={0.1}
              strokeDasharray="4 4"
            />
          )}

          {/* Legend */}
          <text x="50%" y="95%" textAnchor="middle" dominantBaseline="middle" className="text-xs fill-gray-500 font-sans">
             {projectedScores ? 'Bleu: Actuel | Vert: Projeté' : 'Bleu: Actuel'}
             {benchmark && ' | Gris: Moyenne Secteur'}
          </text>

        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default MaturityRadar;
