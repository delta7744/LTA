"use client";

import { Plane, Hotel, Map, CreditCard, Users, Briefcase } from "lucide-react";

const services = [
    {
        icon: <Plane className="w-8 h-8" />,
        title: "Flight Booking",
        desc: "Global connectivity with premium airline partners at competitive rates."
    },
    {
        icon: <Hotel className="w-8 h-8" />,
        title: "Hotel Reservations",
        desc: "Handpicked luxury stays and comfortable accommodations worldwide."
    },
    {
        icon: <Map className="w-8 h-8" />,
        title: "Travel Packages",
        desc: "Curated cultural and adventure journeys."
    },
    {
        icon: <CreditCard className="w-8 h-8" />,
        title: "Visa Assistance",
        desc: "Expert guidance for smooth and hassle-free visa applications."
    },
    {
        icon: <Briefcase className="w-8 h-8" />,
        title: "Corporate Travel",
        desc: "Seamless business travel management for professionals."
    },
    {
        icon: <Users className="w-8 h-8" />,
        title: "Group Tours",
        desc: "Safe and engaging expeditions for families and organizations."
    }
];

export default function ServicesSection() {
    return (
        <section id="services" className="py-24 bg-gray-50 relative">
            <div className="container px-4">
                <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
                    <h4 className="text-lta-orange font-bold uppercase tracking-widest text-sm">Our Services</h4>
                    <h2 className="text-4xl md:text-5xl font-black text-lta-purple">
                        Premium Support for Every Mile
                    </h2>
                    <div className="w-20 h-1.5 bg-lta-orange mx-auto rounded-full"></div>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {services.map((service, idx) => (
                        <div
                            key={idx}
                            className="bg-white p-10 rounded-3xl shadow-sm border border-transparent hover:border-lta-purple/10 hover:shadow-xl transition-all duration-300 group relative overflow-hidden"
                        >
                            <div className="absolute top-0 right-0 w-24 h-24 bg-lta-purple/5 rounded-bl-[100px] transition-all duration-300 group-hover:scale-150 group-hover:bg-lta-purple/10"></div>

                            <div className="w-16 h-16 bg-lta-purple/5 text-lta-purple rounded-2xl flex items-center justify-center mb-6 group-hover:bg-lta-purple group-hover:text-white transition-all duration-300">
                                {service.icon}
                            </div>

                            <h3 className="text-2xl font-bold text-gray-900 mb-4">{service.title}</h3>
                            <p className="text-gray-500 leading-relaxed mb-6">
                                {service.desc}
                            </p>

                            <div className="flex items-center text-lta-purple font-bold text-sm uppercase tracking-wider group/link cursor-pointer">
                                Learn More
                                <span className="ml-2 transform transition-transform group-hover/link:translate-x-1">→</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
