import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import {
  ALL_COMPETITION_CATEGORIES,
  ALL_COMPETITION_STATUSES,
  ALL_COMPETITION_VISIBILITY,
  ALL_ENROLLMENT_TYPES,
  NewCompetitionForm,
} from '../types/competition';

interface AddCompetitionModalProps {
  onClose: () => void;
  onAdd: (form: NewCompetitionForm) => void;
}

const EMPTY_FORM: NewCompetitionForm = {
  name: '',
  sku: '',
  category: 'Online Competition',
  price: '',
  vat: '',
  enrollmentType: 'paid',
  organizer: '',
  sport: '',
  teamSize: '1',
  status: 'pending',
  enrollmentOpen: false,
  enrollmentPeriodStart: '',
  enrollmentPeriodEnd: '',
  visibility: 'Public',
  startDate: '',
  endDate: '',
  description: '',
};

export default function AddCompetitionModal({ onClose, onAdd }: AddCompetitionModalProps) {
  const [form, setForm] = useState<NewCompetitionForm>(EMPTY_FORM);
  const [errors, setErrors] = useState<Partial<Record<keyof NewCompetitionForm, string>>>({});

  // Close on Escape
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
    }
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [onClose]);

  function validate(): boolean {
    const errs: Partial<Record<keyof NewCompetitionForm, string>> = {};
    if (!form.name.trim()) errs.name = 'Competition name is required.';
    if (!form.sku.trim()) errs.sku = 'SKU is required.';
    if (!form.organizer.trim()) errs.organizer = 'Organizer is required.';
    if (!form.sport.trim()) errs.sport = 'Sport is required.';
    if (!form.price || isNaN(parseFloat(form.price)) || parseFloat(form.price) < 0)
      errs.price = 'Enter a valid entry fee.';
    if (!form.teamSize || !Number.isInteger(Number(form.teamSize)) || Number(form.teamSize) < 1) {
      errs.teamSize = 'Team size must be an integer of at least 1.';
    }
    if (form.vat && (isNaN(parseFloat(form.vat)) || parseFloat(form.vat) < 0)) {
      errs.vat = 'Enter a valid VAT percentage.';
    }
    if (form.startDate && form.endDate && form.endDate < form.startDate) {
      errs.endDate = 'End date must be after start date.';
    }
    if (
      form.enrollmentPeriodStart &&
      form.enrollmentPeriodEnd &&
      form.enrollmentPeriodEnd < form.enrollmentPeriodStart
    ) {
      errs.enrollmentPeriodEnd = 'Enrollment end must be after enrollment start.';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (validate()) {
      onAdd(form);
      onClose();
    }
  }

  function field(key: keyof NewCompetitionForm, value: string) {
    setForm((prev) => ({ ...prev, [key]: value }));
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: undefined }));
  }

  function toggleField(key: keyof NewCompetitionForm, value: boolean) {
    setForm((prev) => ({ ...prev, [key]: value }));
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: undefined }));
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900">Add New Competition</h2>
          <button
            onClick={onClose}
            className="h-8 w-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Competition Name <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => field('name', e.target.value)}
              placeholder="e.g. City Marathon 2026"
              className={`w-full px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${errors.name ? 'border-rose-400' : 'border-gray-200'}`}
            />
            {errors.name && <p className="text-xs text-rose-500 mt-1">{errors.name}</p>}
          </div>

          {/* SKU + Category row */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                SKU <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={form.sku}
                onChange={(e) => field('sku', e.target.value)}
                placeholder="e.g. COMP-LM-001"
                className={`w-full px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent font-mono ${errors.sku ? 'border-rose-400' : 'border-gray-200'}`}
              />
              {errors.sku && <p className="text-xs text-rose-500 mt-1">{errors.sku}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
              <select
                value={form.category}
                onChange={(e) => field('category', e.target.value)}
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white"
              >
                {ALL_COMPETITION_CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Entry fee + VAT row */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Entry Fee ($) <span className="text-rose-500">*</span>
              </label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={form.price}
                onChange={(e) => field('price', e.target.value)}
                placeholder="0.00"
                className={`w-full px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${errors.price ? 'border-rose-400' : 'border-gray-200'}`}
              />
              {errors.price && <p className="text-xs text-rose-500 mt-1">{errors.price}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">VAT (%)</label>
              <input
                type="number"
                min="0"
                step="1"
                value={form.vat}
                onChange={(e) => field('vat', e.target.value)}
                placeholder="0"
                className={`w-full px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${errors.vat ? 'border-rose-400' : 'border-gray-200'}`}
              />
              {errors.vat && <p className="text-xs text-rose-500 mt-1">{errors.vat}</p>}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Organizer <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={form.organizer}
                onChange={(e) => field('organizer', e.target.value)}
                placeholder="e.g. City Athletics Council"
                className={`w-full px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${errors.organizer ? 'border-rose-400' : 'border-gray-200'}`}
              />
              {errors.organizer && <p className="text-xs text-rose-500 mt-1">{errors.organizer}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Sport <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={form.sport}
                onChange={(e) => field('sport', e.target.value)}
                placeholder="e.g. Marathon"
                className={`w-full px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${errors.sport ? 'border-rose-400' : 'border-gray-200'}`}
              />
              {errors.sport && <p className="text-xs text-rose-500 mt-1">{errors.sport}</p>}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Enrollment Type</label>
              <select
                value={form.enrollmentType}
                onChange={(e) => field('enrollmentType', e.target.value)}
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white"
              >
                {ALL_ENROLLMENT_TYPES.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select
                value={form.status}
                onChange={(e) => field('status', e.target.value)}
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white"
              >
                {ALL_COMPETITION_STATUSES.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Team Size</label>
              <input
                type="number"
                min="1"
                step="1"
                value={form.teamSize}
                onChange={(e) => field('teamSize', e.target.value)}
                className={`w-full px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${errors.teamSize ? 'border-rose-400' : 'border-gray-200'}`}
              />
              {errors.teamSize && <p className="text-xs text-rose-500 mt-1">{errors.teamSize}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Visibility</label>
              <select
                value={form.visibility}
                onChange={(e) => field('visibility', e.target.value)}
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white"
              >
                {ALL_COMPETITION_VISIBILITY.map((visibility) => (
                  <option key={visibility} value={visibility}>
                    {visibility}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Enrollment Opens</label>
              <select
                value={form.enrollmentOpen ? 'true' : 'false'}
                onChange={(e) => toggleField('enrollmentOpen', e.target.value === 'true')}
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white"
              >
                <option value="false">No</option>
                <option value="true">Yes</option>
              </select>
            </div>
            <div className="flex items-end">
              <p className="text-xs text-gray-500">Defaults: paid enrollment, pending status, team size 1.</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Enrollment Period Start</label>
              <input
                type="date"
                value={form.enrollmentPeriodStart}
                onChange={(e) => field('enrollmentPeriodStart', e.target.value)}
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Enrollment Period End</label>
              <input
                type="date"
                value={form.enrollmentPeriodEnd}
                onChange={(e) => field('enrollmentPeriodEnd', e.target.value)}
                className={`w-full px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${errors.enrollmentPeriodEnd ? 'border-rose-400' : 'border-gray-200'}`}
              />
              {errors.enrollmentPeriodEnd && (
                <p className="text-xs text-rose-500 mt-1">{errors.enrollmentPeriodEnd}</p>
              )}
            </div>
          </div>

          {/* Dates row */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
              <input
                type="date"
                value={form.startDate}
                onChange={(e) => field('startDate', e.target.value)}
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
              <input
                type="date"
                value={form.endDate}
                onChange={(e) => field('endDate', e.target.value)}
                className={`w-full px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${errors.endDate ? 'border-rose-400' : 'border-gray-200'}`}
              />
              {errors.endDate && <p className="text-xs text-rose-500 mt-1">{errors.endDate}</p>}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <input
              type="text"
              value={form.description}
              onChange={(e) => field('description', e.target.value)}
              placeholder="Short competition details"
              className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2.5 rounded-lg border border-gray-200 text-gray-600 text-sm font-medium hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2.5 rounded-lg bg-indigo-600 text-white text-sm font-semibold hover:bg-indigo-700 active:scale-95 transition-all shadow-sm"
            >
              Add Competition
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
