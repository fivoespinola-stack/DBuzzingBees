import React from 'react';
import { Sparkles, Clock, Users, ArrowRight, ShieldCheck, Leaf, HeartHandshake, Award, MapPin } from 'lucide-react';
import { CleaningService, CleanType } from '../types';

interface ServicesViewProps {
  services: CleaningService[];
  onSelectService: (serviceId: CleanType) => void;
}

export const ServicesView: React.FC<ServicesViewProps> = ({
  services,
  onSelectService,
}) => {
  return (
    <div className="space-y-10 pb-12">
      
      {/* Hero Banner Section */}
      <div className="relative rounded-3xl overflow-hidden border border-neutral-200 dark:border-neutral-800 bg-neutral-900 text-white min-h-[340px] flex items-center shadow-lg">
        <img 
          src="/src/assets/images/service_home_cleaning_1792590284917.jpg"
          alt="DBuzzingBees Perth Clean Home"
          className="absolute inset-0 w-full h-full object-cover opacity-40 mix-blend-luminosity scale-105"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-neutral-950 via-neutral-950/85 to-transparent" />
        
        <div className="relative z-10 max-w-2xl p-6 sm:p-10 space-y-4">
          <div className="flex items-center gap-2 text-xs font-bold text-amber-400">
            <span>🐝</span>
            <span>PERTH'S PREMIER CLEANING & MAINTENANCE TEAM</span>
          </div>
          
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight leading-tight text-white">
            DBuzzingBees Cleaning Services
          </h1>
          
          <p className="text-sm text-neutral-300 leading-relaxed max-w-xl">
            Reliable residential housekeeping, commercial office cleaning, 100% bond-back vacate cleans, streak-free window washing, and lawn mowing across Perth, Western Australia.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-3">
            <button
              onClick={() => onSelectService('residential')}
              className="px-5 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-500 text-neutral-950 text-xs font-bold transition-all shadow-md shadow-amber-500/25 flex items-center gap-2 cursor-pointer"
            >
              <span>Book a Perth Clean</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <span className="text-xs text-neutral-400 flex items-center gap-1 font-mono">
              <MapPin className="w-3.5 h-3.5 text-amber-400" />
              Perth WA Metro & Coastal Suburbs
            </span>
          </div>
        </div>
      </div>

      {/* Trust & Quality Markers (Perth WA standards) */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { icon: <ShieldCheck className="w-5 h-5 text-amber-500" />, title: "WA Police Cleared", desc: "100% verified, insured & background-checked cleaners" },
          { icon: <Award className="w-5 h-5 text-emerald-500" />, title: "Bond Back Guarantee", desc: "Meets real estate agency tenancy standards for vacate cleans" },
          { icon: <Leaf className="w-5 h-5 text-teal-500" />, title: "Commercial Equipment", desc: "Honda mowers, pure-water window poles, & HEPA filtration" },
          { icon: <HeartHandshake className="w-5 h-5 text-sky-500" />, title: "Flexible Schedules", desc: "Weekly, fortnightly, monthly, or customized recurring rosters" }
        ].map((item, idx) => (
          <div 
            key={idx}
            className="p-4 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 space-y-1.5"
          >
            <div className="p-2 rounded-xl bg-neutral-50 dark:bg-neutral-800 w-fit">
              {item.icon}
            </div>
            <div className="font-bold text-xs text-neutral-900 dark:text-white">
              {item.title}
            </div>
            <p className="text-[11px] text-neutral-500 leading-relaxed">
              {item.desc}
            </p>
          </div>
        ))}
      </div>

      {/* Services Grid (The 5 exact requested services) */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-xl font-bold text-neutral-900 dark:text-white">
              DBuzzingBees Core Services
            </h2>
            <p className="text-xs text-neutral-500 mt-0.5">
              Select any service below to schedule online or assign to your recurring roster.
            </p>
          </div>
          <span className="text-xs font-mono text-neutral-500">
            Currency: AUD ($) · All inclusive
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service) => (
            <div
              key={service.id}
              className="group flex flex-col rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 overflow-hidden hover:border-amber-400 dark:hover:border-amber-400 transition-all shadow-xs hover:shadow-md"
            >
              {/* Card Image */}
              <div className="relative h-44 overflow-hidden bg-neutral-100 dark:bg-neutral-800">
                <img 
                  src={service.image} 
                  alt={service.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute top-3 right-3 bg-neutral-950/85 backdrop-blur-xs text-white text-[11px] font-mono px-2.5 py-1 rounded-lg">
                  {service.rateUnit}
                </div>
              </div>

              {/* Card Content */}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <div className="text-[10px] font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider">
                    {service.tagline}
                  </div>
                  <h3 className="text-base font-bold text-neutral-900 dark:text-white">
                    {service.title}
                  </h3>
                  <p className="text-xs text-neutral-600 dark:text-neutral-400 line-clamp-2 leading-relaxed">
                    {service.desc}
                  </p>

                  <div className="flex items-center gap-4 text-xs text-neutral-500 pt-1 font-mono">
                    <span className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-amber-500" />
                      ~{service.durationMinutes} mins
                    </span>
                    <span>·</span>
                    <span className="flex items-center gap-1.5">
                      <Users className="w-3.5 h-3.5 text-amber-500" />
                      {service.recommendedTeamSize} staff
                    </span>
                  </div>

                  {/* Feature checklist */}
                  <ul className="pt-2 space-y-1.5 border-t border-neutral-100 dark:border-neutral-800/80">
                    {service.features.slice(0, 3).map((feat, i) => (
                      <li key={i} className="text-[11px] text-neutral-600 dark:text-neutral-400 flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0" />
                        <span className="truncate">{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Card CTA */}
                <button
                  type="button"
                  onClick={() => onSelectService(service.id)}
                  className="w-full py-2.5 px-4 rounded-xl text-xs font-bold bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-white hover:bg-amber-400 hover:text-neutral-950 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <span>Book {service.title}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
