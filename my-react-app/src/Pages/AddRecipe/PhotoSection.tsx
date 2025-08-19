import React, { useState, useCallback } from 'react';

interface PhotoSectionProps {
  onPhotoChange?: (file: File) => void;
}

const PhotoSection: React.FC<PhotoSectionProps> = ({ onPhotoChange }) => {
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setPhotoPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
      
      // Notify parent component
      onPhotoChange?.(file);
    }
  }, [onPhotoChange]);

  return (
    <div className="form-section">
      <h3>Photo (Optional)</h3>
      <div className="form-group">
        <label htmlFor="photo">Photo</label>
        <input
          type="file"
          id="photo"
          accept="image/*"
          onChange={handleFileChange}
        />
        {photoPreview && (
          <div className="photo-preview">
            <img src={photoPreview} alt="Preview" className="preview-image" />
          </div>
        )}
      </div>
    </div>
  );
};

export default PhotoSection;