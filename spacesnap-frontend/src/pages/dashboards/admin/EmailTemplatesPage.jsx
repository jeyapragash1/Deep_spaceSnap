// src/pages/dashboards/admin/EmailTemplatesPage.jsx

import React, { useState, useEffect } from 'react';
import api from '../../../api/axiosConfig';
import { Loader2, Save, Mail, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const EmailTemplatesPage = () => {
    const [templates, setTemplates] = useState([]);
    const [selectedTemplate, setSelectedTemplate] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchTemplates = async () => {
            try {
                const { data } = await api.get('/admin/email-templates');
                setTemplates(data);
                if (data.length > 0) {
                    setSelectedTemplate(data[0]);
                }
            } catch (err) {
                setError('Failed to fetch email templates.');
            } finally {
                setLoading(false);
            }
        };
        fetchTemplates();
    }, []);

    const handleSave = async () => {
        if (!selectedTemplate) return;
        setIsSaving(true);
        try {
            await api.put(`/admin/email-templates/${selectedTemplate._id}`, {
                subject: selectedTemplate.subject,
                htmlBody: selectedTemplate.htmlBody,
            });
            alert('Template saved successfully!');
        } catch (err) {
            alert('Failed to save template.');
        } finally {
            setIsSaving(false);
        }
    };

    const handleTemplateChange = (e) => {
        setSelectedTemplate({
            ...selectedTemplate,
            [e.target.name]: e.target.value,
        });
    };

    if (loading) {
        return <div className="flex justify-center items-center h-full"><Loader2 className="animate-spin text-indigo-600" size={48} /></div>;
    }
    
    if (error) {
        return <p className="text-red-500 font-semibold">{error}</p>;
    }

    return (
        <div className="space-y-6">
            <Link to="/admin/settings" className="inline-flex items-center gap-2 text-indigo-600 font-semibold hover:underline">
                <ArrowLeft size={18} /> Back to System Settings
            </Link>

            <div className="flex items-center gap-3">
                <Mail size={32} />
                <h1 className="text-3xl font-bold">Manage Email Templates</h1>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="md:col-span-1">
                    <h2 className="font-semibold mb-2">Select Template</h2>
                    <select
                        className="w-full p-2 border rounded-md"
                        onChange={(e) => setSelectedTemplate(templates.find(t => t._id === e.target.value))}
                        value={selectedTemplate?._id || ''}
                    >
                        {templates.map(template => (
                            <option key={template._id} value={template._id}>
                                {template.name}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="md:col-span-3 bg-white p-6 rounded-lg shadow border">
                    {selectedTemplate ? (
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Subject</label>
                                <input
                                    type="text"
                                    name="subject"
                                    value={selectedTemplate.subject}
                                    onChange={handleTemplateChange}
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">HTML Body</label>
                                <textarea
                                    name="htmlBody"
                                    rows="15"
                                    value={selectedTemplate.htmlBody}
                                    onChange={handleTemplateChange}
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm font-mono text-sm"
                                ></textarea>
                                { /* --- THIS IS THE FIX --- */ }
                                { /* The text is now a simple string and will not be treated as a variable. */ }
                                <p className="text-xs text-gray-500 mt-1">You can use placeholders like `{"{{name}}"}` or `{"{{resetLink}}"}`.</p>
                            </div>
                            <button
                                onClick={handleSave}
                                disabled={isSaving}
                                className="bg-indigo-600 text-white font-bold py-2 px-5 rounded-lg flex items-center gap-2 disabled:bg-gray-400"
                            >
                                {isSaving ? <Loader2 className="animate-spin" /> : <Save size={18} />}
                                {isSaving ? 'Saving...' : 'Save Template'}
                            </button>
                        </div>
                    ) : (
                        <p>No template selected. Make sure you have added templates to your database.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default EmailTemplatesPage;