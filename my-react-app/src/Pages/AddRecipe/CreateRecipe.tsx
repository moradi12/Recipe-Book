import React, { useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import { Category } from "../../Models/Category";
import RecipeService from "../../Service/RecipeService";
import { notify } from "../../Utiles/notif";

import useRecipeForm from "../Redux/Hooks/useRecipeForm";

import CategorySelect from "./CategorySelect";
import ErrorMessages from "./ErrorMessages";
import IngredientsList from "./IngredientsList";
import PhotoUploader from "./PhotoUploader";

interface AuthState {
  isLogged: boolean;
}

interface RootState {
  auth: AuthState;
}

const CreateRecipe: React.FC = () => {
  const auth = useSelector((state: RootState) => state.auth);
  const navigate = useNavigate();

  const {
    form,
    setForm,
    errors,
    isSubmitting,
    handleChange,
    addIngredient,
    removeIngredient,
    handleIngredientChange,
  } = useRecipeForm();

  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | "">("");
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);

  useEffect(() => {
    const token = sessionStorage.getItem("jwt");
    if (!auth.isLogged && !token) {
      notify.error("You must log in to create a recipe.");
      navigate("/login");
    }
  }, [auth.isLogged, navigate]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await RecipeService.getAllCategories();
        setCategories(response.data);
      } catch (err) {
        console.error("Error fetching categories:", err);
        setCategories([]);
      }
    };
    fetchCategories();
  }, []);

  const handleCategoryChange = useCallback((value: string) => {
    const parsedValue = Number(value);
    if (!isNaN(parsedValue)) {
      setSelectedCategoryId(parsedValue);
    } else {
      setSelectedCategoryId("");
    }
  }, []);

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (selectedCategoryId === "") {
      notify.error("Please select a valid category.");
      return;
    }

    const finalForm = {
      ...form,
      categoryIds: [selectedCategoryId],
    };

    const token = sessionStorage.getItem("jwt");
    if (!token) {
      notify.error("Please log in to create a recipe.");
      navigate("/login");
      return;
    }

    try {
      const response = await RecipeService.createRecipe(finalForm, token);
      console.log("Created Recipe Response:", response.data);
      notify.success("Recipe created successfully!");
      navigate("/all/recipes");
    } catch (error) {
      console.error("Error creating recipe:", error);
      notify.error("Failed to create recipe. Please try again.");
    }
  };

  const handlePhotoChange = (file: File) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        const fullResult = reader.result;
        const base64Part = fullResult.split(",")[1] || "";

        setForm((prev) => ({
          ...prev,
          photo: base64Part,
        }));
        setPhotoPreview(fullResult);
      }
    };
    reader.readAsDataURL(file);
  };

  if (!auth.isLogged && !sessionStorage.getItem("jwt")) {
    return null;
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 50%, #667eea 100%)',
      padding: '30px 15px',
      fontFamily: 'var(--font-primary)'
    }}>
      {/* Decorative Background Elements */}
      <div style={{
        position: 'fixed',
        top: '20%',
        left: '10%',
        width: '200px',
        height: '200px',
        background: 'rgba(255, 255, 255, 0.05)',
        borderRadius: '50%',
        filter: 'blur(1px)',
        animation: 'float 15s ease-in-out infinite',
        zIndex: 0
      }} />
      <div style={{
        position: 'fixed',
        bottom: '15%',
        right: '8%',
        width: '150px',
        height: '150px',
        background: 'rgba(255, 255, 255, 0.03)',
        borderRadius: '50%',
        filter: 'blur(1px)',
        animation: 'float 12s ease-in-out infinite reverse',
        zIndex: 0
      }} />

      {/* Main Container */}
      <div style={{
        maxWidth: '900px',
        margin: '0 auto',
        background: 'rgba(255, 255, 255, 0.98)',
        borderRadius: '20px',
        boxShadow: '0 15px 35px rgba(0, 0, 0, 0.1)',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        overflow: 'hidden',
        position: 'relative',
        zIndex: 1
      }}>
        {/* Header */}
        <div style={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          padding: '40px 30px',
          textAlign: 'center',
          color: 'white'
        }}>
          <div style={{
            width: '70px',
            height: '70px',
            background: 'rgba(255, 255, 255, 0.2)',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 20px',
            fontSize: '28px',
            backdropFilter: 'blur(10px)'
          }}>
            👨‍🍳
          </div>
          <h1 style={{
            fontSize: '2.2rem',
            fontWeight: '700',
            marginBottom: '8px',
            fontFamily: 'var(--font-heading)'
          }}>
            Recipe Creator
          </h1>
          <p style={{
            fontSize: '1rem',
            opacity: 0.9,
            margin: 0
          }}>
            Bring your culinary vision to life
          </p>
        </div>

        {/* Form Container */}
        <div style={{ padding: '40px 30px' }}>
          <ErrorMessages errors={errors} />

          <form onSubmit={handleFormSubmit}>
            {/* Form Grid Layout */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '30px',
              marginBottom: '30px'
            }}>
              {/* Left Column */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '25px' }}>
                {/* Recipe Title */}
                <div style={{
                  padding: '25px',
                  background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
                  borderRadius: '16px',
                  border: '1px solid #e2e8f0'
                }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    marginBottom: '15px'
                  }}>
                    <span style={{ fontSize: '20px' }}>📝</span>
                    <label style={{
                      fontSize: '1.1rem',
                      fontWeight: '700',
                      color: '#1a202c'
                    }}>
                      Recipe Title <span style={{ color: '#e53e3e' }}>*</span>
                    </label>
                  </div>
                  <input
                    type="text"
                    id="title"
                    value={form.title}
                    onChange={handleChange}
                    required
                    style={{
                      width: '100%',
                      padding: '15px 18px',
                      border: `2px solid ${errors.title ? '#e53e3e' : '#cbd5e0'}`,
                      borderRadius: '10px',
                      fontSize: '1rem',
                      transition: 'all 0.2s ease',
                      outline: 'none',
                      background: 'white',
                      boxSizing: 'border-box'
                    }}
                    onFocus={(e) => {
                      if (!errors.title) {
                        e.target.style.borderColor = '#667eea';
                        e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)';
                      }
                    }}
                    onBlur={(e) => {
                      if (!errors.title) {
                        e.target.style.borderColor = '#cbd5e0';
                        e.target.style.boxShadow = 'none';
                      }
                    }}
                    placeholder="My Amazing Recipe"
                  />
                  {errors.title && (
                    <p style={{ color: '#e53e3e', fontSize: '0.85rem', margin: '8px 0 0', fontWeight: '500' }}>
                      {errors.title}
                    </p>
                  )}
                </div>

                {/* Cooking Time & Servings */}
                <div style={{
                  padding: '25px',
                  background: 'linear-gradient(135deg, #fff5f5 0%, #fed7d7 100%)',
                  borderRadius: '16px',
                  border: '1px solid #feb2b2'
                }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    marginBottom: '20px'
                  }}>
                    <span style={{ fontSize: '20px' }}>⏱️</span>
                    <h3 style={{
                      fontSize: '1.1rem',
                      fontWeight: '700',
                      color: '#1a202c',
                      margin: 0
                    }}>
                      Time & Servings
                    </h3>
                  </div>
                  
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                    <div>
                      <label style={{
                        display: 'block',
                        fontSize: '0.9rem',
                        fontWeight: '600',
                        color: '#4a5568',
                        marginBottom: '8px'
                      }}>
                        Cooking Time <span style={{ color: '#e53e3e' }}>*</span>
                      </label>
                      <div style={{ position: 'relative' }}>
                        <input
                          type="number"
                          id="cookingTime"
                          value={form.cookingTime}
                          onChange={handleChange}
                          min="1"
                          required
                          style={{
                            width: '100%',
                            padding: '12px 15px',
                            paddingRight: '50px',
                            border: `2px solid ${errors.cookingTime ? '#e53e3e' : '#cbd5e0'}`,
                            borderRadius: '8px',
                            fontSize: '1rem',
                            outline: 'none',
                            background: 'white',
                            boxSizing: 'border-box'
                          }}
                          placeholder="30"
                        />
                        <span style={{
                          position: 'absolute',
                          right: '15px',
                          top: '50%',
                          transform: 'translateY(-50%)',
                          color: '#718096',
                          fontSize: '0.85rem',
                          fontWeight: '500'
                        }}>
                          mins
                        </span>
                      </div>
                    </div>

                    <div>
                      <label style={{
                        display: 'block',
                        fontSize: '0.9rem',
                        fontWeight: '600',
                        color: '#4a5568',
                        marginBottom: '8px'
                      }}>
                        Servings <span style={{ color: '#e53e3e' }}>*</span>
                      </label>
                      <div style={{ position: 'relative' }}>
                        <input
                          type="number"
                          id="servings"
                          value={form.servings}
                          onChange={handleChange}
                          min="1"
                          required
                          style={{
                            width: '100%',
                            padding: '12px 15px',
                            paddingRight: '60px',
                            border: `2px solid ${errors.servings ? '#e53e3e' : '#cbd5e0'}`,
                            borderRadius: '8px',
                            fontSize: '1rem',
                            outline: 'none',
                            background: 'white',
                            boxSizing: 'border-box'
                          }}
                          placeholder="4"
                        />
                        <span style={{
                          position: 'absolute',
                          right: '15px',
                          top: '50%',
                          transform: 'translateY(-50%)',
                          color: '#718096',
                          fontSize: '0.85rem',
                          fontWeight: '500'
                        }}>
                          people
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Category & Options */}
                <div style={{
                  padding: '25px',
                  background: 'linear-gradient(135deg, #f0fff4 0%, #c6f6d5 100%)',
                  borderRadius: '16px',
                  border: '1px solid #9ae6b4'
                }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    marginBottom: '20px'
                  }}>
                    <span style={{ fontSize: '20px' }}>🏷️</span>
                    <h3 style={{
                      fontSize: '1.1rem',
                      fontWeight: '700',
                      color: '#1a202c',
                      margin: 0
                    }}>
                      Category & Options
                    </h3>
                  </div>

                  <div style={{ marginBottom: '15px' }}>
                    <CategorySelect
                      categories={categories}
                      selectedCategoryId={selectedCategoryId}
                      onChange={handleCategoryChange}
                      error={errors.category}
                    />
                  </div>

                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '15px',
                    padding: '15px',
                    background: 'rgba(255, 255, 255, 0.7)',
                    borderRadius: '10px',
                    border: '1px solid #e2e8f0'
                  }}>
                    <input
                      type="checkbox"
                      id="containsGluten"
                      checked={form.containsGluten}
                      onChange={handleChange}
                      style={{
                        width: '18px',
                        height: '18px',
                        accentColor: '#667eea'
                      }}
                    />
                    <label htmlFor="containsGluten" style={{
                      fontSize: '1rem',
                      fontWeight: '600',
                      color: '#2d3748',
                      cursor: 'pointer'
                    }}>
                      Contains Gluten
                    </label>
                  </div>
                </div>

                {/* Dietary Information */}
                <div style={{
                  padding: '25px',
                  background: 'linear-gradient(135deg, #fffaf0 0%, #feebc8 100%)',
                  borderRadius: '16px',
                  border: '1px solid #f6e05e'
                }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    marginBottom: '15px'
                  }}>
                    <span style={{ fontSize: '20px' }}>🥗</span>
                    <label style={{
                      fontSize: '1.1rem',
                      fontWeight: '700',
                      color: '#1a202c'
                    }}>
                      Dietary Information
                    </label>
                  </div>
                  <input
                    type="text"
                    id="dietaryInfo"
                    value={form.dietaryInfo}
                    placeholder="Vegan, Gluten-Free, Keto..."
                    onChange={handleChange}
                    style={{
                      width: '100%',
                      padding: '15px 18px',
                      border: '2px solid #cbd5e0',
                      borderRadius: '10px',
                      fontSize: '1rem',
                      outline: 'none',
                      background: 'white',
                      boxSizing: 'border-box'
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = '#667eea';
                      e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)';
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = '#cbd5e0';
                      e.target.style.boxShadow = 'none';
                    }}
                  />
                </div>
              </div>

              {/* Right Column */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '25px' }}>
                {/* Description */}
                <div style={{
                  padding: '25px',
                  background: 'linear-gradient(135deg, #ebf8ff 0%, #bee3f8 100%)',
                  borderRadius: '16px',
                  border: '1px solid #90cdf4'
                }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    marginBottom: '15px'
                  }}>
                    <span style={{ fontSize: '20px' }}>📖</span>
                    <label style={{
                      fontSize: '1.1rem',
                      fontWeight: '700',
                      color: '#1a202c'
                    }}>
                      Description <span style={{ color: '#e53e3e' }}>*</span>
                    </label>
                  </div>
                  <textarea
                    id="description"
                    value={form.description}
                    onChange={handleChange}
                    required
                    rows={4}
                    style={{
                      width: '100%',
                      padding: '15px 18px',
                      border: `2px solid ${errors.description ? '#e53e3e' : '#cbd5e0'}`,
                      borderRadius: '10px',
                      fontSize: '1rem',
                      outline: 'none',
                      background: 'white',
                      boxSizing: 'border-box',
                      resize: 'vertical',
                      fontFamily: 'inherit',
                      lineHeight: '1.5'
                    }}
                    onFocus={(e) => {
                      if (!errors.description) {
                        e.target.style.borderColor = '#667eea';
                        e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)';
                      }
                    }}
                    onBlur={(e) => {
                      if (!errors.description) {
                        e.target.style.borderColor = '#cbd5e0';
                        e.target.style.boxShadow = 'none';
                      }
                    }}
                    placeholder="Tell us about your recipe - what makes it special?"
                  />
                  {errors.description && (
                    <p style={{ color: '#e53e3e', fontSize: '0.85rem', margin: '8px 0 0', fontWeight: '500' }}>
                      {errors.description}
                    </p>
                  )}
                </div>

                {/* Ingredients */}
                <div style={{
                  padding: '25px',
                  background: 'linear-gradient(135deg, #f7fafc 0%, #edf2f7 100%)',
                  borderRadius: '16px',
                  border: '1px solid #e2e8f0'
                }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    marginBottom: '15px'
                  }}>
                    <span style={{ fontSize: '20px' }}>🥄</span>
                    <h3 style={{
                      fontSize: '1.1rem',
                      fontWeight: '700',
                      color: '#1a202c',
                      margin: 0
                    }}>
                      Ingredients <span style={{ color: '#e53e3e' }}>*</span>
                    </h3>
                  </div>
                  <IngredientsList
                    ingredients={form.ingredients}
                    onIngredientChange={handleIngredientChange}
                    onRemoveIngredient={removeIngredient}
                    onAddIngredient={addIngredient}
                    error={errors.ingredients}
                  />
                </div>

                {/* Photo Upload */}
                <div style={{
                  padding: '25px',
                  background: 'linear-gradient(135deg, #faf5ff 0%, #e9d8fd 100%)',
                  borderRadius: '16px',
                  border: '1px solid #d6bcfa'
                }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    marginBottom: '15px'
                  }}>
                    <span style={{ fontSize: '20px' }}>📸</span>
                    <h3 style={{
                      fontSize: '1.1rem',
                      fontWeight: '700',
                      color: '#1a202c',
                      margin: 0
                    }}>
                      Photo
                    </h3>
                  </div>
                  <PhotoUploader
                    onPhotoChange={handlePhotoChange}
                    photoPreview={photoPreview}
                  />
                </div>
              </div>
            </div>

            {/* Preparation Steps - Full Width */}
            <div style={{
              padding: '25px',
              background: 'linear-gradient(135deg, #f0f9ff 0%, #dbeafe 100%)',
              borderRadius: '16px',
              border: '1px solid #93c5fd',
              marginBottom: '30px'
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                marginBottom: '15px'
              }}>
                <span style={{ fontSize: '20px' }}>👩‍🍳</span>
                <label style={{
                  fontSize: '1.1rem',
                  fontWeight: '700',
                  color: '#1a202c'
                }}>
                  Preparation Steps <span style={{ color: '#e53e3e' }}>*</span>
                </label>
              </div>
              <textarea
                id="preparationSteps"
                value={form.preparationSteps}
                onChange={handleChange}
                required
                rows={6}
                style={{
                  width: '100%',
                  padding: '15px 18px',
                  border: `2px solid ${errors.preparationSteps ? '#e53e3e' : '#cbd5e0'}`,
                  borderRadius: '10px',
                  fontSize: '1rem',
                  outline: 'none',
                  background: 'white',
                  boxSizing: 'border-box',
                  resize: 'vertical',
                  fontFamily: 'inherit',
                  lineHeight: '1.6'
                }}
                onFocus={(e) => {
                  if (!errors.preparationSteps) {
                    e.target.style.borderColor = '#667eea';
                    e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)';
                  }
                }}
                onBlur={(e) => {
                  if (!errors.preparationSteps) {
                    e.target.style.borderColor = '#cbd5e0';
                    e.target.style.boxShadow = 'none';
                  }
                }}
                placeholder="1. Preheat oven to 350°F
