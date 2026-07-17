'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Briefcase } from 'lucide-react';

export default function PageLoader() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const hideLoader = () => {
      requestAnimationFrame(() => {
        setLoading(false);
      });
    };

    if (document.readyState === 'complete') {
      hideLoader();
    } else {
      window.addEventListener('load', hideLoader);

      const fallback = setTimeout(hideLoader, 700);

      return () => {
        window.removeEventListener('load', hideLoader);
        clearTimeout(fallback);
      };
    }
  }, []);


  return (
    <AnimatePresence>
      {loading && (
        <motion.div
          initial={{opacity:1}}
          exit={{
            opacity:0,
            transition:{
              duration:.25
            }
          }}
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-[#0a1628]"
        >

          <div className="flex flex-col items-center gap-4">


            <motion.div
              initial={{scale:.8,opacity:0}}
              animate={{
                scale:1,
                opacity:1
              }}
              transition={{
                duration:.35
              }}
              className="relative"
            >

              <div className="
                w-20 h-20 
                rounded-2xl
                bg-gradient-to-br
                from-royal-600
                to-cyan-500
                flex
                items-center
                justify-center
                shadow-glow
              ">
                <Briefcase 
                  className="w-10 h-10 text-white"
                />
              </div>


              <span
                className="
                  absolute
                  inset-0
                  rounded-2xl
                  border
                  border-cyan-400/40
                  animate-ping
                "
              />

            </motion.div>



            <div className="text-center">

              <h1 className="
                text-3xl
                font-display
                font-bold
                text-white
                tracking-wide
              ">
                RECLUTA
              </h1>


              <p className="
                text-xs
                text-cyan-400
                font-mono
                tracking-[0.3em]
                mt-1
              ">
                TALENT MANAGEMENT
              </p>

            </div>



            <div className="
              w-40
              h-1
              bg-white/10
              rounded-full
              overflow-hidden
              mt-4
            ">
              <motion.div
                initial={{
                  width:'0%'
                }}
                animate={{
                  width:'100%'
                }}
                transition={{
                  duration:.6
                }}
                className="
                  h-full
                  bg-gradient-to-r
                  from-royal-500
                  to-cyan-400
                "
              />
            </div>


          </div>

        </motion.div>
      )}
    </AnimatePresence>
  );
}