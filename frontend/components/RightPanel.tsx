import React from 'react';
import { X, MapPin } from 'lucide-react';
import Charts from './Charts';
import Recommendations from './Recommendations';

interface RightPanelProps {
    ward: any;
    allWards: any[];
    onClose: () => void;
}

export default function RightPanel({ ward, allWards, onClose }: RightPanelProps) {
    if (!ward) return null;

    return (
        <div className="absolute top-0 right-0 h-full w-[450px] bg-white/95 backdrop-blur-md shadow-2xl border-l border-stone-200 z-30 flex flex-col transform transition-transform duration-300 ease-in-out font-sans">
            {/* Header */}
            <div className="p-5 border-b border-stone-100 flex justify-between items-start bg-white">
                <div>
                    <h2 className="text-xl font-bold text-stone-800 flex items-center gap-2">
                        <MapPin size={20} className="text-stone-600" />
                        {ward.name}
                    </h2>
                    <p className="text-sm text-stone-500 mt-1 ml-7">
                        Ward ID: <span className="font-mono bg-stone-100 px-1.5 py-0.5 rounded text-stone-600 text-xs">{ward.id}</span>
                    </p>
                </div>
                <button
                    onClick={onClose}
                    className="p-2 hover:bg-stone-100 rounded-full text-stone-400 hover:text-stone-600 transition-colors"
                >
                    <X size={20} />
                </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-8">
                {/* Score Summary */}
                <div>
                    <div className="flex items-baseline justify-between mb-2">
                        <h3 className="text-sm font-bold text-stone-400 uppercase tracking-widest">Equity Score</h3>
                        <span className="text-xs font-medium text-stone-400">Scale: 0 - 1.0</span>
                    </div>

                    <div className="bg-stone-50 p-6 rounded-2xl border border-stone-100 shadow-sm">
                        <div className="flex items-center justify-between mb-4">
                            <div>
                                <div className={`text-4xl font-bold tracking-tight ${ward.UEI_SCORE >= 0.6 ? 'text-emerald-600' :
                                        ward.UEI_SCORE >= 0.4 ? 'text-amber-600' : 'text-rose-600'
                                    }`}>
                                    {ward.UEI_SCORE?.toFixed(2)}
                                </div>
                                <div className={`text-sm font-bold mt-1 ${ward.UEI_SCORE >= 0.6 ? 'text-emerald-700' :
                                        ward.UEI_SCORE >= 0.4 ? 'text-amber-700' : 'text-rose-700'
                                    }`}>
                                    {ward.UEI_SCORE >= 0.8 ? 'High Equity' :
                                        ward.UEI_SCORE >= 0.6 ? 'Good Equity' :
                                            ward.UEI_SCORE >= 0.4 ? 'Average Equity' :
                                                ward.UEI_SCORE >= 0.2 ? 'Needs Improvement' : 'Low Equity'}
                                </div>
                            </div>
                            <div className="text-right">
                                <div className="text-xs text-stone-400 font-medium uppercase tracking-wide mb-1">City Average</div>
                                <div className="text-lg font-semibold text-stone-600">0.54</div>
                            </div>
                        </div>

                        {/* Progress Bar */}
                        <div className="w-full bg-stone-200 h-2 rounded-full overflow-hidden mb-4">
                            <div
                                className={`h-full rounded-full transition-all duration-500 ${ward.UEI_SCORE >= 0.6 ? 'bg-emerald-500' :
                                        ward.UEI_SCORE >= 0.4 ? 'bg-amber-500' : 'bg-rose-500'
                                    }`}
                                style={{ width: `${ward.UEI_SCORE * 100}%` }}
                            ></div>
                        </div>

                        {/* Context Description */}
                        <p className="text-xs text-stone-500 leading-relaxed border-t border-stone-100 pt-3 mt-3">
                            {ward.UEI_SCORE >= 0.6
                                ? "This ward demonstrates strong performance across most equity indicators, suggesting good access to services and opportunities."
                                : ward.UEI_SCORE >= 0.4
                                    ? "This ward shows average performance. While some services are accessible, there are specific gaps that need policy attention."
                                    : "This ward faces significant equity challenges. Immediate intervention in infrastructure and service delivery is recommended."}
                        </p>
                    </div>
                </div>

                <Charts ward={ward} allWards={allWards} />
                <Recommendations ward={ward} />
            </div>
        </div>
    );
}
