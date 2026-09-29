import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { issueService } from '../../services/issueService';
import { CheckCircle2, Upload, AlertCircle } from 'lucide-react';

export const StatusChangeModal = ({
  isOpen,
  onClose,
  issue,
  availableStatuses = [],
  onStatusUpdateSuccess,
}) => {
  const [status, setStatus] = useState(availableStatuses[0] || 'RESOLVED');
  const [notes, setNotes] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      let resolutionImageUrl = null;
      if (imageFile) {
        const uploadRes = await issueService.uploadImage(imageFile);
        resolutionImageUrl = uploadRes.imageUrl;
      }

      await onStatusUpdateSuccess(status, notes, resolutionImageUrl);
      setNotes('');
      setImageFile(null);
      setImagePreview(null);
      onClose();
    } catch (err) {
      console.error('Failed to update status:', err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Update Issue Status">
      <form onSubmit={handleSubmit} className="space-y-4">
        {issue && (
          <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 text-xs">
            <span className="font-bold text-white block truncate">
              #{issue.issueCode}: {issue.title}
            </span>
            <span className="text-slate-400 mt-0.5 block">
              Current status: <span className="font-semibold text-brand-400">{issue.status}</span>
            </span>
          </div>
        )}

        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1.5">
            Target Status *
          </label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            required
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-700 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 bg-slate-950 text-white"
          >
            {availableStatuses.map((st) => (
              <option key={st} value={st}>
                {st.replace('_', ' ')}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1.5">
            {status === 'RESOLVED' ? 'Resolution Work Details *' : 'Update Notes / Justification'}
          </label>
          <textarea
            rows="3"
            required={status === 'RESOLVED'}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder={
              status === 'RESOLVED'
                ? 'Describe the technical resolution performed, parts replaced, or corrective steps completed...'
                : 'Add optional notes regarding this status change...'
            }
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-700 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 bg-slate-950 text-white placeholder-slate-500"
          />
        </div>

        {status === 'RESOLVED' && (
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Resolution Proof Photo (Optional)
            </label>
            <div className="border-2 border-dashed border-slate-700 rounded-xl p-4 text-center hover:border-brand-500 transition-colors cursor-pointer relative bg-slate-950/70">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
              />
              {imagePreview ? (
                <div className="flex flex-col items-center">
                  <img
                    src={imagePreview}
                    alt="Proof Preview"
                    className="h-28 object-cover rounded-lg shadow-sm border border-slate-700"
                  />
                  <span className="text-xs text-brand-400 mt-2 font-medium">Click to replace image</span>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-1.5 text-slate-400">
                  <Upload className="w-5 h-5 text-slate-400" />
                  <span className="text-xs font-medium">Upload photo of repaired equipment/site</span>
                  <span className="text-[11px] text-slate-500">PNG, JPG up to 10MB</span>
                </div>
              )}
            </div>
          </div>
        )}

        <div className="pt-2 flex items-center justify-end gap-3 border-t border-slate-800">
          <Button type="button" variant="outline" size="sm" onClick={onClose} disabled={submitting}>
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            size="sm"
            loading={submitting}
            icon={CheckCircle2}
          >
            Apply Status Update
          </Button>
        </div>
      </form>
    </Modal>
  );
};
