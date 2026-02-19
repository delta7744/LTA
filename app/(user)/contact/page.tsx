"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { MapPin, Phone, Mail, Clock } from "lucide-react";
import { useLanguage } from "@/components/language-provider";

export default function ContactPage() {
  const { t } = useLanguage();
  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-grow">
        <div className="bg-lta-purple py-10 md:py-20 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-lta-orange opacity-10 rounded-full -mr-32 -mt-32 blur-3xl"></div>
          <div className="container px-4 md:px-6 relative z-10 text-white">
            <h1 className="text-3xl md:text-5xl font-black mb-4">{t.contactPage.title}</h1>
            <p className="text-white/80 max-w-2xl text-lg">{t.contactPage.description}</p>
          </div>
        </div>

        <div className="container py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-2">
              <h2 className="text-2xl font-semibold mb-6">
                {t.contactPage.formTitle}
              </h2>
              <form className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label htmlFor="name" className="text-sm font-medium">
                      {t.form.name.label}
                    </label>
                    <Input id="name" placeholder={t.form.name.placeholder} />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="email" className="text-sm font-medium">
                      {t.form.email.label}
                    </label>
                    <Input
                      id="email"
                      type="email"
                      placeholder={t.form.email.placeholder}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label htmlFor="phone" className="text-sm font-medium">
                      {t.form.phone.label}
                    </label>
                    <Input id="phone" placeholder={t.form.phone.placeholder} />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="subject" className="text-sm font-medium">
                      {t.form.subject.label}
                    </label>
                    <Input
                      id="subject"
                      placeholder={t.form.subject.placeholder}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label htmlFor="message" className="text-sm font-medium">
                    {t.form.message.label}
                  </label>
                  <Textarea
                    id="message"
                    placeholder={t.form.message.placeholder}
                    rows={6}
                  />
                </div>

                <Button
                  type="submit"
                  className="bg-lta-purple hover:bg-lta-purple-light transition-all duration-300 rounded-xl py-6 font-bold shadow-lg shadow-lta-purple/20"
                >
                  {t.form.submit}
                </Button>
              </form>
            </div>

            <div>
              <h2 className="text-2xl font-semibold mb-6">
                {t.contactPage.contactInfo}
              </h2>
              <div className="space-y-6">
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-start mb-4">
                      <MapPin className="h-5 w-5 text-lta-purple mt-0.5 mr-3" />
                      <div>
                        <h3 className="font-medium mb-1">{t.contactPage.ourAddress}</h3>
                        <p className="text-muted-foreground">
                          131, Rue de la Liberté, Immeuble Belvédère Médical, 4ᵉ étage, 1002 Tunis, Tunisie.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start mb-4">
                      <MapPin className="h-5 w-5 text-lta-purple mt-0.5 mr-3" />
                      <div>
                        <h3 className="font-medium mb-1">Djerba</h3>
                        <p className="text-muted-foreground">
                          Rue Habib Bourguiba, en face du stade municipal, Houmt Souk, Djerba.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start mb-4">
                      <MapPin className="h-5 w-5 text-lta-purple mt-0.5 mr-3" />
                      <div>
                        <h3 className="font-medium mb-1">Zarzis</h3>
                        <p className="text-muted-foreground">
                          Route du 20 Mars, Zarzis 4170, en face du Café Sidi Bou Saïd.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start mb-4">
                      <MapPin className="h-5 w-5 text-lta-purple mt-0.5 mr-3" />
                      <div>
                        <h3 className="font-medium mb-1">Sfax</h3>
                        <p className="text-muted-foreground">
                          Rue Majida Boulila, Immeuble Daoud, à côté de l’Institut Privé Al-Farabi, Sfax.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start">
                      <MapPin className="h-5 w-5 text-lta-purple mt-0.5 mr-3" />
                      <div>
                        <h3 className="font-medium mb-1">Autres Succursales</h3>
                        <p className="text-muted-foreground">
                          Ben Arous, Kairouan, Menzel Bourguiba, El Hamma, Zarate, Gabès.
                        </p>
                      </div>
                    </div>
                  </CardContent>

                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-start">
                      <Phone className="h-5 w-5 text-lta-purple mt-0.5 mr-3" />
                      <div>
                        <h3 className="font-medium mb-1">
                          {" "}
                          {t.contactPage.phoneNumbers}
                        </h3>
                        <p className="text-muted-foreground">
                          +216 71 123 456 (Main Office)
                        </p>
                        <p className="text-muted-foreground">
                          +216 71 789 012 (Customer Support)
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-start">
                      <Mail className="h-5 w-5 text-lta-purple mt-0.5 mr-3" />
                      <div>
                        <h3 className="font-medium mb-1">
                          {t.contactPage.emailAddresses}
                        </h3>
                        <div className="text-muted-foreground">
                          contact@lta.com.tn
                        </div>
                        <div className="text-muted-foreground">
                          support@lta.com.tn
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-start">
                      <Clock className="h-5 w-5 text-lta-purple mt-0.5 mr-3" />
                      <div>
                        <h3 className="font-medium mb-1">
                          {t.contactPage.workingHours}
                        </h3>
                        <p className="text-muted-foreground">
                          {t.contactPage.mondayToFriday}
                        </p>
                        <p className="text-muted-foreground">
                          {t.contactPage.saturday}
                        </p>
                        <p className="text-muted-foreground">
                          {" "}
                          {t.contactPage.sunday}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>

        <div className="h-[400px] w-full bg-gray-200 relative">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d102239.58355570477!2d10.0993025!3d36.7949518!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x12fd337f5e7ef543%3A0xd671924e714a0275!2sTunis%2C%20Tunisia!5e0!3m2!1sen!2sus!4v1651234567890!5m2!1sen!2sus"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          ></iframe>
        </div>
      </main>
    </div>
  );
}
