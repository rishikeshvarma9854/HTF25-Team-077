import React from 'react';
import { useProfile } from '../context/ProfileContext';
import ProfileCard from '../components/profile/ProfileCard';
import StatsCard from '../components/profile/StatsCard';
import SettingsCard from '../components/profile/SettingsCard';
import Button from '../components/common/Button';

export default function Profile() {
  const {
    profile,
    preferences,
    statistics,
    updateProfile,
    updatePreferences,
    exportData,
    clearAllData,
    signOut,
    deleteAccount,
  } = useProfile();

  return (
    <div className="container-responsive space-y-8">
      {/* Header */}
      <div>
        <h1 className="font-display text-4xl md:text-5xl font-bold text-brand-900 mb-2">
          My Profile
        </h1>
        <p className="text-brand-600 text-lg">
          Manage your profile, view statistics, and customize your preferences
        </p>
        {/* Sign-in is available in the header */}
      </div>

      {/* Profile and Stats Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ProfileCard profile={profile} onUpdate={updateProfile} />
        <StatsCard statistics={statistics} />
      </div>

      {/* Settings */}
      <SettingsCard
        preferences={preferences}
        onUpdate={updatePreferences}
        onExportData={exportData}
        onClearData={signOut}
        onDeleteAccount={deleteAccount}
      />
    </div>
  );
}
