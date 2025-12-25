import React from 'react';
import { Github, Twitter, Linkedin, Heart } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="w-full bg-white/70 dark:bg-[#10131A]/80 backdrop-blur-2xl border-t border-gray-100 dark:border-[#2F2F3A] py-8 mt-auto z-50">
      <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-6">

        {/* 🚀 Brand & Copyright */}
        <div className="flex flex-col items-center sm:items-start transition-all">
          <h2 className="text-xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#0F82FF] to-[#B44CFF]">
            devChat
          </h2>
          <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mt-1">
            Build something incredible © {new Date().getFullYear()}
          </p>
        </div>

        {/* ❤️ Built with Love */}
        <div className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">
          Handcrafted with <Heart className="w-3 h-3 text-red-500 fill-red-500 animate-pulse" /> for Developers
        </div>

        {/* 🌐 Social Links */}
        <div className="flex items-center gap-4">
          {[
            { icon: Github, href: "#", color: "hover:text-gray-900 dark:hover:text-white" },
            { icon: Twitter, href: "#", color: "hover:text-[#1DA1F2]" },
            { icon: Linkedin, href: "#", color: "hover:text-[#0A66C2]" },
          ].map((social, idx) => (
            <a
              key={idx}
              href={social.href}
              className={`p-2.5 rounded-xl bg-gray-50 dark:bg-[#1A1B1F] border border-gray-100 dark:border-[#2F2F3A] text-gray-400 transition-all duration-300 hover:scale-110 ${social.color}`}
            >
              <social.icon className="w-4 h-4" />
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
};

export default Footer;