2. Mix dry ingredients in a large bowl
3. Add wet ingredients and stir until combined
4. Pour into prepared pan and bake for 25-30 minutes"
              />
              {errors.preparationSteps && (
                <p style={{ color: '#e53e3e', fontSize: '0.85rem', margin: '8px 0 0', fontWeight: '500' }}>
                  {errors.preparationSteps}
                </p>
              )}
            </div>

            {/* Submit Section */}
            <div>
              {errors.submit && (
                <div style={{
                  background: '#fed7d7',
                  border: '2px solid #e53e3e',
                  color: '#c53030',
                  padding: '15px 20px',
                  borderRadius: '12px',
                  fontSize: '1rem',
                  fontWeight: '600',
                  textAlign: 'center',
                  marginBottom: '20px'
                }}>
                  {errors.submit}
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                style={{
                  width: '100%',
                  padding: '18px',
                  background: isSubmitting 
                    ? '#a0aec0' 
                    : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '12px',
                  fontSize: '1.2rem',
                  fontWeight: '700',
                  cursor: isSubmitting ? 'not-allowed' : 'pointer',
                  transition: 'all 0.3s ease',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '12px',
                  boxShadow: isSubmitting ? 'none' : '0 6px 20px rgba(102, 126, 234, 0.4)'
                }}
                onMouseEnter={(e) => {
                  if (!isSubmitting) {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = '0 8px 25px rgba(102, 126, 234, 0.6)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isSubmitting) {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 6px 20px rgba(102, 126, 234, 0.4)';
                  }
                }}
              >
                {isSubmitting ? (
                  <>
                    <div style={{
                      width: '20px',
                      height: '20px',
                      border: '2px solid rgba(255, 255, 255, 0.3)',
                      borderTop: '2px solid white',
                      borderRadius: '50%',
                      animation: 'spin 1s linear infinite'
                    }} />
                    Publishing Recipe...
                  </>
                ) : (
                  <>
                    <span style={{ fontSize: '1.4rem' }}>🍳</span>
                    Publish Recipe
                    <span style={{ fontSize: '1.2rem' }}>✨</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* CSS Animations */}
      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
          
          @keyframes float {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-10px); }
          }
          
          @media (max-width: 1024px) {
            .form-grid {
              grid-template-columns: 1fr !important;
            }
          }
        `}
      </style>
    </div>
  );
};

export default CreateRecipe;