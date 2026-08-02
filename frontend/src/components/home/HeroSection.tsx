'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, CheckCircle2 } from 'lucide-react';

const floatingBadges = [
  { icon: '🚀', text: '5000+ Placements', position: '-top-6 -left-8' },
  { icon: '⭐', text: '98% Success Rate', position: '-bottom-6 right-0' },
  { icon: '🏆', text: 'Pan India Network', position: 'top-1/2 -right-10' },
];

const trustItems = [
  'Pan India Presence',
  'ISO Certified Process',
  'Dedicated Account Manager',
];

export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden hero-bg pt-20">

      {/* Lightweight background */}
      <div className="absolute inset-0 overflow-hidden">

        <div className="absolute top-1/4 left-1/4 w-80 h-80 bg-royal-600/20 rounded-full blur-3xl" />

        <div className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-cyan-500/10 rounded-full blur-3xl" />


        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage:
              'linear-gradient(rgba(255,255,255,.1) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.1) 1px,transparent 1px)',
            backgroundSize:'60px 60px'
          }}
        />


        {[1,2,3,4,5].map((i)=>(
          <span
            key={i}
            className="absolute w-1.5 h-1.5 rounded-full bg-cyan-400/40 animate-float"
            style={{
              left:`${i*18}%`,
              top:`${20+i*10}%`
            }}
          />
        ))}

      </div>



      <div className="relative z-10 container-custom w-full py-20">

        <div className="grid lg:grid-cols-2 gap-12 items-center">


          {/* CONTENT */}

          <div>


            <motion.div
              initial={{opacity:0,y:15}}
              animate={{opacity:1,y:0}}
              transition={{duration:.4}}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-8 text-sm"
            >
              <span className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse"/>
              <span className="text-cyan-300 font-medium">
                Now Hiring Across India
              </span>
              <span className="text-gray-400">
                · 500+ Open Positions
              </span>
            </motion.div>



            <motion.h1
              initial={{opacity:0,y:20}}
              animate={{opacity:1,y:0}}
              transition={{duration:.5}}
              className="font-display text-5xl sm:text-6xl lg:text-7xl font-bold text-white leading-tight mb-6"
            >

              Connecting{" "}

              <span className="gradient-text-light">
                Top Talent
              </span>

              {" "}with{" "}

              <span className="gradient-text-light">
                Top Companies
              </span>

            </motion.h1>



            <motion.p
              initial={{opacity:0}}
              animate={{opacity:1}}
              transition={{delay:.2}}
              className="text-lg text-gray-300 leading-relaxed mb-8 max-w-xl"
            >

              Recluta Talent Management — India's trusted HR consultancy
              providing recruitment, staffing and HR solutions across
              IT, BFSI, Manufacturing and 20+ industries.

            </motion.p>




            <div className="flex flex-wrap gap-4 mb-12">

              <Link
                href="/jobs"
                className="btn-primary text-base px-8 py-4 flex items-center gap-2"
              >
                Explore Jobs
                <ArrowRight className="w-4 h-4"/>
              </Link>


              <Link
                href="/contact"
                className="btn-outline-white text-base px-8 py-4"
              >
                Hire Talent
              </Link>

            </div>




            <div className="flex flex-wrap gap-4">

              {trustItems.map(item=>(
                <div
                  key={item}
                  className="flex items-center gap-2 text-sm text-gray-400"
                >
                  <CheckCircle2 className="w-4 h-4 text-cyan-400"/>
                  {item}
                </div>
              ))}

            </div>


          </div>






          {/* CARD */}

          <div className="hidden lg:flex justify-center">

            <div className="relative max-w-md w-full">


              <motion.div
                initial={{opacity:0,x:30}}
                animate={{opacity:1,x:0}}
                transition={{duration:.5}}
                className="glass-dark rounded-2xl p-6 border border-white/10"
              >

                <div className="flex justify-between mb-4">

                  <span className="text-sm text-cyan-400">
                    Latest Opportunity
                  </span>

                  <span className="text-xs text-green-400">
                    ● Live
                  </span>

                </div>


                <h3 className="text-xl font-semibold text-white mb-3">
                  Senior Software Engineer
                </h3>


                <div className="flex gap-2 flex-wrap mb-4">

                  <span className="badge bg-royal-900/50 text-royal-300">
                    Full Time
                  </span>

                  <span className="badge bg-cyan-900/50 text-cyan-300">
                    Hybrid
                  </span>

                  <span className="badge bg-navy-800/50 text-gray-300">
                    Bangalore
                  </span>

                </div>


                <div className="flex justify-between text-sm">

                  <span className="text-gray-400">
                    ₹12L - ₹20L per annum
                  </span>


                  <Link
                    href="/jobs"
                    className="text-cyan-400 flex items-center gap-1"
                  >
                    Apply
                    <ArrowRight className="w-3 h-3"/>
                  </Link>

                </div>

              </motion.div>




              {floatingBadges.map((item)=>(
                <div
                  key={item.text}
                  className={`absolute ${item.position} glass-dark rounded-xl px-4 py-2 border border-white/10 text-sm text-white animate-float`}
                >
                  {item.icon} {item.text}
                </div>
              ))}


            </div>

          </div>


        </div>

      </div>

    </section>
  );
}