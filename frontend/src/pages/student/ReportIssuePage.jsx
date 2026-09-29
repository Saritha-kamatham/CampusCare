import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { issueService } from '../../services/issueService';
import { CATEGORIES } from '../../utils/constants';
import { Button } from '../../components/common/Button';
import { Card, CardContent } from '../../components/common/Card';
import {
  PlusCircle,
  Upload,
  X,
  MapPin,
  AlertCircle,
  CheckCircle2,
  Wifi,
  Zap,
  Presentation,
  FlaskConical,
  Home,
  Sparkles,
  BookOpen,
  Bus,
  ShieldAlert,
  HelpCircle,
} from 'lucide-react';

export const ReportIssuePage = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'WIFI_INTERNET',
    priority: 'MEDIUM',
    location: '',
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const navigate = useNavigate();

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        setError('Image file size exceeds 10MB limit.');
        return;
      }
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
      setError('');
    }
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.title.trim() || !formData.description.trim() || !formData.location.trim()) {
      setError('Please fill in all required fields.');
      return;
    }

    setSubmitting(true);
    try {
      let imageUrl = null;
      if (imageFile) {
        const uploadRes = await issueService.uploadImage(imageFile);
        imageUrl = uploadRes.imageUrl;
      }

      const issueData = {
        ...formData,
        imageUrl,
      };

      const created = await issueService.createIssue(issueData);
      navigate(`/issues/${created.id}?created=true`);
    } catch (err) {
      console.error('Failed to submit issue:', err);
      const msg = err.response?.data?.message || 'Failed to submit issue. Please check your inputs.';
      setError(msg);
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-in fade-in duration-200">
      <div>
        <h2 className="text-2xl font-extrabold text-white tracking-tight">Report Campus Service Issue</h2>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Provide complete location details and a clear description to expedite maintenance dispatch.
        </p>
      </div>

      {error && (
        <div className="p-4 rounded-2xl bg-rose-950/50 border border-rose-800 text-rose-300 text-xs sm:text-sm flex items-center gap-3">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <Card>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title */}
            <div>
              <label className="block text-xs sm:text-sm font-semibold text-slate-300 mb-1.5">
                Issue Title *
              </label>
              <input
                type="text"
                name="title"
                required
                value={formData.title}
                onChange={handleInputChange}
                placeholder="e.g. Wi-Fi not working in CSE Lab 2"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-700 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 bg-slate-950 text-white placeholder-slate-500"
              />
            </div>

            {/* Category selection chips */}
            <div>
              <label className="block text-xs sm:text-sm font-semibold text-slate-300 mb-2">
                Issue Category *
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                {CATEGORIES.map((cat) => {
                  const isSelected = formData.category === cat.value;
                  return (
                    <button
                      key={cat.value}
                      type="button"
                      onClick={() => setFormData({ ...formData, category: cat.value })}
                      className={`p-3 rounded-xl border text-xs font-semibold flex flex-col items-center gap-1.5 transition-all ${
                        isSelected
                          ? 'border-brand-500 bg-brand-500/20 text-brand-300 ring-2 ring-brand-500/30 shadow-sm'
                          : 'border-slate-800 hover:border-slate-700 text-slate-400 bg-slate-950/60'
                      }`}
                    >
                      <span className="truncate">{cat.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Priority and Location */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs sm:text-sm font-semibold text-slate-300 mb-1.5">
                  Priority Level *
                </label>
                <select
                  name="priority"
                  value={formData.priority}
                  onChange={handleInputChange}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-700 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 bg-slate-950 text-white"
                >
                  <option value="LOW">Low (Minor inconvenience)</option>
                  <option value="MEDIUM">Medium (Normal daily workflow impact)</option>
                  <option value="HIGH">High (Urgent class or equipment disruption)</option>
                  <option value="CRITICAL">Critical (Immediate safety or facility shutdown)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-semibold text-slate-300 mb-1.5">
                  Specific Campus Location *
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3.5 top-3 w-4 h-4 text-slate-500" />
                  <input
                    type="text"
                    name="location"
                    required
                    value={formData.location}
                    onChange={handleInputChange}
                    placeholder="e.g. CSE Lab 2, 2nd Floor Turing Block"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-700 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 bg-slate-950 text-white placeholder-slate-500"
                  />
                </div>
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-xs sm:text-sm font-semibold text-slate-300 mb-1.5">
                Detailed Description *
              </label>
              <textarea
                name="description"
                rows="4"
                required
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Explain the symptom, when it started, and any equipment codes..."
                className="w-full px-4 py-2.5 rounded-xl border border-slate-700 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 bg-slate-950 text-white placeholder-slate-500"
              />
            </div>

            {/* Photo upload */}
            <div>
              <label className="block text-xs sm:text-sm font-semibold text-slate-300 mb-1.5">
                Attach Photo Evidence (Optional)
              </label>

              {imagePreview ? (
                <div className="relative rounded-2xl overflow-hidden border border-slate-700 max-w-sm">
                  <img src={imagePreview} alt="Preview" className="w-full h-48 object-cover" />
                  <button
                    type="button"
                    onClick={removeImage}
                    className="absolute top-2 right-2 p-1.5 rounded-full bg-slate-950/80 text-white hover:bg-rose-600 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div className="border-2 border-dashed border-slate-700 rounded-2xl p-6 text-center hover:border-brand-500 transition-colors cursor-pointer relative bg-slate-950/60">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                  />
                  <div className="flex flex-col items-center gap-2 text-slate-400">
                    <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800 text-brand-400">
                      <Upload className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-xs sm:text-sm font-semibold text-white">
                        Click or drag a photo of the problem
                      </p>
                      <p className="text-[11px] text-slate-500 mt-0.5">PNG, JPG up to 10MB</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Submit buttons */}
            <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-800">
              <Button
                type="button"
                variant="outline"
                size="md"
                onClick={() => navigate(-1)}
                disabled={submitting}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="primary"
                size="md"
                loading={submitting}
                icon={PlusCircle}
              >
                Submit Issue Ticket
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
