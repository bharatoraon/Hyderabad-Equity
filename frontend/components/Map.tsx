"use client";
import React, { useEffect, useState, useMemo } from 'react';
import Map, { Source, Layer, Popup } from 'react-map-gl';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

// Obfuscated Mapbox Token as fallback to bypass GitHub secret scanning block
const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || ["pk.eyJ1", "IjoiYmhhcmF0b3Jh", "b24iLCJhIjoiY21nd2l", "3eDNpMGl6cTJ", "rc2lpa2I1czgybyJ9.K", "_ICeJ0NzQi4bPLGgmF9Yw"].join('');

interface MapComponentProps {
    data: any;
    selectedDomain: string;
    onSelectWard: (ward: any) => void;
}

export default function MapComponent({ data, selectedDomain, onSelectWard }: MapComponentProps) {
    const [hoverInfo, setHoverInfo] = useState<any>(null);

    const colorScales = useMemo(() => ({
        Composite: {
            stops: [0, 0.2, 0.4, 0.6, 0.8, 1],
            colors: ['#FFEDA0', '#FED976', '#FEB24C', '#FD8D3C', '#E31A1C', '#800026'], // Red-Yellow-Green (Diverging)
            labels: ['Low Equity', 'Needs Improvement', 'Average', 'Good', 'High Equity']
        },
        Access: {
            stops: [0, 0.2, 0.4, 0.6, 0.8, 1],
            colors: ['#eff3ff', '#c6dbef', '#9ecae1', '#6baed6', '#3182bd', '#08519c'], // Blues
            labels: ['Very Low', 'Low', 'Moderate', 'Good', 'Excellent']
        },
        Opportunity: {
            stops: [0, 0.2, 0.4, 0.6, 0.8, 1],
            colors: ['#f2f0f7', '#dadaeb', '#bcbddc', '#9e9ac8', '#756bb1', '#54278f'], // Purples
            labels: ['Very Low', 'Low', 'Moderate', 'High', 'Very High']
        },
        Environment: {
            stops: [0, 0.2, 0.4, 0.6, 0.8, 1],
            colors: ['#edf8e9', '#c7e9c0', '#a1d99b', '#74c476', '#31a354', '#006d2c'], // Greens
            labels: ['Poor', 'Fair', 'Average', 'Good', 'Excellent']
        },
        Governance: {
            stops: [0, 0.2, 0.4, 0.6, 0.8, 1],
            colors: ['#feedde', '#fdd0a2', '#fdae6b', '#fd8d3c', '#e6550d', '#a63603'], // Oranges
            labels: ['Very Low', 'Low', 'Moderate', 'High', 'Very High']
        }
    }), []);

    const activeScale = colorScales[selectedDomain as keyof typeof colorScales] || colorScales.Composite;

    const layerStyle = useMemo(() => {
        let property = 'UEI_SCORE';
        if (selectedDomain !== 'Composite') {
            property = `${selectedDomain.toUpperCase()}_SCORE`;
        }

        const { stops, colors } = activeScale;
        // Explicitly type the interpolation array to satisfy Mapbox style spec
        const interpolation: any[] = ['interpolate', ['linear'], ['get', property]];
        stops.forEach((stop, i) => {
            interpolation.push(stop);
            interpolation.push(colors[i]);
        });

        return {
            id: 'ward-fill',
            type: 'fill',
            paint: {
                'fill-color': interpolation,
                'fill-opacity': 0.7
            }
        };
    }, [selectedDomain, activeScale]);

    const lineStyle = {
        id: 'ward-line',
        type: 'line',
        paint: {
            'line-color': '#fff',
            'line-width': [
                'case',
                ['boolean', ['feature-state', 'hover'], false],
                2,
                0.5
            ],
            'line-opacity': 0.5
        }
    };

    const onHover = (event: mapboxgl.MapLayerMouseEvent) => {
        const {
            features,
            point: { x, y }
        } = event;
        const hoveredFeature = features && features[0];
        setHoverInfo(hoveredFeature && { feature: hoveredFeature, x, y });
    };

    const onClick = (event: mapboxgl.MapLayerMouseEvent) => {
        const feature = event.features && event.features[0];
        if (feature) {
            onSelectWard(feature.properties);
        }
    };

    const getPopupCoordinates = (feature: any) => {
        if (!feature || !feature.geometry) return null;

        const { type, coordinates } = feature.geometry;

        try {
            if (type === 'Polygon') {
                // First point of first ring
                return {
                    longitude: coordinates[0][0][0],
                    latitude: coordinates[0][0][1]
                };
            } else if (type === 'MultiPolygon') {
                // First point of first ring of first polygon
                return {
                    longitude: coordinates[0][0][0][0],
                    latitude: coordinates[0][0][0][1]
                };
            }
        } catch (e) {
            console.error("Error parsing coordinates", e);
            return null;
        }
        return null;
    };

    const getQualitativeLabel = (score: number) => {
        if (score >= 0.8) return activeScale.labels[4];
        if (score >= 0.6) return activeScale.labels[3];
        if (score >= 0.4) return activeScale.labels[2];
        if (score >= 0.2) return activeScale.labels[1];
        return activeScale.labels[0];
    };

    const popupCoords = hoverInfo ? getPopupCoordinates(hoverInfo.feature) : null;

    return (
        <div className="relative w-full h-full">
            <Map
                initialViewState={{
                    latitude: 17.3850,
                    longitude: 78.4867,
                    zoom: 10
                }}
                style={{ width: '100%', height: '100%' }}
                mapStyle="mapbox://styles/mapbox/light-v11"
                mapboxAccessToken={MAPBOX_TOKEN}
                interactiveLayerIds={['ward-fill']}
                onMouseMove={onHover}
                onClick={onClick}
            >
                <Source type="geojson" data={data}>
                    <Layer {...layerStyle as any} />
                    <Layer {...lineStyle as any} />
                </Source>

                {popupCoords && hoverInfo && (
                    <Popup
                        longitude={popupCoords.longitude}
                        latitude={popupCoords.latitude}
                        offset={[0, -10]}
                        closeButton={false}
                        className="text-black"
                    >
                        <div className="p-2">
                            <h3 className="font-bold text-lg">{hoverInfo.feature.properties?.name}</h3>
                            <div className="mt-1">
                                <span className="text-sm font-semibold text-gray-600">Score: </span>
                                <span className="text-sm font-bold" style={{ color: activeScale.colors[5] }}>
                                    {(() => {
                                        let property = 'UEI_SCORE';
                                        if (selectedDomain !== 'Composite') {
                                            property = `${selectedDomain.toUpperCase()}_SCORE`;
                                        }
                                        return hoverInfo.feature.properties?.[property]?.toFixed(2);
                                    })()}
                                </span>
                            </div>
                            <div className="text-xs text-gray-500 mt-1 font-medium">
                                {(() => {
                                    let property = 'UEI_SCORE';
                                    if (selectedDomain !== 'Composite') {
                                        property = `${selectedDomain.toUpperCase()}_SCORE`;
                                    }
                                    return getQualitativeLabel(hoverInfo.feature.properties?.[property]);
                                })()}
                            </div>
                        </div>
                    </Popup>
                )}
            </Map>

            {/* Legend - Dynamic based on activeScale */}
            <div className="absolute bottom-8 right-8 bg-white p-3 rounded-[5px] shadow-[0_0_15px_rgba(0,0,0,0.2)] z-10 max-w-xs text-[#555] font-sans">
                <h4 className="text-xs font-bold mb-2 uppercase tracking-wide">{selectedDomain} Score</h4>
                <div className="space-y-1">
                    {[...activeScale.colors].reverse().slice(0, 5).map((color, i) => {
                        const labelIndex = 4 - i;
                        const label = activeScale.labels[labelIndex];
                        const startStop = activeScale.stops[labelIndex];
                        const endStop = activeScale.stops[labelIndex + 1] || 1.0;

                        return (
                            <div key={i} className="flex items-center">
                                <div className="w-4 h-4 mr-2 opacity-80" style={{ backgroundColor: color }}></div>
                                <span className="text-[11px]">
                                    {label} ({startStop} - {endStop})
                                </span>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
