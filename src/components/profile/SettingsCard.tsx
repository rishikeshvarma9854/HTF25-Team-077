import React from 'react';
import Modal from '@/components/common/Modal';
import { UserPreferences } from '../../types/profile';

interface SettingsCardProps {
  preferences: UserPreferences;
  onUpdate: (updates: Partial<UserPreferences>) => Promise<void>;
  onExportData: () => Promise<void>;
  onClearData: () => Promise<void>;
  onDeleteAccount?: () => Promise<void>;
}

export default function SettingsCard({
  preferences,
  onUpdate,
  onExportData,
  onClearData,
  onDeleteAccount,
}: SettingsCardProps) {
  const [showConfirm, setShowConfirm] = React.useState(false);

  const handleClearData = async () => {
    if (showConfirm) {
      await onClearData();
      setShowConfirm(false);
    } else {
      setShowConfirm(true);
    }
  };

  // Delete account modal state
  const [showDeleteModal, setShowDeleteModal] = React.useState(false);
  const [deleteInput, setDeleteInput] = React.useState('');
  const isDeleteConfirmed = deleteInput === 'DELETE';

  const openDeleteModal = () => {
    setDeleteInput('');
    setShowDeleteModal(true);
  };

  const confirmDeleteAccount = async () => {
    if (!isDeleteConfirmed) return;
    setShowDeleteModal(false);
    if (onDeleteAccount) await onDeleteAccount();
  };

  return (
    <div className="bg-white rounded-2xl border-2 border-brand-200 p-6">
      <h2 className="font-display text-2xl font-semibold text-brand-900 mb-6">
        Settings & Preferences
      </h2>

      <div className="space-y-6">
        {/* Notifications */}
        <div className="flex items-center justify-between p-4 rounded-xl bg-brand-50 border border-brand-200">
          <div>
            <h3 className="font-medium text-brand-900">Notifications</h3>
            <p className="text-sm text-brand-600">Receive style tips and updates</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={preferences.notifications}
              onChange={(e) => onUpdate({ notifications: e.target.checked })}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-brand-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-brand-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-brand-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-900"></div>
          </label>
        </div>

        {/* Default Occasion */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-brand-800">
            Default Occasion for Outfit Generation
          </label>
          <select
            value={preferences.defaultOccasion}
            onChange={(e) => onUpdate({ defaultOccasion: e.target.value })}
            className="w-full px-4 py-2 border-2 border-brand-200 rounded-lg focus:border-brand-500 focus:outline-none bg-white"
          >
            <option value="casual">Casual</option>
            <option value="work">Work</option>
            <option value="formal">Formal</option>
            <option value="party">Party</option>
            <option value="date">Date Night</option>
            <option value="gym">Gym/Sports</option>
            <option value="travel">Travel</option>
          </select>
        </div>

        {/* Measurement Unit */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-brand-800">
            Temperature Unit
          </label>
          <div className="flex gap-3">
            <button
              onClick={() => onUpdate({ measurementUnit: 'metric' })}
              className={`flex-1 px-4 py-2 rounded-lg border-2 font-medium transition-all ${
                preferences.measurementUnit === 'metric'
                  ? 'bg-brand-900 text-white border-brand-900'
                  : 'bg-white text-brand-900 border-brand-200 hover:border-brand-400'
              }`}
            >
              Celsius (°C)
            </button>
            <button
              onClick={() => onUpdate({ measurementUnit: 'imperial' })}
              className={`flex-1 px-4 py-2 rounded-lg border-2 font-medium transition-all ${
                preferences.measurementUnit === 'imperial'
                  ? 'bg-brand-900 text-white border-brand-900'
                  : 'bg-white text-brand-900 border-brand-200 hover:border-brand-400'
              }`}
            >
              Fahrenheit (°F)
            </button>
          </div>
        </div>

        {/* Data Management */}
        <div className="pt-4 border-t-2 border-brand-100 space-y-3">
          <h3 className="font-medium text-brand-900 mb-3">Data Management</h3>
          
          <button
            onClick={onExportData}
            className="w-full px-4 py-3 rounded-lg border-2 border-brand-300 bg-white text-brand-900 font-medium hover:bg-brand-50 transition-colors flex items-center justify-center gap-2"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Export My Data
          </button>

          <button
            onClick={handleClearData}
            className={`w-full px-4 py-3 rounded-lg border-2 font-medium transition-colors flex items-center justify-center gap-2 ${
              showConfirm
                ? 'bg-red-500 text-white border-red-500 hover:bg-red-600'
                : 'border-red-300 bg-white text-red-600 hover:bg-red-50'
            }`}
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7" />
            </svg>
            {showConfirm ? 'Click Again to Confirm' : 'Logout'}
          </button>

          {showConfirm && (
            <p className="text-xs text-red-600 text-center">
              This will sign you out of your account. Your local edits will remain.
            </p>
          )}
        </div>

        {/* Account deletion - remote removal + local wipe */}
        {onDeleteAccount && (
          <div className="pt-4">
            <h3 className="font-medium text-brand-900 mb-2">Danger Zone</h3>
            <p className="text-sm text-brand-600 mb-3">Delete your account and all cloud-saved profile data. This will also clear local data.</p>
            <button
              onClick={openDeleteModal}
              className="w-full px-4 py-3 rounded-lg border-2 font-medium transition-colors bg-red-600 text-white hover:bg-red-700"
            >
              Delete Account (permanently)
            </button>

            <Modal open={showDeleteModal} onClose={() => setShowDeleteModal(false)} title="Delete account">
              <p className="text-sm text-brand-700 mb-4">This will permanently remove your cloud-saved profile and preferences. To confirm, type <strong>DELETE</strong> below.</p>
              <input
                value={deleteInput}
                onChange={(e) => setDeleteInput(e.target.value)}
                placeholder="Type DELETE to confirm"
                className="w-full mb-4 px-3 py-2 border-2 border-brand-200 rounded-lg"
              />
              <div className="flex gap-3">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="flex-1 px-4 py-2 rounded-lg border-2 bg-white text-brand-900 border-brand-200 hover:bg-brand-50"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDeleteAccount}
                  disabled={!isDeleteConfirmed}
                  className={`flex-1 px-4 py-2 rounded-lg font-medium transition-all ${isDeleteConfirmed ? 'bg-red-600 text-white' : 'bg-red-200 text-white/60 cursor-not-allowed'}`}
                >
                  Confirm Delete
                </button>
              </div>
            </Modal>
          </div>
        )}
      </div>
    </div>
  );
}
