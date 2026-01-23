import { motion, useInView } from 'framer-motion';
import { useRef, useState, useEffect } from 'react';
import { qualificationsAPI } from '../lib/api';

export default function Qualifications() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [qualifications, setQualifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchQualifications();
  }, []);

  const fetchQualifications = async () => {
    try {
      const data = await qualificationsAPI.getAll();
      setQualifications(data);
    } catch (error) {
      console.error('Error fetching qualifications:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="qualifications" className="py-20 bg-gray-900/50">
      <div className="container mx-auto px-6">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-12">
            <span className="bg-gradient-to-r from-primary-400 to-primary-600 bg-clip-text text-transparent">
              Qualifications
            </span>
          </h2>

          {loading ? (
            <div className="text-center text-gray-400">Loading qualifications...</div>
          ) : (
            <div className="max-w-4xl mx-auto space-y-6">
              {qualifications.map((qual, index) => (
                <motion.div
                  key={qual.id}
                  className="glass-dark rounded-xl p-6"
                  initial={{ opacity: 0, x: -50 }}
                  animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -50 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-4">
                    <div>
                      <h3 className="text-2xl font-bold text-primary-400 mb-2">{qual.title}</h3>
                      <p className="text-gray-300">{qual.description}</p>
                    </div>
                    <div className="text-gray-400 mt-2 md:mt-0 md:ml-4 flex-shrink-0">
                      {new Date(qual.date).toLocaleDateString('en-US', { 
                        year: 'numeric', 
                        month: 'long' 
                      })}
                    </div>
                  </div>

                  {qual.skills && qual.skills.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {qual.skills.map((skill, idx) => (
                        <span
                          key={idx}
                          className="px-3 py-1 bg-primary-500/20 text-primary-300 rounded-full text-sm"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </section>
  );
}
