"use client";

import Image from "next/image";
import { ShieldCheck, Award, Users } from "lucide-react";

export default function AboutLta() {
    return (
        <section className="py-20 bg-white overflow-hidden relative">
            <div className="absolute top-10 right-0 w-96 h-96 bg-lta-purple/5 rounded-full blur-3xl -mr-48"></div>

            <div className="container px-4">
                <div className="grid lg:grid-cols-2 gap-12 items-center">
                    <div className="relative">
                        <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                            <Image
                                src="/photo-accuile.jpg"
                                alt="Leadership in Travel"
                                width={600}
                                height={800}
                                className="object-cover h-[500px] w-full"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-lta-purple/40 to-transparent"></div>
                        </div>
                        {/* Experience Badge */}
                        <div className="absolute -bottom-6 -right-6 bg-white p-6 rounded-2xl shadow-xl flex items-center gap-4 border-b-4 border-lta-orange">
                            <div className="text-4xl font-bold text-lta-purple">15+</div>
                            <div className="text-sm font-semibold text-gray-600 leading-tight">
                                Years of Excellence <br /> in Travel Services
                            </div>
                        </div>
                    </div>

                    <div className="space-y-8">
                        <div className="space-y-4">
                            <h4 className="text-lta-orange font-bold uppercase tracking-widest text-sm">Who We Are</h4>
                            <h2 className="text-4xl md:text-5xl font-black text-lta-purple leading-tight">
                                Why "Leader Travel Agency"?
                            </h2>
                            <p className="text-gray-600 text-lg leading-relaxed">
                                At LTA, we don't just book trips; we lead the way in creating personalized experiences that exceed expectations. Our name represents our commitment to being the forefront of the travel industry, guided by trust, experience, and expertize.
                            </p>
                        </div>

                        <div className="grid gap-6">
                            {[
                                {
                                    icon: <ShieldCheck className="w-6 h-6 text-white" />,
                                    title: "Trust & Reliability",
                                    desc: "Your journey is safe with our certified global network."
                                },
                                {
                                    icon: <Award className="w-6 h-6 text-white" />,
                                    title: "Premium Experience",
                                    desc: "Curated luxury and standard packages designed for comfort."
                                },
                                {
                                    icon: <Users className="w-6 h-6 text-white" />,
                                    title: "Expert Guidance",
                                    desc: "Our team of travel leaders ensures every detail is perfect."
                                }
                            ].map((item, idx) => (
                                <div key={idx} className="flex gap-4 group">
                                    <div className="flex-shrink-0 w-12 h-12 bg-lta-purple rounded-xl flex items-center justify-center transition-transform group-hover:rotate-6">
                                        {item.icon}
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-xl text-gray-900 mb-1">{item.title}</h3>
                                        <p className="text-gray-500">{item.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
