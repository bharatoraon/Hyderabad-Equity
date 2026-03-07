import React from 'react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, ScatterChart, Scatter, XAxis, YAxis, ZAxis, Tooltip, Cell } from 'recharts';

interface ChartsProps {
    ward: any;
    allWards: any[];
}

export default function Charts({ ward, allWards }: ChartsProps) {
    if (!ward) return <div className="p-4 text-gray-500">Select a ward to view details</div>;

    const radarData = [
        { subject: 'Access', A: ward.ACCESS_SCORE || 0, fullMark: 1 },
        { subject: 'Opportunity', A: ward.OPPORTUNITY_SCORE || 0, fullMark: 1 },
        { subject: 'Environment', A: ward.ENVIRONMENT_SCORE || 0, fullMark: 1 },
        { subject: 'Governance', A: ward.GOVERNANCE_SCORE || 0, fullMark: 1 },
    ];

    // Prepare PCA Data
    const pcaData = allWards.map(w => ({
        x: w.properties.PCA_1,
        y: w.properties.PCA_2,
        name: w.properties.name,
        type: w.properties.Ward_Typology,
        isSelected: w.properties.id === ward.id
    }));

    const COLORS = {
        'Type A': '#0088FE',
        'Type B': '#00C49F',
        'Type C': '#FFBB28',
        'Type D': '#FF8042'
    };

    return (
        <div className="space-y-6">
            {/* Domain Scores Card */}
            <div className="bg-white p-6 shadow-sm rounded-2xl border border-stone-100">
                <h4 className="text-sm font-bold mb-2 text-stone-800 uppercase tracking-widest">Domain Scores</h4>
                <p className="text-xs text-stone-500 mb-4 leading-relaxed">
                    This chart shows how balanced the ward's development is. A larger, more symmetrical shape indicates better performance across all areas (Access, Opportunity, Environment, Governance).
                </p>
                <div className="h-64 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                            <PolarGrid stroke="#e5e7eb" />
                            <PolarAngleAxis dataKey="subject" tick={{ fill: '#78716c', fontSize: 12 }} />
                            <PolarRadiusAxis angle={30} domain={[0, 1]} tick={false} axisLine={false} />
                            <Radar name={ward.name} dataKey="A" stroke="#f59e0b" fill="#f59e0b" fillOpacity={0.5} />
                            <Tooltip
                                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                itemStyle={{ color: '#f59e0b', fontWeight: 600 }}
                            />
                        </RadarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Ward Typology Card */}
            <div className="bg-white p-6 shadow-sm rounded-2xl border border-stone-100">
                <div className="flex justify-between items-start mb-2">
                    <h4 className="text-sm font-bold text-stone-800 uppercase tracking-widest">Ward Typology</h4>
                    <span className="px-2 py-1 bg-stone-100 text-stone-600 text-xs font-bold rounded">
                        {ward.Ward_Typology}
                    </span>
                </div>
                <p className="text-xs text-stone-500 mb-4 leading-relaxed">
                    This map groups wards with similar characteristics together. Wards in the same color cluster face similar challenges and require similar policy interventions.
                </p>
                <div className="h-64 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                            <XAxis type="number" dataKey="x" name="PCA 1" hide />
                            <YAxis type="number" dataKey="y" name="PCA 2" hide />
                            <Tooltip
                                cursor={{ strokeDasharray: '3 3' }}
                                content={({ active, payload }) => {
                                    if (active && payload && payload.length) {
                                        const data = payload[0].payload;
                                        return (
                                            <div className="bg-white p-2 shadow-lg rounded-lg border border-stone-100 text-xs">
                                                <p className="font-bold text-stone-800">{data.name}</p>
                                                <p className="text-stone-500">{data.type}</p>
                                            </div>
                                        );
                                    }
                                    return null;
                                }}
                            />
                            <Scatter name="Wards" data={pcaData} fill="#8884d8">
                                {pcaData.map((entry, index) => (
                                    <Cell
                                        key={`cell-${index}`}
                                        fill={entry.isSelected ? '#f43f5e' : (COLORS as any)[entry.type] || '#cbd5e1'}
                                        stroke={entry.isSelected ? '#fff' : 'none'}
                                        strokeWidth={2}
                                    />
                                ))}
                            </Scatter>
                        </ScatterChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
}
