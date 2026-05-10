import React, { useRef } from 'react';
import { motion } from 'motion/react';
import { 
  Download, 
  Share2, 
  MapPin, 
  Calendar, 
  ShieldCheck, 
  Plane,
  DownloadCloud,
  AlertTriangle
} from 'lucide-react';
import { UserProfile } from '../../types';
import html2canvas from 'html2canvas';
import { getDateStatus, getStatusColor } from '../../lib/dateUtils.ts';
import { ADMIN_EMAIL } from '../../services/billingService';

interface StudentCardProps {
  profile: UserProfile;
}

export default function StudentCard({ profile }: StudentCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const isAdmin = profile.email === ADMIN_EMAIL;

  const medicalStatus = getDateStatus(profile.medicalExpiry);
  const licenseStatus = getDateStatus(profile.licenseExpiry);

  const downloadCard = async () => {
    if (!cardRef.current) return;
    try {
      const canvas = await html2canvas(cardRef.current, {
        backgroundColor: '#0f172a',
        scale: 2
      });
      const link = document.createElement('a');
      link.download = `ACP_ID_${profile.studentId}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch (err) {
      console.error('Failed to export ID card:', err);
    }
  };

  const shareCard = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'My AirclassPRO Student ID',
          text: `Check out my aviation student ID: ${profile.studentId}`,
          url: window.location.href
        });
      } catch (err) {
        console.error('Share failed:', err);
      }
    } else {
      alert('Sharing not supported on this browser');
    }
  };

  return (
    <div className="flex flex-col items-center gap-8 py-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="text-center">
        <h2 className="text-2xl font-black text-slate-900 tracking-tight uppercase italic mb-2">
          Digital ID Card
        </h2>
        <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">
          Authorized Training Credentials
        </p>
      </div>

      <div className="relative group">
        {/* Card Container for HTML2Canvas */}
        <div 
          ref={cardRef}
          className="w-[400px] h-[250px] bg-slate-900 rounded-[2rem] p-6 text-white relative overflow-hidden shadow-2xl border border-white/10"
        >
          {/* Background Accents */}
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-blue-600/20 rounded-full blur-3xl" />
          <div className="absolute top-0 right-0 p-6 opacity-20">
            <Plane size={120} className="-rotate-45" />
          </div>
          
          <div className="relative h-full flex flex-col justify-between">
            {/* Header */}
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center font-black italic text-lg shadow-lg shadow-blue-500/20">
                  ACP
                </div>
                <div>
                  <h3 className="text-xs font-black tracking-widest uppercase italic">AirclassPRO</h3>
                  <p className="text-[8px] font-bold text-slate-500 uppercase tracking-widest">DGCA Exam Preparation</p>
                </div>
              </div>
              <div className="px-3 py-1 bg-white/10 rounded-full text-[8px] font-black uppercase tracking-widest border border-white/5">
                {isAdmin ? 'ADMIN' : profile.planId} Tier
              </div>
            </div>

            {/* Main Info */}
            <div className="flex gap-6 items-center">
              <div className="w-20 h-20 bg-slate-800 rounded-2xl border-2 border-blue-500/30 overflow-hidden flex items-center justify-center">
                {profile.profilePhoto ? (
                  <img src={profile.profilePhoto} alt={profile.name} className="w-full h-full object-cover" />
                ) : (
                  <UserIcon className="text-slate-600" size={32} />
                )}
              </div>
              <div>
                <h4 className="text-lg font-black uppercase tracking-tight leading-tight">
                  {profile.name}
                </h4>
                <p className="text-blue-400 text-[10px] font-bold uppercase tracking-widest mb-2">
                  {profile.licenseType}
                </p>
                <div className="space-y-1">
                  <p className="text-slate-500 text-[8px] font-black uppercase tracking-widest">Student Login ID</p>
                  <p className="text-sm font-mono tracking-[0.2em] font-bold">{profile.studentId}</p>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="flex justify-between items-end border-t border-white/5 pt-4">
              <div className="flex gap-4">
                <div>
                   <p className="text-slate-600 text-[7px] font-black uppercase tracking-widest mb-0.5">Medical Exp</p>
                   <p className={`text-[9px] font-bold ${getStatusColor(medicalStatus.severity)}`}>
                     {profile.medicalExpiry ? new Date(profile.medicalExpiry).toLocaleDateString() : 'N/A'}
                   </p>
                </div>
                <div>
                   <p className="text-slate-600 text-[7px] font-black uppercase tracking-widest mb-0.5">License Exp</p>
                   <p className={`text-[9px] font-bold ${getStatusColor(licenseStatus.severity)}`}>
                     {profile.licenseExpiry ? new Date(profile.licenseExpiry).toLocaleDateString() : 'N/A'}
                   </p>
                </div>
              </div>
              <div className="flex items-center gap-1.5 text-blue-500">
                <ShieldCheck size={12} />
                <span className="text-[8px] font-black uppercase tracking-widest">Verified Pilot</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Real-time Status Display */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full max-w-4xl px-4">
         {[
           { label: 'Medical', status: medicalStatus },
           { label: 'License', status: licenseStatus },
           { label: 'Flight Review', status: getDateStatus(profile.flightReviewDate) },
           { label: 'BFR Due', status: getDateStatus(profile.bfrDueDate) }
         ].map((item, i) => (
           <div key={i} className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
             <p className="text-[8px] font-black uppercase text-slate-400 mb-1 tracking-widest">{item.label}</p>
             <p className={`text-[10px] font-bold ${getStatusColor(item.status.severity)}`}>{item.status.label}</p>
           </div>
         ))}
      </div>

      <div className="flex gap-4">
        <button 
          onClick={downloadCard}
          className="flex items-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-600 transition-all shadow-xl shadow-slate-200"
        >
          <DownloadCloud size={16} />
          Download Image
        </button>
        <button 
          onClick={shareCard}
          className="flex items-center gap-2 px-6 py-3 bg-white border border-slate-200 text-slate-700 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-50 transition-all shadow-xl shadow-slate-100"
        >
          <Share2 size={16} />
          Share ID
        </button>
      </div>

      <div className="max-w-sm text-center">
        <p className="text-xs font-bold text-slate-400 leading-relaxed italic">
          "This digital ID card identifies you as an active student of AirclassPRO DGCA Exam Preparation. 
          Keep your subscription active to maintain validity."
        </p>
      </div>
    </div>
  );
}

function UserIcon({ className, size }: { className?: string, size?: number }) {
  return (
    <svg 
      className={className} 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    >
      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}
