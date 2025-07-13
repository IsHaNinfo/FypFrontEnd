import React from "react";
import { mentalRecommendationsMap } from "@/data/mentalRecommendation";
interface MentalRecommandationModalProps {
  show: boolean;
  onClose: () => void;
  scenario: string;
  
}

const MentalRecommandationModal: React.FC<MentalRecommandationModalProps> = ({
  show,
  onClose,
  scenario,
}) => {
  if (!show) return null;

  const data = mentalRecommendationsMap[scenario] || mentalRecommendationsMap["high_stress"];

  const sectionIcons = {
    stress: (
      <svg className="w-6 h-6 text-red-400" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
      </svg>
    ),
    mood: (
      <svg className="w-6 h-6 text-yellow-400" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.182 15.182a4.5 4.5 0 01-6.364 0M21 12a9 9 0 11-18 0 9 9 0 0118 0zM9.75 9.75c0 .414-.168.75-.375.75S9 10.164 9 9.75 9.168 9 9.375 9s.375.336.375.75zm-.375 0h.008v.008H9.375V9.75zm5.625 0c0 .414-.168.75-.375.75s-.375-.336-.375-.75.168-.75.375-.75.375.336.375.75zm-.375 0h.008v.008H14.625V9.75z" />
      </svg>
    ),
    recommendation: (
      <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    how: (
      <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
      </svg>
    ),
    when: (
      <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    why: (
      <svg className="w-6 h-6 text-indigo-400" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z" />
      </svg>
    ),
    followUp: (
      <svg className="w-6 h-6 text-pink-400" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
      </svg>
    )
  };

  const sections = [
    { key: 'stress', label: 'Stress Level', value: data.stress },
    { key: 'mood', label: 'Mood', value: data.mood },
    { key: 'recommendation', label: 'Recommendation', value: data.recommendation },
    { key: 'how', label: 'How to do it', value: data.how },
    { key: 'when', label: 'When', value: data.when },
    { key: 'why', label: 'Why it works', value: data.why },
    { key: 'followUp', label: 'Doctor Follow-up', value: data.followUp }
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
      <div className="rounded-2xl p-8 w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl bg-gradient-to-b from-gray-800 to-gray-900">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-white">Mental Health Recommendation</h1>
          <button 
            onClick={onClose} 
            className="text-3xl font-bold text-white hover:text-red-400 transition-colors"
          >
            &times;
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {sections.map((section, index) => (
            <div 
              key={section.key} 
              className={`bg-white/10 rounded-xl p-6 shadow-lg ${
                section.key === 'followUp' ? 'md:col-span-2 bg-pink-500/20 border-l-4 border-pink-400' : ''
              }`}
            >
              <div className="flex items-center mb-4">
                {sectionIcons[section.key]}
                <h3 className="ml-3 text-xl font-semibold text-white">{section.label}</h3>
              </div>
              <p className={`text-white/90 leading-relaxed ${
                section.key === 'followUp' ? 'text-pink-100' : ''
              }`}>
                {section.value}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-8 p-6 bg-white/10 rounded-xl shadow-lg">
          <h3 className="text-2xl font-bold text-white mb-4">Quick Summary</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex flex-col items-center p-4 bg-white/20 rounded-lg">
              <div className="text-red-400 text-2xl font-bold mb-2">{data.stress}</div>
              <div className="text-white/80 text-sm">Stress Level</div>
            </div>
            <div className="flex flex-col items-center p-4 bg-white/20 rounded-lg">
              <div className="text-yellow-400 text-2xl font-bold mb-2">{data.mood}</div>
              <div className="text-white/80 text-sm">Current Mood</div>
            </div>
            <div className="flex flex-col items-center p-4 bg-white/20 rounded-lg">
              <div className="text-green-400 text-2xl font-bold mb-2">Active</div>
              <div className="text-white/80 text-sm">Recommendation Status</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MentalRecommandationModal;