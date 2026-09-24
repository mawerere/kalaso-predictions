"use client";

import React from "react";
import { MessageCircle } from "lucide-react";

export default function WhatsAppFloatingButton() {
  const whatsappUrl = "https://wa.me/256745090955?text=Hello%20Kalaso%20Predictions,%20I%20am%20interested%20in%20today's%20football%20tips%20and%20packages!";

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-20 sm:bottom-6 right-4 sm:right-6 z-40 bg-emerald-500 hover:bg-emerald-600 text-white p-3.5 sm:px-4 sm:py-3 rounded-full shadow-lg hover:shadow-emerald-500/30 transition-all transform hover:-translate-y-1 flex items-center gap-2 group cursor-pointer"
      title="Chat with Teddy on WhatsApp"
    >
      <div className="relative">
        <MessageCircle className="w-6 h-6 animate-pulse" />
        <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-white"></span>
      </div>
      <span className="hidden sm:inline font-semibold text-sm">
        WhatsApp: 0745090955
      </span>
    </a>
  );
}
