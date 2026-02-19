"use client";

import type React from "react";

import Link from "next/link";
import Image from "next/image";
import {
  Facebook,
  Instagram,
  Twitter,
  Mail,
  Phone,
  MapPin,
  Send,
  Music2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useLanguage } from "@/components/language-provider";
import { useState } from "react";

export default function Footer() {
  const { t } = useLanguage();
  const [email, setEmail] = useState("");
  const isRTL = t.currentLanguage === "ar";

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle newsletter subscription
    console.log("Subscribing email:", email);
    setEmail("");
    // Here you would typically send this to your API
  };

  return (
    <footer className="bg-[#5B2D8C] text-white overflow-hidden relative">
      <div className="absolute top-0 right-0 w-64 h-64 bg-[#F58220] opacity-10 rounded-full -mr-32 -mt-32 blur-3xl"></div>
      <div className="container py-12 md:py-16 relative z-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Company Info */}
          <div className={`space-y-6 ${isRTL ? "text-right" : "text-left"}`}>
            <Link href="/" className="inline-block">
              <Image
                src="/logo.png"
                alt="LTA Logo"
                width={180}
                height={80}
                className="object-contain h-20 w-auto brightness-0 invert"
              />
            </Link>
            <p className="text-gray-200 text-sm leading-relaxed">
              {t.footer.tagline || "Leader Travel Agency: Your global partner for premium travel experiences, built on trust and expertise."}
            </p>
            <div
              className={`flex space-x-3 ${isRTL ? "justify-end space-x-reverse" : ""
                }`}
            >
              <h4 className="sr-only">{t.footer.followUs}</h4>
              <Button
                variant="outline"
                size="icon"
                className="rounded-full text-lta-purple hover:text-white hover:bg-lta-purple transition-colors border-lta-purple/30"
              >
                <a href="https://www.facebook.com/profile.php?id=61584091807963" target="_blank" rel="noopener noreferrer"> <Facebook className="h-4 w-4" /></a>
                <span className="sr-only">Facebook</span>
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="rounded-full text-lta-orange hover:text-white hover:bg-lta-orange transition-all duration-300 border-lta-orange/30 group"
              >
                <a href="https://www.instagram.com/lta_leadertravel.agency?igsh=MXhpY2RkcGI4c3h1Yw==" target="_blank" rel="noopener noreferrer"><Instagram className="h-4 w-4" /> </a>
                <span className="sr-only">Instagram</span>
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="rounded-full text-white hover:text-white hover:bg-black transition-all duration-300 border-white/30 group"
              >
                <a href="https://www.tiktok.com/@lta.leader.travel?_r=1&_t=ZS-9435Rtv27s1" target="_blank" rel="noopener noreferrer"><Music2 className="h-4 w-4" /> </a>
                <span className="sr-only">TikTok</span>
              </Button>

            </div>
          </div>

          {/* Quick Links */}
          <div className={`space-y-4 ${isRTL ? "text-right" : "text-left"}`}>
            <h3 className="text-lg font-semibold">{t.footer.quickLinks}</h3>
            <ul className="space-y-3">
              {[
                { href: "/tours/cultural", label: t.navbar.tours },
                { href: "/hotels", label: t.navbar.hotels },
                { href: "/flights", label: t.navbar.tickets },
                { href: "/contact", label: t.navbar.contact },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-white/70 shadow-sm transition-all duration-300 group-hover:text-white"
                  >
                    <span className="w-0 group-hover:w-2 h-0.5 bg-[#F58220] mr-0 group-hover:mr-2 transition-all"></span>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div className={`space-y-4 ${isRTL ? "text-right" : "text-left"}`}>
            <h3 className="text-lg font-semibold">{t.footer.contactUs}</h3>
            <ul className="space-y-3">
              <li
                className={`flex items-start ${isRTL ? "flex-row-reverse" : ""
                  }`}
              >
                <MapPin
                  className={`h-5 w-5 text-[#F58220] mt-0.5 ${isRTL ? "mr-0 ml-2" : "mr-2"
                    } flex-shrink-0`}
                />
                <span className="text-white/90">Tunis – Rue Abderrahmen Azzem, Monplaisir, Immobilier El Wifak, Bloc A, 5ème étage, Bureau 54</span>
              </li>
              <li
                className={`flex items-center ${isRTL ? "flex-row-reverse" : ""
                  }`}
              >
                <Phone
                  className={`h-5 w-5 text-[#F58220] ${isRTL ? "mr-0 ml-2" : "mr-2"
                    } flex-shrink-0`}
                />
                <span className="text-white/90">{t.footer.phone}</span>
              </li>
              <li
                className={`flex items-center ${isRTL ? "flex-row-reverse" : ""
                  }`}
              >
                <Mail
                  className={`h-5 w-5 text-[#F58220] ${isRTL ? "mr-0 ml-2" : "mr-2"
                    } flex-shrink-0`}
                />
                <span className="text-white/90">{t.footer.email}</span>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div className={`space-y-4 ${isRTL ? "text-right" : "text-left"}`}>
            <h3 className="text-lg font-semibold">{t.footer.newsletter}</h3>
            <p className="text-white/90">{t.footer.subscribeToNewsletter}</p>
            <form onSubmit={handleSubscribe} className="space-y-2">
              <div className="relative">
                <Input
                  type="email"
                  placeholder={t.footer.emailPlaceholder}
                  className={`border-gray-300 pr-10 ${isRTL ? "text-right" : "text-left"
                    }`}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <Button
                  type="submit"
                  size="icon"
                  className="absolute top-0 bottom-0 right-0 bg-lta-orange hover:bg-lta-orange/90 text-white rounded-l-none"
                >
                  <Send className="h-4 w-4" />
                  <span className="sr-only">{t.subscribe}</span>
                </Button>
              </div>
            </form>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-200 mt-8 pt-6 flex flex-col md:flex-row justify-between items-center">
          <p className="text-white/60 text-sm">
            &copy; {new Date().getFullYear()} LTA - Leader Travel Agency. {t.footer.allRightsReserved}
          </p>
          <div
            className={`flex space-x-4 mt-4 md:mt-0 ${isRTL ? "space-x-reverse" : ""
              }`}
          >
            <Link
              href="/terms"
              className="text-white/60 hover:text-lta-orange text-sm transition-colors"
            >
              {t.footer.termsConditions}
            </Link>
            <Link
              href="/privacy"
              className="text-white/60 hover:text-lta-orange text-sm transition-colors"
            >
              {t.footer.privacyPolicy}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
