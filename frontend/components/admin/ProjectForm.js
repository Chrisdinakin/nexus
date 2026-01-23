import { useState, useEffect } from 'react';
import { projectsAPI } from '../../lib/api';

export default function ProjectForm({ item, onClose }) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    skills: '',
    image_url: '',
    project_url: '',
    github_url: '',
    featured: false,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (item) {
      setFormData({
        title: item.title || '',
        description: item.description || '',
        date: item.date ? item.date.split('T')[0] : '',
        skills: item.skills ? item.skills.join(', ') : '',
        image_url: item.image_url || '',
        project_url: item.project_url || '',
        github_url: item.github_url || '',
        featured: item.featured || false,
      });
    }
  }, [item]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const data = {
        ...formData,
        skills: formData.skills.split(',').map(s => s.trim()).filter(s => s),
      };

      if (item) {
        await projectsAPI.update(item.id, data);
      } else {
        await projectsAPI.create(data);
      }

      onClose();
    } catch (err) {
      setError(err.response?.data?.error || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setFormData({
      ...formData,
      [e.target.name]: value,
    });
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-white">
          {item ? 'Edit Project' : 'Add Project'}
        </h2>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-white text-2xl"
        >
          ×
        </button>
      </div>

      {error && (
        <div className="bg-red-500/20 border border-red-500 text-red-400 px-4 py-3 rounded-lg mb-6">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-gray-300 mb-2">Title *</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-primary-500 text-white"
          />
        </div>

        <div>
          <label className="block text-gray-300 mb-2">Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows="4"
            className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-primary-500 text-white resize-none"
          />
        </div>

        <div>
          <label className="block text-gray-300 mb-2">Date *</label>
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-primary-500 text-white"
          />
        </div>

        <div>
          <label className="block text-gray-300 mb-2">
            Skills (comma-separated)
          </label>
          <input
            type="text"
            name="skills"
            value={formData.skills}
            onChange={handleChange}
            placeholder="e.g., JavaScript, React, Node.js"
            className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-primary-500 text-white"
          />
        </div>

        <div>
          <label className="block text-gray-300 mb-2">Image URL</label>
          <input
            type="url"
            name="image_url"
            value={formData.image_url}
            onChange={handleChange}
            placeholder="https://example.com/image.jpg"
            className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-primary-500 text-white"
          />
        </div>

        <div>
          <label className="block text-gray-300 mb-2">Project URL</label>
          <input
            type="url"
            name="project_url"
            value={formData.project_url}
            onChange={handleChange}
            placeholder="https://example.com"
            className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-primary-500 text-white"
          />
        </div>

        <div>
          <label className="block text-gray-300 mb-2">GitHub URL</label>
          <input
            type="url"
            name="github_url"
            value={formData.github_url}
            onChange={handleChange}
            placeholder="https://github.com/username/repo"
            className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-primary-500 text-white"
          />
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            id="featured"
            name="featured"
            checked={formData.featured}
            onChange={handleChange}
            className="w-5 h-5 text-primary-500 bg-gray-700 border-gray-600 rounded focus:ring-primary-500"
          />
          <label htmlFor="featured" className="ml-3 text-gray-300">
            Featured Project
          </label>
        </div>

        <div className="flex gap-4">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 px-6 py-3 bg-primary-500 hover:bg-primary-600 text-white rounded-lg transition-colors disabled:opacity-50"
          >
            {loading ? 'Saving...' : 'Save'}
          </button>
          <button
            type="button"
            onClick={onClose}
            className="flex-1 px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
