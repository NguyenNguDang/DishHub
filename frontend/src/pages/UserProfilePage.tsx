import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useCurrentProfile, useUpdateProfile, useUploadAvatar } from '../hooks/useUserProfile';

interface ProfileFormData {
  firstName: string;
  lastName: string;
  email: string;
  age: number;
  weight: number;
  bio: string;
  dietaryPreferences: string[];
}

export const UserProfilePage: React.FC = () => {
  //API hooks
  const { data: currentProfile, isLoading, error } = useCurrentProfile();
  const updateProfileMutation = useUpdateProfile();
  const uploadAvatarMutation = useUploadAvatar();

  //Form state
  const [formData, setFormData] = useState<ProfileFormData>({
    firstName: '',
    lastName: '',
    email: '',
    age: 0,
    weight: 0,
    bio: '',
    dietaryPreferences: [],
  });

  const [isSaving, setIsSaving] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState('');

  // Initialize form from API data
  useEffect(() => {
    if (currentProfile) {
      setFormData({
        firstName: currentProfile.firstName || '',
        lastName: currentProfile.lastName || '',
        email: currentProfile.email || '',
        age: currentProfile.age || 0,
        weight: currentProfile.weight || 0,
        bio: currentProfile.bio || '',
        dietaryPreferences: currentProfile.preferences?.dietaryRestrictions || [],
      });
      setAvatarUrl(currentProfile.avatar || `https://ui-avatars.com/api/?name=${currentProfile.firstName}+${currentProfile.lastName}&background=f27f0d&color=fff&bold=true&size=256`);
    }
  }, [currentProfile]);

  const dietaryOptions = ['Vegetarian', 'Gluten-Free', 'Dairy-Free', 'Keto'];

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'age' || name === 'weight' ? Number(value) : value,
    }));
  };

  const toggleDietaryPreference = (preference: string) => {
    setFormData((prev) => ({
      ...prev,
      dietaryPreferences: prev.dietaryPreferences.includes(preference)
        ? prev.dietaryPreferences.filter((p) => p !== preference)
        : [...prev.dietaryPreferences, preference],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await updateProfileMutation.mutateAsync({
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        age: formData.age,
        weight: formData.weight,
        bio: formData.bio,
        preferences: {
          dietaryRestrictions: formData.dietaryPreferences,
        },
      });
      alert('✓ Profile updated successfully!');
    } catch (error) {
      console.error('Error saving profile:', error);
      alert('Failed to save profile. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  // Handle avatar upload
  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const newAvatarUrl = await uploadAvatarMutation.mutateAsync(file);
      setAvatarUrl(newAvatarUrl);
      alert('✓ Avatar uploaded successfully!');
    } catch (error) {
      console.error('Error uploading avatar:', error);
      alert('Failed to upload avatar. Please try again.');
    }
  };

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background-light dark:bg-background-dark flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-slate-600 dark:text-slate-400">Loading profile...</p>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="min-h-screen bg-background-light dark:bg-background-dark flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 dark:text-red-400 mb-4">Failed to load profile</p>
          <p className="text-sm text-slate-600 dark:text-slate-400">{error.message}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark">
      {/* Hidden file input for avatar upload */}
      <input
        type="file"
        id="avatar-input"
        accept="image/*"
        onChange={handleAvatarUpload}
        className="hidden"
      />

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-4 py-8 sm:py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Account Settings
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">
            Manage your profile information and preferences.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Sidebar / Mobile Profile Info */}
          <div className="lg:col-span-4 flex flex-col gap-6">
            {/* Profile Summary Card */}
            <div className="bg-white dark:bg-slate-900 p-6 rounded-xl shadow-sm border border-slate-100 dark:border-slate-800 flex flex-col items-center text-center">
              <div className="relative group">
                <div className="size-32 rounded-full overflow-hidden border-4 border-primary/10 mb-4 ring-2 ring-primary ring-offset-4 ring-offset-white dark:ring-offset-slate-900">
                  <img
                    alt="User Avatar"
                    className="w-full h-full object-cover"
                    src={avatarUrl}
                  />
                </div>
                <button 
                  type="button"
                  onClick={() => document.getElementById('avatar-input')?.click()}
                  className="absolute bottom-4 right-0 bg-primary text-white p-2 rounded-full shadow-lg hover:scale-105 transition-transform border-2 border-white dark:border-slate-900"
                >
                  <span className="material-symbols-outlined text-sm">
                    photo_camera
                  </span>
                </button>
              </div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                {formData.firstName} {formData.lastName}
              </h2>
              <p className="text-slate-500 dark:text-slate-400">
                {formData.email}
              </p>
              <div className="mt-6 flex flex-wrap justify-center gap-2">
                <span className="px-3 py-1 bg-primary/10 text-primary text-xs font-bold rounded-full uppercase tracking-wider">
                  Member
                </span>
              </div>
            </div>

            {/* Navigation Sidebar Elements */}
            <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-100 dark:border-slate-800 overflow-hidden">
              <nav className="flex flex-col">
                <a
                  className="flex items-center gap-3 px-6 py-4 text-primary bg-primary/5 border-l-4 border-primary font-semibold"
                  href="#"
                >
                  <span className="material-symbols-outlined">person</span>
                  Personal Info
                </a>
                <Link
                    to="/favorites"
                    className="flex items-center gap-3 px-6 py-4 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors border-l-4 border-transparent"
                >
                    <span className="material-symbols-outlined">favorite</span>
                    Saved Recipes
                </Link>
                <a
                  className="flex items-center gap-3 px-6 py-4 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors border-l-4 border-transparent"
                  href="#"
                >
                  <span className="material-symbols-outlined">shopping_bag</span>
                  Order History
                </a>
                <a
                  className="flex items-center gap-3 px-6 py-4 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors border-l-4 border-transparent"
                  href="#"
                >
                  <span className="material-symbols-outlined">settings</span>
                  Settings
                </a>
              </nav>
            </div>
          </div>

          {/* Profile Form Area */}
          <div className="lg:col-span-8">
            <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-100 dark:border-slate-800 overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50">
                <h3 className="font-bold text-lg text-slate-900 dark:text-white">
                  Edit Profile
                </h3>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* First Name Field */}
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                      First Name
                    </label>
                    <div className="relative">
                      <span className="material-symbols-outlined absolute left-3 top-3.5 text-slate-400">
                        person
                      </span>
                      <input
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-800 border-transparent rounded-lg focus:ring-2 focus:ring-primary focus:bg-white dark:focus:bg-slate-900 text-slate-900 dark:text-white transition-all"
                      />
                    </div>
                  </div>

                  {/* Last Name Field */}
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                      Last Name
                    </label>
                    <div className="relative">
                      <span className="material-symbols-outlined absolute left-3 top-3.5 text-slate-400">
                        person
                      </span>
                      <input
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-800 border-transparent rounded-lg focus:ring-2 focus:ring-primary focus:bg-white dark:focus:bg-slate-900 text-slate-900 dark:text-white transition-all"
                      />
                    </div>
                  </div>

                  {/* Email Field */}
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                      Email Address
                    </label>
                    <div className="relative">
                      <span className="material-symbols-outlined absolute left-3 top-3.5 text-slate-400">
                        mail
                      </span>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-800 border-transparent rounded-lg focus:ring-2 focus:ring-primary focus:bg-white dark:focus:bg-slate-900 text-slate-900 dark:text-white transition-all"
                      />
                    </div>
                  </div>

                  {/* Age Field */}
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                      Age
                    </label>
                    <div className="relative">
                      <span className="material-symbols-outlined absolute left-3 top-3.5 text-slate-400">
                        calendar_today
                      </span>
                      <input
                        type="number"
                        name="age"
                        value={formData.age}
                        onChange={handleInputChange}
                        className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-800 border-transparent rounded-lg focus:ring-2 focus:ring-primary focus:bg-white dark:focus:bg-slate-900 text-slate-900 dark:text-white transition-all"
                      />
                    </div>
                  </div>

                  {/* Weight Field */}
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                      Weight (kg)
                    </label>
                    <div className="relative">
                      <span className="material-symbols-outlined absolute left-3 top-3.5 text-slate-400">
                        monitor_weight
                      </span>
                      <input
                        type="number"
                        name="weight"
                        value={formData.weight}
                        onChange={handleInputChange}
                        className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-800 border-transparent rounded-lg focus:ring-2 focus:ring-primary focus:bg-white dark:focus:bg-slate-900 text-slate-900 dark:text-white transition-all"
                      />
                    </div>
                  </div>
                </div>

                {/* Bio Field */}
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                    Bio
                  </label>
                  <textarea
                    name="bio"
                    value={formData.bio}
                    onChange={handleInputChange}
                    placeholder="Tell us about your culinary journey..."
                    rows={4}
                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border-transparent rounded-lg focus:ring-2 focus:ring-primary focus:bg-white dark:focus:bg-slate-900 text-slate-900 dark:text-white transition-all resize-none"
                  />
                </div>

                {/* Dietary Preferences */}
                <div className="space-y-3">
                  <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                    Dietary Preferences
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {dietaryOptions.map((option) => (
                      <button
                        key={option}
                        type="button"
                        onClick={() => toggleDietaryPreference(option)}
                        className={`px-4 py-2 rounded-full text-xs font-bold transition-colors ${
                          formData.dietaryPreferences.includes(option)
                            ? 'bg-primary text-white'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-primary/10 hover:text-primary'
                        }`}
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center justify-end gap-4 pt-6 border-t border-slate-100 dark:border-slate-800">
                  <button
                    type="button"
                    className="px-6 py-3 text-sm font-bold text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSaving}
                    style={{
                      backgroundColor: '#f27f0d',
                    }}
                    className="px-8 py-3 text-white rounded-lg text-sm font-bold shadow-lg transition-all disabled:opacity-50"
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.backgroundColor =
                        'rgba(242, 127, 13, 0.8)')
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.backgroundColor = '#f27f0d')
                    }
                  >
                    {isSaving ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              </form>
            </div>

            {/* Secondary Info Section */}
            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-100 dark:border-slate-800 flex items-center gap-4">
                <div className="bg-primary/10 p-3 rounded-lg text-primary">
                  <span className="material-symbols-outlined">shield</span>
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 dark:text-white">
                    Security
                  </h4>
                  <p className="text-sm text-slate-500">
                    Update password and manage security keys
                  </p>
                </div>
                <span className="material-symbols-outlined ml-auto text-slate-400">
                  chevron_right
                </span>
              </div>
              <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-100 dark:border-slate-800 flex items-center gap-4">
                <div className="bg-primary/10 p-3 rounded-lg text-primary">
                  <span className="material-symbols-outlined">payments</span>
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 dark:text-white">
                    Billing
                  </h4>
                  <p className="text-sm text-slate-500">
                    Manage subscriptions and payment methods
                  </p>
                </div>
                <span className="material-symbols-outlined ml-auto text-slate-400">
                  chevron_right
                </span>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-12 py-8 border-t border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-sm text-slate-400">
            © 2024 DishHub. Crafted for food lovers everywhere.
          </p>
        </div>
      </footer>
    </div>
  );
};
