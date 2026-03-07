"use client";
import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import Sidebar from '../components/Sidebar';
import RightPanel from '../components/RightPanel';
import axios from 'axios';

const MapComponent = dynamic(() => import('../components/Map'), { ssr: false });

export default function Home() {
  const [data, setData] = useState<any>(null);
  const [selectedDomain, setSelectedDomain] = useState('Composite');
  const [selectedWard, setSelectedWard] = useState(null);

  useEffect(() => {
    // Load data
    // Ideally fetch from API: axios.get('http://localhost:8000/wards/geojson')
    // For now load static file
    axios.get('/wards.geojson').then(res => {
      setData(res.data);
    }).catch(err => console.error(err));
  }, []);

  return (
    <div className="flex h-screen bg-stone-100 overflow-hidden">
      <Sidebar
        selectedDomain={selectedDomain}
        onSelectDomain={setSelectedDomain}
        allWards={data?.features || []}
        onSelectWard={setSelectedWard}
      />

      <div className="flex-1 flex flex-col relative">
        <div className="flex-1 relative">
          {data && (
            <MapComponent
              data={data}
              selectedDomain={selectedDomain}
              onSelectWard={setSelectedWard}
            />
          )}

          {/* Right Sidebar Panel */}
          {selectedWard && (
            <RightPanel
              ward={selectedWard}
              allWards={data?.features || []}
              onClose={() => setSelectedWard(null)}
            />
          )}
        </div>
      </div>
    </div>
  );
}
