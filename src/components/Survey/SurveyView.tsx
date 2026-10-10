import React, { useState } from 'react';
import {
  Compass,
  MapPin,
  Camera,
  Sun,
  Zap,
  Printer,
  Save,
  CheckCircle2,
  Navigation,
  FileText,
  Shield,
  Layers,
  ArrowRight,
} from 'lucide-react';
import { storage } from '../../services/storage';
import { SiteSurvey } from '../../types';
import { generateGoogleMapsLink, formatDate } from '../../utils/formatters';

interface SurveyViewProps {
  onSelectProject: (projectId: string) => void;
}

export const SurveyView: React.FC<SurveyViewProps> = ({ onSelectProject }) => {
  const db = storage.getDatabase();
  const [selectedSurvey, setSelectedSurvey] = useState<SiteSurvey>(
    db.surveys[0] || createDefaultSurvey()
  );
  const [activeTab, setActiveTab] = useState<'FORM' | 'REPORT_PRINT'>('FORM');
  const [isSaved, setIsSaved] = useState(false);

  function createDefaultSurvey(): SiteSurvey {
    return {
      id: `SRV-2026-${Date.now()}`,
      projectId: 'FCSS-2026-0002',
      surveyDate: new Date().toISOString().slice(0, 10),
      surveyorName: 'Nikhil Raut',
      surveyorPhone: '9823011226',
      customerName: 'Shri Anand Patwardhan',
      consumerNumber: '410020491823',
      mobile: '9422891234',
      address: 'Bungalow 18, West High Court Road, Dharampeth, Nagpur',
      msedclSdn: 'Dharampeth Sub-Dn 4401',
      sanctionedLoadKw: 7.5,
      existingPhase: 'Three Phase',
      existingSupplyVoltage: '415V AC',
      roofType: 'RCC Flat',
      roofAreaSqFt: 1800,
      availableInstallationAreaSqFt: 850,
      shadowFreeAreaSqFt: 750,
      roofDirection: 'South',
      structurePlacement: 'Elevated GI',
      accessCondition: 'Internal Stairs',
      waterproofingConcern: false,
      buildingHeightMeters: 9.0,
      morningShadow: 'None',
      afternoonShadow: 'None',
      eveningShadow: 'None',
      nearbyBuildingObstruction: 'No high-rise obstruction',
      treesObstruction: 'Gulmohar tree on road side (no shading)',
      waterTankObstruction: 'Water tank at North-East boundary',
      otherObstruction: 'None',
      proposedInverterLocation: 'Staircase terrace cabin wall',
      inverterMountType: 'Wall',
      ventilationCondition: 'Well Ventilated',
      distanceFromPanelsMeters: 5,
      distanceFromMainDbMeters: 18,
      weatherProtection: 'Covered / Indoor',
      dcCableRoute: 'Via Staircase shaft inside rigid PVC conduit',
      acCableRoute: 'Armoured cable to ground floor distribution board',
      approxDcCableLengthMeters: 20,
      approxAcCableLengthMeters: 30,
      cableTrayRequirement: 'Required',
      wiringType: 'Armoured Cable',
      existingEarthPits: 1,
      newPitsRequired: 3,
      proposedEarthPitLocation: 'Garden corner soft earth pit',
      distanceToEarthPitMeters: 10,
      lightningProtectionRequirement: true,
      meterLocation: 'Ground floor verandah',
      mainDbLocation: 'Main electrical room',
      acdbRequirement: true,
      dcdbRequirement: true,
      existingEarthingCondition: 'Good',
      mainCableSize: '10 sq mm Copper 4-Core',
      latitude: 21.1428,
      longitude: 79.0617,
      geoAddress: 'Dharampeth, Nagpur, Maharashtra 440010',
      photos: {},
      recommendedCapacityKw: 5.0,
      surveyReportPdfGenerated: true,
      remarks: 'Ideal south-facing RCC terrace. Recommended 9 x 550W bifacial modules with Solis 5kW three phase inverter.',
      status: 'Completed',
    };
  }

  const handleCaptureGps = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setSelectedSurvey({
            ...selectedSurvey,
            latitude: Number(pos.coords.latitude.toFixed(5)),
            longitude: Number(pos.coords.longitude.toFixed(5)),
            geoAddress: `Nagpur Geo-tag (${pos.coords.latitude.toFixed(4)}, ${pos.coords.longitude.toFixed(4)})`,
          });
          alert(`GPS Coordinates Captured: ${pos.coords.latitude}, ${pos.coords.longitude}`);
        },
        () => {
          // Default fallback to Nagpur center coordinates
          setSelectedSurvey({
            ...selectedSurvey,
            latitude: 21.1458,
            longitude: 79.0882,
            geoAddress: 'Zero Mile Stone, Nagpur, Maharashtra',
          });
        }
      );
    }
  };

  const handleSaveSurvey = () => {
    storage.saveSurvey(selectedSurvey);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2.5">
            <Compass className="w-6 h-6 text-amber-400" /> Site Survey & Rooftop Technical Feasibility
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
            Mobile-ready field survey form with GPS geo-tagging, shadow analysis & printable technical report
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setActiveTab(activeTab === 'FORM' ? 'REPORT_PRINT' : 'FORM')}
            className="flex items-center gap-2 px-3.5 py-2 bg-slate-800 hover:bg-slate-750 text-slate-200 border border-slate-700 rounded-xl text-xs font-semibold transition-colors"
          >
            <Printer className="w-4 h-4 text-amber-400" />
            <span>{activeTab === 'FORM' ? 'View Printable Report' : 'Back to Survey Form'}</span>
          </button>

          {activeTab === 'FORM' && (
            <button
              onClick={handleSaveSurvey}
              className="flex items-center gap-2 px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-xl text-xs font-bold transition-colors shadow-md"
            >
              <Save className="w-4 h-4" />
              <span>{isSaved ? 'Saved!' : 'Save Survey Report'}</span>
            </button>
          )}
        </div>
      </div>

      {/* Project Selector bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-slate-400">Select Project / Survey Record:</span>
          <select
            value={selectedSurvey.projectId}
            onChange={(e) => {
              const found = db.surveys.find((s) => s.projectId === e.target.value);
              if (found) {
                setSelectedSurvey(found);
              } else {
                const proj = db.projects.find((p) => p.id === e.target.value);
                if (proj) {
                  setSelectedSurvey({
                    ...createDefaultSurvey(),
                    projectId: proj.id,
                    customerName: proj.customerName,
                    consumerNumber: proj.consumerNumber,
                    mobile: proj.mobile,
                    address: proj.address,
                    recommendedCapacityKw: proj.systemCapacityKw,
                  });
                }
              }
            }}
            className="bg-slate-800 border border-slate-700 text-amber-400 font-mono rounded-lg px-3 py-1.5 focus:outline-none focus:border-amber-400"
          >
            {db.projects.map((p) => (
              <option key={p.id} value={p.id}>
                {p.id} - {p.customerName} ({p.systemCapacityKw} kW)
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-3">
          <a
            href={generateGoogleMapsLink(
              selectedSurvey.address,
              selectedSurvey.latitude,
              selectedSurvey.longitude
            )}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-sky-400 hover:text-sky-300 font-medium"
          >
            <Navigation className="w-3.5 h-3.5" />
            <span>Open Google Maps</span>
          </a>
          <button
            onClick={() => onSelectProject(selectedSurvey.projectId)}
            className="text-amber-400 hover:underline font-mono"
          >
            Open Project Hub →
          </button>
        </div>
      </div>

      {activeTab === 'FORM' ? (
        /* Mobile-Friendly Site Survey Form */
        <div className="space-y-6">
          {/* Section 1: Customer & Connection Info */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-800 pb-2.5">
              <Zap className="w-4 h-4 text-amber-400" />
              <h2 className="text-sm font-bold text-white uppercase tracking-wider">
                1. Customer & MSEDCL Connection Details
              </h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div>
                <label className="text-slate-400 font-medium">Customer Full Name</label>
                <input
                  type="text"
                  value={selectedSurvey.customerName}
                  onChange={(e) => setSelectedSurvey({ ...selectedSurvey, customerName: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white mt-1"
                />
              </div>
              <div>
                <label className="text-slate-400 font-medium">MSEDCL Consumer Number</label>
                <input
                  type="text"
                  value={selectedSurvey.consumerNumber}
                  onChange={(e) => setSelectedSurvey({ ...selectedSurvey, consumerNumber: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white font-mono mt-1"
                />
              </div>
              <div>
                <label className="text-slate-400 font-medium">MSEDCL Sub-Division (SDN)</label>
                <input
                  type="text"
                  value={selectedSurvey.msedclSdn}
                  onChange={(e) => setSelectedSurvey({ ...selectedSurvey, msedclSdn: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white mt-1"
                  placeholder="e.g. Besa / Dharampeth Sub-Dn"
                />
              </div>
              <div>
                <label className="text-slate-400 font-medium">Sanctioned Load (kW)</label>
                <input
                  type="number"
                  step="0.5"
                  value={selectedSurvey.sanctionedLoadKw}
                  onChange={(e) =>
                    setSelectedSurvey({ ...selectedSurvey, sanctionedLoadKw: Number(e.target.value) })
                  }
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white mt-1 font-mono"
                />
              </div>
              <div>
                <label className="text-slate-400 font-medium">Existing Phase</label>
                <select
                  value={selectedSurvey.existingPhase}
                  onChange={(e) =>
                    setSelectedSurvey({
                      ...selectedSurvey,
                      existingPhase: e.target.value as 'Single Phase' | 'Three Phase',
                    })
                  }
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white mt-1"
                >
                  <option value="Single Phase">Single Phase (Up to 5 kW)</option>
                  <option value="Three Phase">Three Phase</option>
                </select>
              </div>
              <div>
                <label className="text-slate-400 font-medium">Supply Voltage</label>
                <input
                  type="text"
                  value={selectedSurvey.existingSupplyVoltage}
                  onChange={(e) =>
                    setSelectedSurvey({ ...selectedSurvey, existingSupplyVoltage: e.target.value })
                  }
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white mt-1"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Rooftop & Structure */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-800 pb-2.5">
              <Layers className="w-4 h-4 text-amber-400" />
              <h2 className="text-sm font-bold text-white uppercase tracking-wider">
                2. Rooftop Specifications & Shadow Analysis
              </h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div>
                <label className="text-slate-400 font-medium">Roof Type</label>
                <select
                  value={selectedSurvey.roofType}
                  onChange={(e) =>
                    setSelectedSurvey({
                      ...selectedSurvey,
                      roofType: e.target.value as any,
                    })
                  }
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white mt-1"
                >
                  <option value="RCC Flat">RCC Flat Terrace</option>
                  <option value="Elevated Structure Required">Elevated Structure (Headroom)</option>
                  <option value="Tin Shed">Industrial / Tin Shed</option>
                  <option value="Tile Roof">Mangalore Tile Roof</option>
                </select>
              </div>
              <div>
                <label className="text-slate-400 font-medium">Total Roof Area (Sq. Ft)</label>
                <input
                  type="number"
                  value={selectedSurvey.roofAreaSqFt}
                  onChange={(e) =>
                    setSelectedSurvey({ ...selectedSurvey, roofAreaSqFt: Number(e.target.value) })
                  }
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white mt-1 font-mono"
                />
              </div>
              <div>
                <label className="text-slate-400 font-medium">Shadow-Free Installation Area (Sq. Ft)</label>
                <input
                  type="number"
                  value={selectedSurvey.shadowFreeAreaSqFt}
                  onChange={(e) =>
                    setSelectedSurvey({ ...selectedSurvey, shadowFreeAreaSqFt: Number(e.target.value) })
                  }
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white mt-1 font-mono"
                />
              </div>
              <div>
                <label className="text-slate-400 font-medium">Roof Direction</label>
                <select
                  value={selectedSurvey.roofDirection}
                  onChange={(e) =>
                    setSelectedSurvey({ ...selectedSurvey, roofDirection: e.target.value as any })
                  }
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white mt-1"
                >
                  <option value="South">True South (Best Solar Yield)</option>
                  <option value="South-East">South-East</option>
                  <option value="South-West">South-West</option>
                  <option value="East">East</option>
                  <option value="West">West</option>
                </select>
              </div>
              <div>
                <label className="text-slate-400 font-medium">Structure Placement</label>
                <select
                  value={selectedSurvey.structurePlacement}
                  onChange={(e) =>
                    setSelectedSurvey({ ...selectedSurvey, structurePlacement: e.target.value as any })
                  }
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white mt-1"
                >
                  <option value="Elevated GI">Elevated GI Structure (8 to 9 ft clearance)</option>
                  <option value="Flush Mount">Flush Mount (Low height)</option>
                  <option value="High-Rise Super Structure">High-Rise Super Structure</option>
                </select>
              </div>
              <div>
                <label className="text-slate-400 font-medium">Recommended Capacity (kW)</label>
                <input
                  type="number"
                  step="0.1"
                  value={selectedSurvey.recommendedCapacityKw}
                  onChange={(e) =>
                    setSelectedSurvey({
                      ...selectedSurvey,
                      recommendedCapacityKw: Number(e.target.value),
                    })
                  }
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-amber-400 font-bold font-mono mt-1"
                />
              </div>
            </div>

            {/* Shadow Analysis Sub-box */}
            <div className="p-3 bg-slate-850 rounded-xl border border-slate-800 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div>
                <label className="text-slate-400 font-medium">Morning Shadow (9 AM - 11 AM)</label>
                <select
                  value={selectedSurvey.morningShadow}
                  onChange={(e) =>
                    setSelectedSurvey({ ...selectedSurvey, morningShadow: e.target.value as any })
                  }
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1.5 text-white mt-1"
                >
                  <option value="None">None</option>
                  <option value="Slight">Slight (Edge)</option>
                  <option value="Severe">Severe</option>
                </select>
              </div>
              <div>
                <label className="text-slate-400 font-medium">Afternoon Shadow (12 PM - 3 PM)</label>
                <select
                  value={selectedSurvey.afternoonShadow}
                  onChange={(e) =>
                    setSelectedSurvey({ ...selectedSurvey, afternoonShadow: e.target.value as any })
                  }
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1.5 text-white mt-1"
                >
                  <option value="None">None (Unobstructed)</option>
                  <option value="Slight">Slight</option>
                  <option value="Severe">Severe</option>
                </select>
              </div>
              <div>
                <label className="text-slate-400 font-medium">Evening Shadow (3 PM - 5 PM)</label>
                <select
                  value={selectedSurvey.eveningShadow}
                  onChange={(e) =>
                    setSelectedSurvey({ ...selectedSurvey, eveningShadow: e.target.value as any })
                  }
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1.5 text-white mt-1"
                >
                  <option value="None">None</option>
                  <option value="Slight">Slight</option>
                  <option value="Severe">Severe</option>
                </select>
              </div>
            </div>
          </div>

          {/* Section 3: Inverter, Wiring & Earthing */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-800 pb-2.5">
              <Shield className="w-4 h-4 text-amber-400" />
              <h2 className="text-sm font-bold text-white uppercase tracking-wider">
                3. Inverter Location, Wiring Route & Chemical Earthing
              </h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div>
                <label className="text-slate-400 font-medium">Proposed Inverter Location</label>
                <input
                  type="text"
                  value={selectedSurvey.proposedInverterLocation}
                  onChange={(e) =>
                    setSelectedSurvey({ ...selectedSurvey, proposedInverterLocation: e.target.value })
                  }
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white mt-1"
                />
              </div>
              <div>
                <label className="text-slate-400 font-medium">Approx DC Cable Length (Meters)</label>
                <input
                  type="number"
                  value={selectedSurvey.approxDcCableLengthMeters}
                  onChange={(e) =>
                    setSelectedSurvey({
                      ...selectedSurvey,
                      approxDcCableLengthMeters: Number(e.target.value),
                    })
                  }
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white mt-1 font-mono"
                />
              </div>
              <div>
                <label className="text-slate-400 font-medium">Approx AC Cable Length (Meters)</label>
                <input
                  type="number"
                  value={selectedSurvey.approxAcCableLengthMeters}
                  onChange={(e) =>
                    setSelectedSurvey({
                      ...selectedSurvey,
                      approxAcCableLengthMeters: Number(e.target.value),
                    })
                  }
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white mt-1 font-mono"
                />
              </div>
              <div>
                <label className="text-slate-400 font-medium">New Earth Pits Required</label>
                <input
                  type="number"
                  value={selectedSurvey.newPitsRequired}
                  onChange={(e) =>
                    setSelectedSurvey({ ...selectedSurvey, newPitsRequired: Number(e.target.value) })
                  }
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white mt-1 font-mono"
                />
              </div>
              <div>
                <label className="text-slate-400 font-medium">Lightning Arrester (LA) Required</label>
                <select
                  value={selectedSurvey.lightningProtectionRequirement ? 'YES' : 'NO'}
                  onChange={(e) =>
                    setSelectedSurvey({
                      ...selectedSurvey,
                      lightningProtectionRequirement: e.target.value === 'YES',
                    })
                  }
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white mt-1"
                >
                  <option value="YES">Yes - Mandatory for Rooftop Solar</option>
                  <option value="NO">No</option>
                </select>
              </div>
              <div>
                <label className="text-slate-400 font-medium">Proposed Earth Pit Location</label>
                <input
                  type="text"
                  value={selectedSurvey.proposedEarthPitLocation}
                  onChange={(e) =>
                    setSelectedSurvey({ ...selectedSurvey, proposedEarthPitLocation: e.target.value })
                  }
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white mt-1"
                />
              </div>
            </div>
          </div>

          {/* Section 4: Geo-Tag & Surveyor Signature */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-amber-400" />
                <h2 className="text-sm font-bold text-white uppercase tracking-wider">
                  4. GPS Geo-Tagging & Surveyor Sign-Off
                </h2>
              </div>
              <button
                type="button"
                onClick={handleCaptureGps}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-500/20 text-amber-400 border border-amber-500/40 rounded-lg text-xs font-semibold hover:bg-amber-500/30 transition-colors"
              >
                <MapPin className="w-3.5 h-3.5" />
                <span>Capture Live GPS</span>
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div>
                <label className="text-slate-400 font-medium">Latitude</label>
                <input
                  type="number"
                  step="0.00001"
                  value={selectedSurvey.latitude}
                  onChange={(e) =>
                    setSelectedSurvey({ ...selectedSurvey, latitude: Number(e.target.value) })
                  }
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white font-mono mt-1"
                />
              </div>
              <div>
                <label className="text-slate-400 font-medium">Longitude</label>
                <input
                  type="number"
                  step="0.00001"
                  value={selectedSurvey.longitude}
                  onChange={(e) =>
                    setSelectedSurvey({ ...selectedSurvey, longitude: Number(e.target.value) })
                  }
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white font-mono mt-1"
                />
              </div>
              <div>
                <label className="text-slate-400 font-medium">Surveyor Name</label>
                <input
                  type="text"
                  value={selectedSurvey.surveyorName}
                  onChange={(e) =>
                    setSelectedSurvey({ ...selectedSurvey, surveyorName: e.target.value })
                  }
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white mt-1"
                />
              </div>
              <div className="sm:col-span-3">
                <label className="text-slate-400 font-medium">Surveyor Technical Remarks</label>
                <textarea
                  rows={2}
                  value={selectedSurvey.remarks}
                  onChange={(e) =>
                    setSelectedSurvey({ ...selectedSurvey, remarks: e.target.value })
                  }
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white mt-1"
                />
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Printable Professional Site Survey Report (Requirement 6) */
        <div className="bg-white text-slate-900 rounded-2xl p-8 max-w-4xl mx-auto shadow-2xl border border-slate-200 print:p-0 print:border-none">
          {/* Header */}
          <div className="border-b-2 border-slate-900 pb-4 mb-6 flex items-start justify-between">
            <div>
              <div className="text-xl font-black tracking-tight text-slate-950">
                FRONTIER COMPLETE SOLAR SOLUTIONS
              </div>
              <div className="text-xs text-slate-600 font-medium mt-0.5">
                Registered PM Surya Ghar Vendor • MSEDCL Empanelled
              </div>
              <div className="text-xs text-slate-500">
                Plot 12, Wardha Road / Besa, Nagpur, Maharashtra - 440037
              </div>
            </div>
            <div className="text-right">
              <span className="inline-block px-3 py-1 bg-amber-100 text-amber-900 font-bold text-xs rounded border border-amber-300">
                TECHNICAL SITE SURVEY REPORT
              </span>
              <div className="font-mono text-xs text-slate-700 mt-1">
                Project ID: <strong>{selectedSurvey.projectId}</strong>
              </div>
              <div className="text-xs text-slate-500">Date: {formatDate(selectedSurvey.surveyDate)}</div>
            </div>
          </div>

          {/* Content Tables */}
          <div className="space-y-6 text-xs">
            {/* Consumer Section */}
            <div>
              <div className="bg-slate-100 font-bold px-3 py-1.5 border border-slate-300 uppercase tracking-wide text-[11px]">
                A. Customer & Electricity Connection Info
              </div>
              <div className="grid grid-cols-2 gap-x-4 gap-y-2 p-3 border border-t-0 border-slate-300">
                <div>Customer Name: <strong>{selectedSurvey.customerName}</strong></div>
                <div>Consumer No: <strong>{selectedSurvey.consumerNumber}</strong></div>
                <div>Address: <strong>{selectedSurvey.address}</strong></div>
                <div>MSEDCL SDN: <strong>{selectedSurvey.msedclSdn}</strong></div>
                <div>Sanctioned Load: <strong>{selectedSurvey.sanctionedLoadKw} kW ({selectedSurvey.existingPhase})</strong></div>
                <div>GPS Coordinates: <strong>{selectedSurvey.latitude}° N, {selectedSurvey.longitude}° E</strong></div>
              </div>
            </div>

            {/* Rooftop Section */}
            <div>
              <div className="bg-slate-100 font-bold px-3 py-1.5 border border-slate-300 uppercase tracking-wide text-[11px]">
                B. Rooftop & Shadow Analysis
              </div>
              <div className="grid grid-cols-2 gap-x-4 gap-y-2 p-3 border border-t-0 border-slate-300">
                <div>Roof Type: <strong>{selectedSurvey.roofType}</strong></div>
                <div>Roof Area: <strong>{selectedSurvey.roofAreaSqFt} Sq. Ft</strong></div>
                <div>Shadow-Free Area: <strong>{selectedSurvey.shadowFreeAreaSqFt} Sq. Ft</strong></div>
                <div>Direction & Tilt: <strong>{selectedSurvey.roofDirection} Facing (True South)</strong></div>
                <div>Structure Type: <strong>{selectedSurvey.structurePlacement}</strong></div>
                <div>Recommended Solar Capacity: <strong className="text-amber-800 text-sm">{selectedSurvey.recommendedCapacityKw} kW</strong></div>
              </div>
            </div>

            {/* Electrical Section */}
            <div>
              <div className="bg-slate-100 font-bold px-3 py-1.5 border border-slate-300 uppercase tracking-wide text-[11px]">
                C. Electrical & Balance of System (BoS) Feasibility
              </div>
              <div className="grid grid-cols-2 gap-x-4 gap-y-2 p-3 border border-t-0 border-slate-300">
                <div>Inverter Proposed Location: <strong>{selectedSurvey.proposedInverterLocation}</strong></div>
                <div>DC Cable Route Length: <strong>Approx {selectedSurvey.approxDcCableLengthMeters} Meters</strong></div>
                <div>AC Cable Route Length: <strong>Approx {selectedSurvey.approxAcCableLengthMeters} Meters</strong></div>
                <div>New Chemical Earth Pits: <strong>{selectedSurvey.newPitsRequired} Pits (Marconite Compound)</strong></div>
                <div>Lightning Arrester: <strong>Copper Terminal Required (Dedicated Pit)</strong></div>
                <div>ACDB & DCDB: <strong>IP65 with Type II Surge Protection Devices</strong></div>
              </div>
            </div>

            {/* Observations */}
            <div className="p-3 border border-slate-300 bg-amber-50/50">
              <div className="font-bold text-slate-800 mb-1">Technical Findings:</div>
              <p className="text-slate-700 leading-relaxed">{selectedSurvey.remarks}</p>
            </div>

            {/* Signatures */}
            <div className="pt-8 grid grid-cols-2 gap-12 text-center text-xs text-slate-700">
              <div className="border-t border-slate-400 pt-2">
                <div>Surveyor Signature: <strong>{selectedSurvey.surveyorName}</strong></div>
                <div className="text-[10px] text-slate-500">Frontier Complete Solar Solutions</div>
              </div>
              <div className="border-t border-slate-400 pt-2">
                <div>Customer Signature: <strong>{selectedSurvey.customerName}</strong></div>
                <div className="text-[10px] text-slate-500">Terrace & Feasibility Confirmed</div>
              </div>
            </div>
          </div>

          <div className="mt-8 text-center print:hidden">
            <button
              onClick={() => window.print()}
              className="px-6 py-2.5 bg-slate-900 text-white font-bold rounded-xl text-xs hover:bg-slate-800 transition-colors shadow-lg"
            >
              Print Site Survey Report (A4 PDF)
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
