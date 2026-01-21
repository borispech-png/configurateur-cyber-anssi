import React from 'react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts';
import { DOMAINS } from '../constants';

interface MaturityRadarProps {
  domainScores: { [key: string]: number };
}

const MaturityRadar: React.FC<MaturityRadarProps> = ({ domainScores }) => {
  // Transformation des données pour le graphique radar
  // On utilise l'ordre de DOMAINS pour garder une cohérence
  const data = DOMAINS.map(domain => {
    // On nettoie le titre pour l'affichage (enlève les emojis et raccourcit si besoin)
    const shortLabel = domain.title.replace(/[\u{1F600}-\u{1F6FF}|[\u{2600}-\u{26FF}]/gu, '').trim().split(' ')[0]; // Prend juste le 1er mot souvent
    
    // On cherche le score complet. domainScores utilise le titre complet du domaine comme clé
    // Note: Il faudra s'assurer que la clé correspond exactement.
    // Dans App.tsx, domainScores est construit avec `domain.title`.
    const score = domainScores[domain.title] || 0;

    return {
      subject: domain.title, // On garde le titre complet pour le tooltip ou l'axe si ça rentre
      score: Math.round(score),
      fullMark: 100,
    };
  });

  // Custom tick pour raccourcir les labels si trop longs sur mobile
  const renderPolarAngleAxis = ({ payload, x, y, cx, cy, ...rest }: any) => {
    return (
      <text x={x} y={y} cx={cx} cy={cy} {...rest} fill="#6b7280" fontSize={10} textAnchor="middle">
        {payload.value.length > 20 ? payload.value.substring(0, 15) + '...' : payload.value}
      </text>
    );
  };

  return (
    <div className="w-full h-[300px] flex items-center justify-center">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data}>
          <PolarGrid gridType="polygon" />
          <PolarAngleAxis dataKey="subject" tick={{ fill: '#4B5563', fontSize: 11 }} />
          <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
          <Radar
            name="Maturité"
            dataKey="score"
            stroke="#4f46e5"
            strokeWidth={3}
            fill="#6366f1"
            fillOpacity={0.5}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default MaturityRadar;
