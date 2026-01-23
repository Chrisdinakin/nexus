import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { motion } from 'framer-motion';
import { authAPI, qualificationsAPI, projectsAPI } from '../../lib/api';
import AdminLayout from '../../components/admin/AdminLayout';
import QualificationForm from '../../components/admin/QualificationForm';
import ProjectForm from '../../components/admin/ProjectForm';

export default function AdminDashboard() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('qualifications');
  const [qualifications, setQualifications] = useState([]);
  const [projects, setProjects] = useState([]);
  const [editingItem, setEditingItem] = useState(null);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    checkAuth();
  }, []);

  useEffect(() => {
    if (user) {
      fetchData();
    }
  }, [user, activeTab]);

  const checkAuth = async () => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    if (!token || !userData) {
      router.push('/admin/login');
      return;
    }

    try {
      await authAPI.verifyToken();
      setUser(JSON.parse(userData));
    } catch (error) {
      router.push('/admin/login');
    } finally {
      setLoading(false);
    }
  };

  const fetchData = async () => {
    try {
      if (activeTab === 'qualifications') {
        const data = await qualificationsAPI.getAll();
        setQualifications(data);
      } else {
        const data = await projectsAPI.getAll();
        setProjects(data);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleLogout = async () => {
    try {
      await authAPI.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      router.push('/admin/login');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this item?')) return;

    try {
      if (activeTab === 'qualifications') {
        await qualificationsAPI.delete(id);
      } else {
        await projectsAPI.delete(id);
      }
      fetchData();
    } catch (error) {
      alert('Error deleting item: ' + (error.response?.data?.error || error.message));
    }
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setShowForm(true);
  };

  const handleFormClose = () => {
    setShowForm(false);
    setEditingItem(null);
    fetchData();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Admin Dashboard | Nexus</title>
      </Head>

      <AdminLayout user={user} onLogout={handleLogout}>
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold text-white">Dashboard</h1>
            <button
              onClick={() => {
                setEditingItem(null);
                setShowForm(true);
              }}
              className="px-6 py-2 bg-primary-500 hover:bg-primary-600 text-white rounded-lg transition-colors"
            >
              + Add New
            </button>
          </div>

          {/* Tabs */}
          <div className="flex space-x-4 border-b border-gray-700">
            <button
              onClick={() => setActiveTab('qualifications')}
              className={`px-6 py-3 font-medium transition-colors ${
                activeTab === 'qualifications'
                  ? 'text-primary-400 border-b-2 border-primary-400'
                  : 'text-gray-400 hover:text-gray-300'
              }`}
            >
              Qualifications
            </button>
            <button
              onClick={() => setActiveTab('projects')}
              className={`px-6 py-3 font-medium transition-colors ${
                activeTab === 'projects'
                  ? 'text-primary-400 border-b-2 border-primary-400'
                  : 'text-gray-400 hover:text-gray-300'
              }`}
            >
              Projects
            </button>
          </div>

          {/* Content */}
          <div className="grid gap-6">
            {activeTab === 'qualifications' ? (
              qualifications.length === 0 ? (
                <div className="text-center text-gray-400 py-12">
                  No qualifications found. Add your first one!
                </div>
              ) : (
                qualifications.map((qual) => (
                  <motion.div
                    key={qual.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="glass-dark rounded-lg p-6"
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-white mb-2">{qual.title}</h3>
                        <p className="text-gray-300 mb-3">{qual.description}</p>
                        <div className="flex flex-wrap gap-2 mb-3">
                          {qual.skills?.map((skill, idx) => (
                            <span key={idx} className="px-3 py-1 bg-primary-500/20 text-primary-300 rounded-full text-sm">
                              {skill}
                            </span>
                          ))}
                        </div>
                        <p className="text-gray-400 text-sm">
                          {new Date(qual.date).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex gap-2 ml-4">
                        <button
                          onClick={() => handleEdit(qual)}
                          className="px-4 py-2 bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 rounded transition-colors"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(qual.id)}
                          className="px-4 py-2 bg-red-500/20 text-red-400 hover:bg-red-500/30 rounded transition-colors"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))
              )
            ) : (
              projects.length === 0 ? (
                <div className="text-center text-gray-400 py-12">
                  No projects found. Add your first one!
                </div>
              ) : (
                projects.map((project) => (
                  <motion.div
                    key={project.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="glass-dark rounded-lg p-6"
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-white mb-2">{project.title}</h3>
                        <p className="text-gray-300 mb-3">{project.description}</p>
                        <div className="flex flex-wrap gap-2 mb-3">
                          {project.skills?.map((skill, idx) => (
                            <span key={idx} className="px-3 py-1 bg-primary-500/20 text-primary-300 rounded-full text-sm">
                              {skill}
                            </span>
                          ))}
                        </div>
                        <div className="text-gray-400 text-sm space-y-1">
                          <p>{new Date(project.date).toLocaleDateString()}</p>
                          {project.featured && <span className="inline-block px-2 py-1 bg-yellow-500/20 text-yellow-400 rounded text-xs">Featured</span>}
                        </div>
                      </div>
                      <div className="flex gap-2 ml-4">
                        <button
                          onClick={() => handleEdit(project)}
                          className="px-4 py-2 bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 rounded transition-colors"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(project.id)}
                          className="px-4 py-2 bg-red-500/20 text-red-400 hover:bg-red-500/30 rounded transition-colors"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))
              )
            )}
          </div>
        </div>

        {/* Forms Modal */}
        {showForm && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-6 z-50">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-gray-800 rounded-lg p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            >
              {activeTab === 'qualifications' ? (
                <QualificationForm
                  item={editingItem}
                  onClose={handleFormClose}
                />
              ) : (
                <ProjectForm
                  item={editingItem}
                  onClose={handleFormClose}
                />
              )}
            </motion.div>
          </div>
        )}
      </AdminLayout>
    </>
  );
}
