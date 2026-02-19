"use client";

import Image from "next/image";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useLanguage } from "@/components/language-provider";
export default function FaqSection() {
  const { t } = useLanguage();

  return (
    <section className="py-16 container">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        <div className="relative h-[300px] flex items-center justify-center">
          <Image
            src="/logo.png"
            alt={t.faqPage.imageAlt}
            fill
            className="object-contain"
          />
        </div>

        <div className="space-y-6">
          <div className="space-y-2">
            <h4 className="text-lta-orange font-bold uppercase tracking-widest text-sm">Need Help?</h4>
            <h2 className="text-4xl font-black text-lta-purple">{t.faqPage.title}</h2>
          </div>
          <Accordion type="single" collapsible className="w-full">
            {t.faqPage.faqs.map((faq: { question: string; answer: string }, index: number) => (
              <AccordionItem key={index} value={`item-${index}`} className="border-lta-purple/10">
                <AccordionTrigger className="text-left font-bold text-gray-800 hover:text-lta-purple hover:no-underline px-4">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-gray-600 px-4 pb-4 leading-relaxed">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
}
