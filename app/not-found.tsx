import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Home, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen w-full relative bg-gradient-to-br from-gray-900 to-gray-800 text-white overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,transparent)]" />
      </div>

      {/* Glowing Circle */}
      <div className="absolute top-1/2 left-1/2 w-[500px] h-[500px] bg-lta-purple/20 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2 z-0" />

      {/* Main Content */}
      <div className="relative z-10 h-screen flex flex-col items-center justify-center px-4 text-center">
        <h1 className="text-[8rem] sm:text-[12rem] font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-lta-purple to-lta-orange leading-none">
          404
        </h1>

        <div className="space-y-4 max-w-2xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">
            Oops! Page Not Found
          </h2>
          <p className="text-gray-300 text-lg">
            The page you are looking for might have been removed, renamed, or is
            temporarily unavailable.
          </p>
        </div>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
          <Button
            asChild
            size="lg"
            className="bg-lta-purple hover:bg-lta-purple/90 transition-all duration-300 text-white"
          >
            <Link href="/" className="flex items-center gap-2">
              <Home className="h-5 w-5" />
              Return Home
            </Link>
          </Button>
          <Button
            asChild
            size="lg"
            variant="outline"
            className="border-2 border-lta-orange text-lta-orange hover:bg-lta-orange/10 transition-all duration-300 bg-transparent"
          >
            <Link href="/contact" className="flex items-center gap-2">
              <ArrowLeft className="h-5 w-5" />
              Contact Support
            </Link>
          </Button>
        </div>
      </div>

      {/* Decorative Gradient Overlay */}
      <div className="absolute bottom-0 left-0 w-full h-1/3 bg-gradient-to-t from-black/30 to-transparent z-0" />
    </div>
  );
}
