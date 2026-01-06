
import React from 'react';
import { FooterConfig } from '../types';
import { Facebook, Instagram, Youtube, MessageCircle, Phone, Mail, MapPin } from 'lucide-react';

interface FooterProps {
  config: FooterConfig;
  onNavigate: (page: string) => void;
  logo?: string;
}

const Footer: React.FC<FooterProps> = ({ config, onNavigate, logo }) => {
  const getIcon = (platform: string) => {
    switch (platform) {
      case 'Facebook': return <Facebook className="w-5 h-5" />;
      case 'Instagram': return <Instagram className="w-5 h-5" />;
      case 'YouTube': return <Youtube className="w-5 h-5" />;
      case 'WhatsApp': return <MessageCircle className="w-5 h-5" />;
      default: return <Facebook className="w-5 h-5" />;
    }
  };

  return (
    <footer className="bg-slate-900 text-white pt-20 pb-10 mt-20">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Brand Info */}
          <div className="space-y-6">
            <div onClick={() => onNavigate('landing')} className="cursor-pointer">
              {logo ? <img src={logo} className="h-10 w-auto" /> : (
                <h2 className="text-xl font-black tracking-tighter flex items-center gap-2">
                  <span className="bg-rose-600 text-white px-2 py-0.5 rounded italic">U</span>UPOHAR<span className="text-rose-600">LUXE</span>
                </h2>
              )}
            </div>
            <p className="text-slate-400 text-sm leading-relaxed font-light">{config.aboutText}</p>
            <div className="flex gap-3">
              {config.socials.map((social, i) => (
                <a key={i} href={social.url} target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-white/5 hover:bg-rose-600 rounded-xl flex items-center justify-center transition-all">
                  {getIcon(social.platform)}
                </a>
              ))}
            </div>
          </div>

          {/* Dynamic Columns */}
          {config.columns.map((col, i) => (
            <div key={i}>
              <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 mb-8">{col.title}</h3>
              <ul className="space-y-4">
                {col.links.map((link, j) => (
                  <li key={j}>
                    <button 
                      onClick={() => onNavigate(link.href)} 
                      className="text-slate-400 hover:text-white text-sm transition-colors font-medium flex items-center group"
                    >
                      <span className="w-0 group-hover:w-2 h-[1px] bg-rose-600 mr-0 group-hover:mr-2 transition-all"></span>
                      {link.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Contact Info */}
          <div>
            <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 mb-8">Direct Contact</h3>
            <ul className="space-y-5">
              <li className="flex gap-4">
                <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center shrink-0 text-rose-500"><MapPin className="w-5 h-5" /></div>
                <p className="text-slate-400 text-sm leading-snug">{config.address}</p>
              </li>
              <li className="flex gap-4">
                <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center shrink-0 text-rose-500"><Phone className="w-5 h-5" /></div>
                <p className="text-slate-400 text-sm font-bold">{config.phone}</p>
              </li>
              <li className="flex gap-4">
                <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center shrink-0 text-rose-500"><Mail className="w-5 h-5" /></div>
                <p className="text-slate-400 text-sm font-bold">{config.email}</p>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-10 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">{config.copyright}</p>
          <div className="flex gap-6 grayscale opacity-40 hover:grayscale-0 hover:opacity-100 transition-all">
             <img src="https://images.squarespace-cdn.com/content/v1/592f6277d1758e576082987a/1512409748684-T2Y5T1N1F3G3H9Z9V3Z7/Visa+Mastercard+Logo.png" className="h-6" />
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
