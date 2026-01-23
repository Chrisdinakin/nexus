import { useEffect, useState } from 'react';
import Head from 'next/head';
import { motion } from 'framer-motion';
import Hero from '../components/Hero';
import About from '../components/About';
import Projects from '../components/Projects';
import Qualifications from '../components/Qualifications';
import Contact from '../components/Contact';
import Navigation from '../components/Navigation';

export default function Home() {
  return (
    <>
      <Head>
        <title>Premium Portfolio | Nexus</title>
        <meta name="description" content="A premium portfolio website showcasing projects and qualifications" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900">
        <Navigation />
        
        <main>
          <Hero />
          <About />
          <Projects />
          <Qualifications />
          <Contact />
        </main>

        <footer className="bg-gray-900 border-t border-gray-800 py-8">
          <div className="container mx-auto px-6 text-center text-gray-400">
            <p>&copy; {new Date().getFullYear()} Nexus Portfolio. All rights reserved.</p>
          </div>
        </footer>
      </div>
    </>
  );
}
