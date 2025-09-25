// @/app/about/page.tsx
'use client';

import React from 'react';
import Image from 'next/image';
import { FaLinkedin } from 'react-icons/fa';

type Contributor = {
    name: string;
    photo: string;
    role?: string;
    bio?: string;
    linkedin?: string;
};

const AboutPage = () => {
    const contributors: Contributor[] = React.useMemo(() => {
        try {
            return JSON.parse(process.env.NEXT_PUBLIC_CONTRIBUTORS || '[]');
        } catch (err) {
            console.error('Invalid CONTRIBUTORS env', err);
            return [];
        }
    }, []);

    return (
        <div className="bg-gray-50 min-h-screen">
            {/* Hero Section */}
            <section className="bg-white py-8 px-6 sm:px-12 md:px-20 flex flex-col items-center text-center">
                <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 mb-2">
                    About Our Team
                </h1>
                <div className="w-20 h-1 bg-indigo-600 rounded-full mb-4"></div>
                <p className="max-w-3xl text-gray-700 text-lg sm:text-xl leading-relaxed">
                    We are a passionate team of developers and designers working together to create
                    the Durga Puja Pandals Map — making cultural events more accessible and interactive.
                    Our contributors bring expertise in full-stack development, UI/UX design, and data visualization.
                </p>
            </section>


            {/* Contributors Grid */}
            <section className="py-16 px-6 sm:px-12 md:px-20">
                <div className="flex flex-wrap justify-center gap-8">
                    {contributors.map((c) => (
                        <div
                            key={c.name}
                            className="bg-white shadow-lg rounded-xl p-6 flex flex-col items-center text-center transform transition hover:scale-105 hover:shadow-2xl w-full sm:w-96"
                        >
                            <div className="relative w-32 h-32 mb-4">
                                <Image
                                    src={c.photo}
                                    alt={c.name}
                                    fill
                                    className="rounded-full object-cover"
                                />
                            </div>
                            <h2 className="text-xl font-semibold">{c.name}</h2>
                            {c.role && (
                                <p className="text-sm text-indigo-600 mt-1 font-medium">{c.role}</p>
                            )}
                            {c.bio && (
                                <p className="text-gray-600 text-sm mt-2">{c.bio}</p>
                            )}
                            {c.linkedin && (
                                <a
                                    href={c.linkedin}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="mt-3 flex items-center text-blue-600 hover:text-blue-800 font-medium"
                                >
                                    <FaLinkedin className="mr-2" /> LinkedIn
                                </a>
                            )}
                        </div>
                    ))}
                </div>
            </section>


            {/* Footer Section */}
            <section className="text-center py-12 bg-gray-100">
                <p className="text-gray-500 text-sm">
                    &copy; {new Date().getFullYear()} Durga Puja Pandals Map. All rights reserved.
                </p>
            </section>
        </div>
    );
};

export default AboutPage;
