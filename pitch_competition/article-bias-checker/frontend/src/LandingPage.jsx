import React from "react";
import { motion } from "framer-motion";

export default function LandingPage({ onStart }) {
  return (
    <div className="relative min-h-screen bg-gradient-to-br from-indigo-800 via-purple-800 to-blue-900 text-white overflow-hidden flex flex-col">
      {/* Background Glow Blobs */}
      <div className="absolute top-0 left-0 w-72 h-72 bg-purple-500 opacity-30 blur-3xl rounded-full -z-10"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-500 opacity-20 blur-3xl rounded-full -z-10"></div>

      {/* Navbar */}
      <header className="w-full flex justify-between items-center px-8 py-5 backdrop-blur-md bg-white/5 border-b border-white/10">
        <h1 className="text-2xl font-bold tracking-wide">📰 Sherlock</h1>
        <nav className="hidden sm:flex space-x-8 text-gray-200 text-sm">
          <a href="#" className="hover:text-white transition">
            Home
          </a>
          <a href="#" className="hover:text-white transition">
            About
          </a>
          <a href="#" className="hover:text-white transition">
            Sources
          </a>
          <a href="#" className="hover:text-white transition">
            Contact
          </a>
        </nav>
      </header>

      {/* Hero Section */}
      <main className="flex flex-col justify-center items-center flex-1 text-center px-6">
        <motion.h1
          className="text-5xl sm:text-6xl md:text-7xl font-extrabold tracking-tight bg-gradient-to-r from-pink-400 via-purple-300 to-indigo-400 bg-clip-text text-transparent"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
         Sherlock Detect News Bias <br /> in Seconds
        </motion.h1>

        <motion.p
          className="mt-6 text-lg sm:text-xl text-gray-200 max-w-2xl mx-auto leading-relaxed"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 1 }}
        >
          We analyze articles across multiple trusted fact-checking sources and
          give you a <span className="bold"> reliability grade + bias score</span> — all in one place.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          className="mt-10 flex flex-col sm:flex-row gap-4 justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
        >
          <button
            onClick={onStart}
            className="px-8 py-4 bg-white text-indigo-700 font-semibold rounded-xl shadow-lg hover:scale-105 transition-transform"
          >
             Analyze Now
          </button>
          <button className="px-8 py-4 bg-indigo-600/40 border border-indigo-300/30 font-semibold rounded-xl shadow-lg hover:scale-105 transition-transform">
            Learn More
          </button>
        </motion.div>

        {/* Floating Demo Card */}
        <motion.div
          className="mt-16 p-6 rounded-2xl bg-white/10 backdrop-blur-md shadow-lg border border-white/20 max-w-sm"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 0.8 }}
        >
          <h3 className="text-lg font-semibold">🔍 Example Analysis</h3>
          <p className="text-sm text-gray-200 mt-2">
            “Breaking news: Global event shakes the world…”
          </p>
          <div className="flex justify-between items-center mt-4">
            <span className="text-green-400 font-bold">Grade: B+</span>
            <span className="text-yellow-300 font-semibold">Bias: Center</span>
          </div>
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="w-full py-4 text-center text-gray-400 text-sm border-t border-white/10 backdrop-blur-md bg-white/5">
        Built with ❤️ for truth in journalism • © 2025 BiasCheck
      </footer>
    </div>
  );
}
