// src/pages/dashboards/admin/EmailTemplatesPage.jsx

import React, { useState, useEffect } from 'react';
import api from '../../../api/axiosConfig';
import { Loader2, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const EmailTemplatesPage = () => {
    const [templates, setTemplates] = useState([]);
    const [selectedTemplate, setSelectedTemplate] = useState(null);
    const [formData, setFormData] = useState({ subject: '', htmlBody: '' });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState('');

    useEffect(() => {
        const fetchTemplates = async () => {
            try {
                const res = await api.get('/admin/email-templates');
                setTemplates(res.data);
                if (res.data.length > 0) {
                    handleSelectTemplate(res.data[0]);
                }
            } catch (err) {
                console.error("Failed to load templates:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchTemplates();
    }, []);

    const handleSelectTemplate = (template) => {
        setSelectedTemplate(template);
        setFormData({ subject: template.subject, htmlBody: template.htmlBody });
        setMessage('');
    };

    const handleSave = async () => {
        setSaving(true);
        setMessage('');
        try {
            const res = await api.put(`/admin/email-templates/${selectedTemplate._id}`, formData);
            // Update the template in the local list to reflect changes
            setTemplates(templates.map(t => t._id === res.data._id ? res.data : t));
            setMessage('Template saved successfully!');
        } catch (err) {
            setMessage('Failed to save template.');
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div className="flex justify-center items-center h-64"><Loader2 className="animate-spin text-blue-600" size={48} /></div>;

    return (
        <div className="space-y-6">
            <Link to="/admin/settings" className="flex items-center gap-2 text-gray-500 font-semibold hover:text-gray-800">
                <ArrowLeft size={18} /> Back to Settings
            </Link>
            <h1 className="text-3xl font-bold text-gray-800">Manage Email Templates</h1>
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                <div className="lg:col-span-1 bg-white p-4 rounded-xl border">
                    <h3 className="font-bold mb-2">Templates</h3>
                    <ul className="space-y-1">
                        {templates.map(template => (
                            <li key={template._id}>
                                <button 
                                    onClick={() => handleSelectTemplate(template)}
                                    className={`w-full text-left p-2 rounded-md ${selectedTemplate?._id === template._id ? 'bg-blue-600 text-white' : 'hover:bg-gray-100'}`}
                                >
                                    <p className="font-semibold">{template.name.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}</p>
                                    <p className="text-xs opacity-80">{template.description}</p>
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>
                <div className="lg:col-span-3 bg-white p-6 rounded-xl border">
                    {selectedTemplate ? (
                        <div className="space-y-4">
                            <h2 className="text-xl font-bold">{selectedTemplate.name.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}</h2>
                            <div>
                                <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                                <input type="text" id="subject" value={formData.subject} onChange={e => setFormData({...formData, subject: e.target.value})} className="w-full p-2 border rounded-md" />
                            </div>
                            <div>
                                <label htmlFor="htmlBody" className="block text-sm font-medium text-gray-700 mb-1">HTML Body</label>
                                <textarea id="htmlBody" rows="12" value={formData.htmlBody} onChange={e => setFormData({...formData, htmlBody: e.target.value})} className="w-full p-2 border rounded-md font-mono text-sm"></textarea>
                                <p className="text-xs text-gray-500 mt-1">You can use variables like `{{name}}` or `{{link}}` which will be replaced automatically.</p>
                            </div>
                            <div className="flex justify-end items-center gap-4">
                               {message && <p className={`text-sm ${message.includes('success') ? 'text-green-600' : 'text-red-600'}`}>{message}</p>}
                                <button onClick={handleSave} disabled={saving} className="bg-blue-600 text-white font-bold py-2 px-6 rounded-lg flex items-center gap-2 disabled:bg-gray-400">
                                    {saving ? <Loader2 className="animate-spin" /> : 'Save Template'}
                                </button>
                            </div>
                        </div>
                    ) : <p>Select a template to edit.</p>}
                </div>
            </div>
        </div>
    );
};

export default EmailTemplatesPage;