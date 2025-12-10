import React from 'react';
import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Legend, Tooltip } from 'recharts';

interface CompetencyData {
    subject: string;
    mastery: number; // 0 to 1
    fullMark: number;
}

interface CompetencyRadarProps {
    data: CompetencyData[];
}

export const CompetencyRadar: React.FC<CompetencyRadarProps> = ({ data }) => {
    // Transform 0-1 mastery to 0-100 for better visualization
    const chartData = data.map(d => ({
        ...d,
        score: Math.round(d.mastery * 100),
        fullMark: 100
    }));

    return (
        <div className="w-full h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="80%" data={chartData}>
                    <PolarGrid />
                    <PolarAngleAxis dataKey="subject" />
                    <PolarRadiusAxis angle={30} domain={[0, 100]} />
                    <Radar
                        name="Mastery Level"
                        dataKey="score"
                        stroke="#8884d8"
                        fill="#8884d8"
                        fillOpacity={0.6}
                    />
                    <Tooltip />
                    <Legend />
                </RadarChart>
            </ResponsiveContainer>
        </div>
    );
};
