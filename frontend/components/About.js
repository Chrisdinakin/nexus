import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';

export default function About() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="about" className="py-20 bg-gray-900/50">
      <div className="container mx-auto px-6">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-12">
            <span className="bg-gradient-to-r from-primary-400 to-primary-600 bg-clip-text text-transparent">
              About Me
            </span>
          </h2>

          <div className="max-w-4xl mx-auto">
            <motion.div
              className="glass-dark rounded-2xl p-8 md:p-12"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              <p className="text-lg text-gray-300 leading-relaxed mb-6">
                I'm a passionate Full-Stack Developer with expertise in building modern, 
                scalable web applications. With a focus on creating premium digital experiences, 
                I combine cutting-edge technology with elegant design to deliver solutions that 
                exceed expectations.
              </p>
              
              <p className="text-lg text-gray-300 leading-relaxed mb-6">
                My journey in software development has equipped me with a diverse skill set 
                spanning frontend frameworks like React and Next.js, backend technologies 
                including Node.js and Python, and database systems like PostgreSQL and MongoDB.
              </p>

              <p className="text-lg text-gray-300 leading-relaxed">
                I believe in writing clean, maintainable code and following industry best 
                practices for security, performance, and user experience. Let's build something 
                amazing together.
              </p>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-12">
                {[
                  { label: 'Projects', value: '50+' },
                  { label: 'Experience', value: '5+ Years' },
                  { label: 'Technologies', value: '20+' },
                  { label: 'Clients', value: '30+' },
                ].map((stat, index) => (
                  <motion.div
                    key={stat.label}
                    className="text-center"
                    initial={{ opacity: 0, y: 20 }}
                    animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                    transition={{ delay: 0.4 + index * 0.1 }}
                  >
                    <div className="text-3xl font-bold text-primary-400">{stat.value}</div>
                    <div className="text-gray-400 mt-2">{stat.label}</div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
