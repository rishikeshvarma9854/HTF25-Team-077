import React, { useState } from 'react';
import { z } from 'zod';
import { UserProfile } from '../../types/profile';
import Button from '../common/Button';
import Input from '../common/Input';

interface ProfileCardProps {
  profile: UserProfile | null;
  onUpdate: (updates: Partial<UserProfile>) => Promise<void>;
}

export default function ProfileCard({ profile, onUpdate }: ProfileCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(profile?.name || '');
  const [bio, setBio] = useState(profile?.bio || '');
  const [location, setLocation] = useState(profile?.location || '');
  const [style, setStyle] = useState(profile?.style || '');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const profileSchema = z.object({
    name: z.string().min(1, 'Name is required').max(100, 'Name too long'),
    bio: z.string().max(500).optional(),
    location: z.string().max(200).optional(),
    style: z.string().max(100).optional(),
  });

  const handleSave = async () => {
    setErrors({});
    const result = profileSchema.safeParse({ name, bio, location, style });
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      for (const issue of result.error.issues) {
        const key = issue.path[0] as string;
        fieldErrors[key] = issue.message;
      }
      setErrors(fieldErrors);
      return;
    }

    await onUpdate({
      name: name || 'User',
      bio: bio || undefined,
      location: location || undefined,
      style: style || undefined,
    });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setName(profile?.name || '');
    setBio(profile?.bio || '');
    setLocation(profile?.location || '');
    setStyle(profile?.style || '');
    setIsEditing(false);
  };

  return (
    <div className="bg-white rounded-2xl border-2 border-brand-200 p-6">
      <div className="flex items-start justify-between mb-6">
        <h2 className="font-display text-2xl font-semibold text-brand-900">
          Profile Information
        </h2>
        {!isEditing && (
          <Button onClick={() => setIsEditing(true)} variant="outline" className="text-sm">
            Edit Profile
          </Button>
        )}
      </div>

      {isEditing ? (
        <div className="space-y-4">
          <Input
            label="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter your name"
          />
          {errors.name && <p className="text-sm text-red-600 mt-1">{errors.name}</p>}
          <div>
            <label className="block text-sm font-medium text-brand-800 mb-2">
              Bio
            </label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Tell us about your style..."
              rows={3}
              className="w-full px-4 py-2 border-2 border-brand-200 rounded-lg focus:border-brand-500 focus:outline-none resize-none"
            />
            {errors.bio && <p className="text-sm text-red-600 mt-1">{errors.bio}</p>}
          </div>
          <Input
            label="Location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="City, Country"
          />
          {errors.location && <p className="text-sm text-red-600 mt-1">{errors.location}</p>}
          <Input
            label="Style Preference"
            value={style}
            onChange={(e) => setStyle(e.target.value)}
            placeholder="e.g., Minimalist, Bohemian, Classic"
          />
          {errors.style && <p className="text-sm text-red-600 mt-1">{errors.style}</p>}

          <div className="flex gap-3 pt-4">
            <Button onClick={handleSave} variant="primary" className="flex-1">
              Save Changes
            </Button>
            <Button onClick={handleCancel} variant="outline" className="flex-1">
              Cancel
            </Button>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Avatar */}
          <div className="flex items-center gap-4 mb-6">
            <div className="h-20 w-20 rounded-full bg-brand-900 text-white flex items-center justify-center text-3xl font-display overflow-hidden">
              {profile?.avatar ? (
                // eslint-disable-next-line jsx-a11y/alt-text
                <img src={profile.avatar} className="h-full w-full object-cover" />
              ) : (
                <span className="text-3xl">{(profile?.name || 'U')[0].toUpperCase()}</span>
              )}
            </div>
            <div>
              <h3 className="text-xl font-semibold text-brand-900">
                {profile?.name || 'User'}
              </h3>
              <p className="text-sm text-brand-600">
                Member since {profile?.createdAt ? new Date(profile.createdAt).toLocaleDateString() : 'today'}
              </p>
            </div>
          </div>

          {/* Profile Details */}
          <div className="space-y-3">
            {profile?.bio && (
              <div>
                <label className="text-sm font-medium text-brand-700">Bio</label>
                <p className="text-brand-900 mt-1">{profile.bio}</p>
              </div>
            )}
            {profile?.location && (
              <div>
                <label className="text-sm font-medium text-brand-700">Location</label>
                <p className="text-brand-900 mt-1 flex items-center gap-2">
                  <svg className="h-4 w-4 text-brand-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  {profile.location}
                </p>
              </div>
            )}
            {profile?.style && (
              <div>
                <label className="text-sm font-medium text-brand-700">Style Preference</label>
                <p className="text-brand-900 mt-1 flex items-center gap-2">
                  <svg className="h-4 w-4 text-brand-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                  </svg>
                  {profile.style}
                </p>
              </div>
            )}
          </div>

          {!profile?.bio && !profile?.location && !profile?.style && (
            <div className="text-center py-6 text-brand-500">
              <p className="text-sm">Click "Edit Profile" to add more information</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
