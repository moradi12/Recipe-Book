import React from "react";

interface PhotoUploaderProps {
  onPhotoChange: (file: File) => void;
  photoPreview: string | null;
}

const PhotoUploader: React.FC<PhotoUploaderProps> = ({
  onPhotoChange,
  photoPreview,
}) => {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onPhotoChange(file);
    }
  };

  return (
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
  );
};

export default PhotoUploader;
