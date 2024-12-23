// Pages/UserProfilePage.tsx

import React, { useEffect, useState } from 'react';
import { UserProfile } from '../../Models/UserProfile';
import { UserProfileService } from '../../Service/UserProfileService';
import EditProfileForm from './EditProfileForm';

const UserProfilePage: React.FC = () => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const userId = 'current-user-id'; // Replace with actual logic to retrieve the current user's ID
  const userProfileService = new UserProfileService();

  useEffect(() => {
    const getUserProfile = async () => {
      try {
        const data = await userProfileService.fetchUserProfile(userId);
        setProfile(data);
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError('An unknown error occurred.');
        }
      } finally {
        setLoading(false);
      }
    };

    getUserProfile();
  }, [userId, userProfileService]);

  const handleUpdateProfile = async (updatedProfile: UserProfile) => {
    try {
      const data = await userProfileService.updateUserProfile(updatedProfile);
      setProfile(data);
      // Optionally, display a success message
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unknown error occurred while updating the profile.');
      }
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!profile) return <div>No profile data available.</div>;

  return (
    <div>
      <h1>{profile.username}'s Profile</h1>
      {profile.avatarUrl && <img src={profile.avatarUrl} alt={`${profile.username}'s avatar`} />}
      <p>Email: {profile.email}</p>
      <p>Bio: {profile.bio || 'No bio provided.'}</p>
      <EditProfileForm profile={profile} onUpdate={handleUpdateProfile} />
    </div>
  );
};

export default UserProfilePage;
