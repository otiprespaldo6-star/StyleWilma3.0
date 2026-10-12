import React from 'react';
import { 
  Sparkles, 
  Heart, 
  Shield, 
  Smartphone, 
  MessageCircle, 
  MapPin, 
  ShieldCheck, 
  BookOpen, 
  Instagram, 
  Facebook, 
  Linkedin, 
  Youtube, 
  Twitter, 
  Share2, 
  Phone, 
  Mail, 
  Dna
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { BrandLogo } from './BrandLogo';

export const Footer: React.FC = () => {
  const { setCurrentView, setIsSupportModalOpen, socialConfig, appearanceConfig } = useAuth();

  return (
    <footer className="bg-stone-900 text-stone-300 pt-14 pb-12 border-t border-stone-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Highlight Banner: Asesoría y Soporte Wilma Hernández */}
        <div className="bg-gradient-to-r from-emerald-950/80 via-stone-900 to-stone-950 rounded-3xl p-5 sm:p-7 border border-emerald-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5 shadow-xl">
          <div className="flex items-start sm:items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-600/30 text-emerald-400 border border-emerald-500/40 flex items-center justify-center shrink-0">
              <MessageCircle className="w-6 h-6 fill-emerald-500/20" />
            </div>
            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                  Asesoría de Imagen Titular
                </span>
                <span className="text-xs text-stone-400 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-rose-400" />
                  {socialConfig.ciudad || 'Concepción'}, {socialConfig.region || 'Región del Biobío'}, {socialConfig.pais || 'Chile'}
                </span>
              </div>
              <h3 className="text-base sm:text-lg font-serif font-bold text-white">
                Asesoría y Soporte Directo: Wilma Hernández
              </h3>
              <p className="text-xs text-stone-400 leading-relaxed max-w-xl">
                ¿Dudas con tu paleta, maquillaje o combinaciones de prendas? Contacta directamente por WhatsApp para asistencia personalizada en Concepción y el Biobío.
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsSupportModalOpen(true)}
            className="px-5 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg shadow-emerald-600/30 transition-all flex items-center gap-2 cursor-pointer shrink-0 self-stretch sm:self-auto justify-center"
          >
            <MessageCircle className="w-4 h-4 fill-white" />
            <span>Consultar por WhatsApp</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-stone-800">
          
          {/* Brand & Social Column */}
          <div className="space-y-4 md:col-span-1">
            <BrandLogo size="md" theme="dark" showSubtitle={true} />
            <p className="text-xs text-stone-400 leading-relaxed">
              {appearanceConfig.description || 'Descubre los colores que potencian tu belleza natural con Styled By Wilma. Colorimetría de las 12 estaciones y estilismo personalizado en Concepción, Chile.'}
            </p>
            
            {/* Dynamic Social Links (Blank = hidden) */}
            <div className="flex flex-wrap items-center gap-2 pt-1">
              {socialConfig.instagram && (
                <a
                  href={socialConfig.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-full bg-stone-800 hover:bg-rose-600 hover:text-white flex items-center justify-center text-stone-400 transition-colors"
                  title="Instagram"
                >
                  <Instagram className="w-4 h-4" />
                </a>
              )}
              {socialConfig.facebook && (
                <a
                  href={socialConfig.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-full bg-stone-800 hover:bg-blue-600 hover:text-white flex items-center justify-center text-stone-400 transition-colors"
                  title="Facebook"
                >
                  <Facebook className="w-4 h-4" />
                </a>
              )}
              {socialConfig.tiktok && (
                <a
                  href={socialConfig.tiktok}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-full bg-stone-800 hover:bg-pink-600 hover:text-white flex items-center justify-center text-stone-400 transition-colors text-xs font-bold"
                  title="TikTok"
                >
                  TK
                </a>
              )}
              {socialConfig.twitter && (
                <a
                  href={socialConfig.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-full bg-stone-800 hover:bg-sky-500 hover:text-white flex items-center justify-center text-stone-400 transition-colors"
                  title="Twitter / X"
                >
                  <Twitter className="w-4 h-4" />
                </a>
              )}
              {socialConfig.linkedin && (
                <a
                  href={socialConfig.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-full bg-stone-800 hover:bg-blue-700 hover:text-white flex items-center justify-center text-stone-400 transition-colors"
                  title="LinkedIn"
                >
                  <Linkedin className="w-4 h-4" />
                </a>
              )}
              {socialConfig.youtube && (
                <a
                  href={socialConfig.youtube}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-full bg-stone-800 hover:bg-red-600 hover:text-white flex items-center justify-center text-stone-400 transition-colors"
                  title="YouTube"
                >
                  <Youtube className="w-4 h-4" />
                </a>
              )}
              {socialConfig.pinterest && (
                <a
                  href={socialConfig.pinterest}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-full bg-stone-800 hover:bg-rose-700 hover:text-white flex items-center justify-center text-stone-400 transition-colors text-xs font-bold"
                  title="Pinterest"
                >
                  P
                </a>
              )}
              {socialConfig.threads && (
                <a
                  href={socialConfig.threads}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-full bg-stone-800 hover:bg-stone-700 hover:text-white flex items-center justify-center text-stone-400 transition-colors text-xs font-bold"
                  title="Threads"
                >
                  @
                </a>
              )}
            </div>

            <div className="flex items-center gap-2 text-xs text-rose-300 pt-1">
              <Smartphone className="w-3.5 h-3.5" />
              <span>PWA instalable offline en iOS, Android y PC</span>
            </div>
          </div>

          {/* Colorimetry seasons */}
          <div>
            <h4 className="font-serif text-sm font-semibold text-white uppercase tracking-wider mb-4">
              Colorimetría 12 Estaciones
            </h4>
            <ul className="space-y-2 text-xs text-stone-400">
              <li>
                <button onClick={() => setCurrentView('seasons-guide')} className="hover:text-rose-400 transition-colors cursor-pointer">
                  Primavera (Clara • Cálida • Brillante)
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentView('seasons-guide')} className="hover:text-rose-400 transition-colors cursor-pointer">
                  Verano (Claro • Frío • Suave)
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentView('seasons-guide')} className="hover:text-rose-400 transition-colors cursor-pointer">
                  Otoño (Suave • Cálido • Oscuro)
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentView('seasons-guide')} className="hover:text-rose-400 transition-colors cursor-pointer">
                  Invierno (Brillante • Frío • Oscuro)
                </button>
              </li>
              <li className="pt-2">
                <button 
                  onClick={() => setCurrentView('dna-survey')} 
                  className="text-amber-400 hover:text-amber-300 font-semibold flex items-center gap-1.5 cursor-pointer"
                >
                  <Dna className="w-3.5 h-3.5" />
                  <span>Tu Style DNA (7 Dimensiones)</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Tools & Guides */}
          <div>
            <h4 className="font-serif text-sm font-semibold text-white uppercase tracking-wider mb-4">
              Herramientas & Manual
            </h4>
            <ul className="space-y-2 text-xs text-stone-400">
              <li>
                <button onClick={() => setCurrentView('analyzer-photo')} className="hover:text-rose-400 transition-colors cursor-pointer">
                  Escaneo Facial con IA (Gemini)
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentView('analyzer-quiz')} className="hover:text-rose-400 transition-colors cursor-pointer">
                  Test de Colorimetría Guiado
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentView('virtual-drape')} className="hover:text-rose-400 transition-colors cursor-pointer">
                  Draping Virtual Interactivo
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentView('manual')} className="text-rose-300 hover:text-rose-200 font-semibold flex items-center gap-1.5 cursor-pointer">
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>Manual Oficial (11 Capítulos)</span>
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentView('admin')} className="text-stone-500 hover:text-stone-300 transition-colors cursor-pointer text-[11px]">
                  Consola Superadmin
                </button>
              </li>
            </ul>
          </div>

          {/* Contact in Biobío, Chile */}
          <div>
            <h4 className="font-serif text-sm font-semibold text-white uppercase tracking-wider mb-4">
              Atelier Concepción
            </h4>
            <div className="space-y-2.5 text-xs text-stone-400">
              <div className="flex items-start gap-2">
                <MapPin className="w-3.5 h-3.5 text-rose-400 shrink-0 mt-0.5" />
                <p>{socialConfig.direccion || 'Concepción, Región del Biobío, Chile'}</p>
              </div>
              {socialConfig.telefono && (
                <div className="flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>{socialConfig.telefono}</span>
                </div>
              )}
              {socialConfig.emailSoporte && (
                <div className="flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  <span>{socialConfig.emailSoporte}</span>
                </div>
              )}
              <div className="pt-2 flex items-start gap-2 text-stone-400">
                <Shield className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <p>Tus fotografías son analizadas con total confidencialidad biométrica.</p>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-stone-500 gap-4">
          <p>{appearanceConfig.copyright || '© 2026 Styled By Wilma. Todos los derechos reservados. Concepción, Chile.'}</p>
          <p className="flex items-center gap-1.5">
            <span>Hecho con</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
            <span>para mujeres de todas las edades en Chile y el mundo</span>
          </p>
        </div>
      </div>
    </footer>
  );
};
