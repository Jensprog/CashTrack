/**
 * @file Component is responsible for handling gravatar or custom avatars.
 */

import CryptoJS from 'crypto-js';
import { useAuth } from '@/context/AuthContext';
import api from '@/lib/axiosConfig';

export const UserAvatar = ({
  email,
  size = 40,
  className = '',
  showUploadButton = false,
  onAvatarChange,
}) => {
  const { customAvatar, updateAvatar } = useAuth();
  const hash = email ? CryptoJS.MD5(email.toLowerCase().trim()).toString() : '';
  const gravatarUrl = email ? `https://www.gravatar.com/avatar/${hash}?s=${size}&d=identicon` : '';

  const avatarSrc = customAvatar || gravatarUrl;

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = async (e) => {
        const avatarData = e.target.result;

        try {
          await api.put('/auth/upload-avatar', {
            avatar: avatarData,
          });

          updateAvatar(avatarData);

          if (onAvatarChange) {
            onAvatarChange(avatarData);
          }
        } catch (error) {
          console.error('Avatar upload failed:', error);
          alert('Failed to upload avatar. Please try again.');
        }
      };
      reader.readAsDataURL(file);
    }
  };

  if (showUploadButton) {
    return (
      <div className="flex flex-col items-center space-y-4">
        <img
          src={avatarSrc}
          alt="Profile"
          className={`rounded-full ${className}`}
          style={{ width: size, height: size }}
        />
        <div>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
            id="avatar-upload"
          />
          <label
            htmlFor="avatar-upload"
            className="cursor-pointer bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
          >
            Byt bild
          </label>
        </div>
      </div>
    );
  }

  return <img src={avatarSrc} alt="Profile" className={`rounded-full ${className}`} />;
};
