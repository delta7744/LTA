"use client"

import { Mail, Phone, Facebook, Instagram, Twitter, Music2 } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function TopNavbar() {
  return (
    <div className="bg-lta-purple text-white py-2">
      <div className="container flex flex-col sm:flex-row justify-between items-center">
        <div className="flex flex-col sm:flex-row items-center gap-4 mb-2 sm:mb-0">
          <div className="flex items-center">
            <Mail className="h-4 w-4 mr-2" />
            <span className="text-sm">lta.leadertravelagency@gmail.com
            </span>
          </div>
          <div className="flex items-center">
            <Phone className="h-4 w-4 mr-2" />
            <span className="text-sm">54 222 153 | 54 222 175 | 56 521 032</span>
          </div>
        </div>
        <div className="flex space-x-2">
          <Button variant="ghost" size="icon" className="h-8 w-8 text-white hover:bg-lta-purple-light/20 transition-colors">
            <a href="https://www.facebook.com/profile.php?id=61584091807963" target="_blank" rel="noopener noreferrer"> <Facebook className="h-4 w-4" /></a>
            <span className="sr-only">Facebook</span>
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8 text-white hover:bg-lta-purple-light/20 transition-colors">
            <a href="https://www.instagram.com/lta_leadertravel.agency?igsh=MXhpY2RkcGI4c3h1Yw==" target="_blank" rel="noopener noreferrer"> <Instagram className="h-4 w-4" /></a>
            <span className="sr-only">Instagram</span>
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8 text-white hover:bg-lta-purple-light/20 transition-colors">
            <a href="https://www.tiktok.com/@lta.leader.travel?_r=1&_t=ZS-9435Rtv27s1" target="_blank" rel="noopener noreferrer"> <Music2 className="h-4 w-4" /></a>
            <span className="sr-only">TikTok</span>
          </Button>

        </div>
      </div>
    </div>
  )
}
