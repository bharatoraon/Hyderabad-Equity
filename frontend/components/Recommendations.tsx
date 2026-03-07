import React from 'react';
import { Lightbulb, AlertTriangle, CheckCircle, Bus, TreePine, TrendingUp, Gavel } from 'lucide-react';

interface RecommendationsProps {
    ward: any;
}

export default function Recommendations({ ward }: RecommendationsProps) {
    if (!ward) return null;

    const getRecommendations = (ward: any) => {
        const recs = [];

        // Access
        if (ward.ACCESS_SCORE < 0.6) {
            recs.push({
                type: 'critical',
                domain: 'Access',
                icon: Bus,
                text: 'Critical gap in public services. Prioritize new bus stops and school coverage.'
            });
        }

        // Environment
        if (ward.ENVIRONMENT_SCORE < 0.6) {
            recs.push({
                type: 'critical',
                domain: 'Environment',
                icon: TreePine,
                text: 'High pollution or low green cover. Urgent need for parks and waste management.'
            });
        }

        // Opportunity
        if (ward.OPPORTUNITY_SCORE < 0.6) {
            recs.push({
                type: 'warning',
                domain: 'Opportunity',
                icon: TrendingUp,
                text: 'Low economic activity. Incentivize local businesses and banking access.'
            });
        }

        // Governance
        if (ward.GOVERNANCE_SCORE < 0.6) {
            recs.push({
                type: 'warning',
                domain: 'Governance',
                icon: Gavel,
                text: 'Enhance civic participation and service reliability.'
            });
        }

        if (recs.length === 0) {
            recs.push({
                type: 'success',
                domain: 'General',
                icon: CheckCircle,
                text: 'This ward is performing well across most domains. Maintain current standards.'
            });
        }

        return recs;
    };

    const recommendations = getRecommendations(ward);

    return (
        <div className="bg-white p-6 shadow-sm rounded-2xl border border-stone-100">
            <h3 className="text-sm font-bold mb-6 flex items-center text-stone-800 uppercase tracking-widest">
                <Lightbulb className="mr-3 text-amber-500" size={20} strokeWidth={2.5} />
                Actionable Insights
            </h3>
            <div className="space-y-4">
                {recommendations.map((rec, index) => {
                    const Icon = rec.icon;
                    return (
                        <div
                            key={index}
                            className={`relative overflow-hidden rounded-xl p-4 flex items-start gap-4 ${rec.type === 'critical' ? 'bg-rose-50' :
                                rec.type === 'warning' ? 'bg-amber-50' :
                                    'bg-emerald-50'
                                }`}
                        >
                            <div className={`mt-1 p-2 rounded-full shrink-0 ${rec.type === 'critical' ? 'bg-rose-100 text-rose-600' :
                                rec.type === 'warning' ? 'bg-amber-100 text-amber-600' :
                                    'bg-emerald-100 text-emerald-600'
                                }`}>
                                <Icon size={18} strokeWidth={2.5} />
                            </div>

                            <div>
                                <h4 className={`text-xs font-bold uppercase tracking-wider mb-1 ${rec.type === 'critical' ? 'text-rose-700' :
                                    rec.type === 'warning' ? 'text-amber-700' :
                                        'text-emerald-700'
                                    }`}>
                                    {rec.domain}
                                </h4>
                                <p className="text-sm font-medium text-stone-700 leading-relaxed">
                                    {rec.text}
                                </p>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
