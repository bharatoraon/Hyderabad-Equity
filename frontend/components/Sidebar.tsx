import React, { useState } from 'react';
import { Layers, Activity, TreePine, Gavel, LayoutDashboard, Search } from 'lucide-react';
import Image from 'next/image';

interface SidebarProps {
    selectedDomain: string;
    onSelectDomain: (domain: string) => void;
    allWards: any[];
    onSelectWard: (ward: any) => void;
}

export default function Sidebar({ selectedDomain, onSelectDomain, allWards, onSelectWard }: SidebarProps) {
    const [searchTerm, setSearchTerm] = useState("");

    const domains = [
        { id: 'Composite', label: 'UEI Score', icon: LayoutDashboard, desc: "Overall equity score combining all factors." },
        { id: 'Access', label: 'Access', icon: Layers, desc: "Reachability of schools, hospitals, and transit." },
        { id: 'Opportunity', label: 'Opportunity', icon: Activity, desc: "Economic activity and financial inclusion." },
        { id: 'Environment', label: 'Environment', icon: TreePine, desc: "Parks, green cover, and pollution levels." },
        { id: 'Governance', label: 'Governance', icon: Gavel, desc: "Civic participation and service reliability." },
    ];

    const filteredWards = allWards
        .filter(w => w.properties.name.toLowerCase().includes(searchTerm.toLowerCase()))
        .slice(0, 5); // Limit results

    return (
        <div className="w-80 bg-white/95 backdrop-blur-md shadow-xl h-full flex flex-col z-20 border-r border-stone-200 font-sans">
            {/* Header with Logo */}
            <div className="p-6 border-b border-stone-100 bg-white">
                <a
                    href="https://buildsoc.in/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="relative w-full h-16 block"
                >
                    <Image
                        src="/buildsoc_logo.svg"
                        alt="Buildsoc Logo"
                        fill
                        className="object-contain object-left pointer-events-none"
                        priority
                    />
                </a>
            </div>

            {/* Search */}
            <div className="p-4 border-b border-stone-100 bg-stone-50/50">
                <div className="relative">
                    <Search className="absolute left-3 top-2.5 text-stone-400" size={16} />
                    <input
                        type="text"
                        placeholder="Search for a ward..."
                        className="w-full pl-9 pr-4 py-2 border border-stone-200 rounded-md focus:outline-none focus:ring-1 focus:ring-stone-400 text-sm bg-white shadow-sm transition-all"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                {searchTerm && (
                    <div className="mt-2 bg-white border border-stone-100 rounded-md shadow-lg max-h-40 overflow-y-auto z-50">
                        {filteredWards.map(ward => (
                            <button
                                key={ward.properties.id}
                                onClick={() => {
                                    onSelectWard(ward.properties);
                                    setSearchTerm("");
                                }}
                                className="w-full text-left px-4 py-2 text-sm hover:bg-stone-50 text-stone-700 border-b border-stone-50 last:border-0"
                            >
                                {ward.properties.name}
                            </button>
                        ))}
                        {filteredWards.length === 0 && (
                            <div className="p-3 text-sm text-stone-500 text-center">No wards found</div>
                        )}
                    </div>
                )}
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-1">
                <h2 className="text-[10px] font-bold text-stone-400 uppercase tracking-widest mb-3 px-2">Select Domain</h2>
                <div className="space-y-2">
                    {domains.map((domain) => {
                        const Icon = domain.icon;
                        const isActive = selectedDomain === domain.id;
                        return (
                            <button
                                key={domain.id}
                                onClick={() => onSelectDomain(domain.id)}
                                className={`w-full text-left p-3 rounded-lg transition-all duration-200 border group ${isActive
                                    ? 'bg-stone-800 border-stone-800 shadow-md'
                                    : 'bg-white border-transparent hover:bg-stone-50 hover:border-stone-200'
                                    }`}
                            >
                                <div className="flex items-center space-x-3 mb-1">
                                    <div className={`p-1.5 rounded-md transition-colors ${isActive ? 'bg-stone-700 text-white' : 'bg-stone-100 text-stone-500 group-hover:bg-white group-hover:text-stone-700'}`}>
                                        <Icon size={16} />
                                    </div>
                                    <span className={`font-semibold text-sm ${isActive ? 'text-white' : 'text-stone-600'}`}>
                                        {domain.label}
                                    </span>
                                </div>
                                <p className={`text-[11px] pl-11 leading-relaxed ${isActive ? 'text-stone-400' : 'text-stone-400'}`}>
                                    {domain.desc}
                                </p>
                            </button>
                        );
                    })}
                </div>
            </div>
            <div className="p-4 border-t border-stone-100 text-[10px] text-center text-stone-400 bg-stone-50">
                &copy; 2025 Buildsoc Research | UEI Platform
            </div>
        </div>
    );
}
