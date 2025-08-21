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
    <div className="form-section fade-in">
      <h3>
        <svg className="section-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        Recipe Photo (Optional)
      </h3>
      <div className="form-group">
        <label htmlFor="photo">Add a Beautiful Photo</label>
        <div className="photo-upload-area">
          {!photoPreview && (
            <div className="upload-placeholder">
              <svg className="upload-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
              <p>Click to upload or drag and drop</p>
              <p className="upload-hint">PNG, JPG, GIF up to 10MB</p>
            </div>
          )}
          <input
            type="file"
            id="photo"
            accept="image/*"
            onChange={handleFileChange}
            className="file-input"
          />
          {photoPreview && (
            <div className="photo-preview">
              <img src={photoPreview} alt="Recipe preview" className="preview-image" />
              <div className="photo-overlay">
                <button type="button" className="change-photo-btn">
                  <svg className="btn-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                  </svg>
                  Change Photo
                </button>
              </div>
            </div>
          )}
        </div>
        <div className="photo-helper">
          <div className="helper-item">
            <svg className="helper-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>A great photo makes your recipe more appealing to others!</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PhotoSection;