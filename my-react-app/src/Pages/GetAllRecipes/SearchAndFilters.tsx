import React from "react";
// Using global design system instead of component-specific CSS
import { Category } from "../../Models/Category";

interface SearchAndFiltersProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  sortBy: string;
  setSortBy: (sort: string) => void;
  difficultyFilter: string;
  setDifficultyFilter: (difficulty: string) => void;
  timeFilter: string;
  setTimeFilter: (time: string) => void;
  dietaryFilter: string;
  setDietaryFilter: (dietary: string) => void;
  categories: Category[];
  filterCategory: string;
  setFilterCategory: (category: string) => void;
  disabled?: boolean;
  resultCount: number;
}

const SearchAndFilters: React.FC<SearchAndFiltersProps> = ({
  searchTerm,
  setSearchTerm,
  sortBy,
  setSortBy,
  difficultyFilter,
  setDifficultyFilter,
  timeFilter,
  setTimeFilter,
  dietaryFilter,
  setDietaryFilter,
  categories,
  filterCategory,
  setFilterCategory,
  disabled = false,
  resultCount,
}) => {
  const clearAllFilters = () => {
    setSearchTerm("");
    setSortBy("newest");
    setDifficultyFilter("");
    setTimeFilter("");
    setDietaryFilter("");
    setFilterCategory("");
  };

  const hasActiveFilters = searchTerm || sortBy !== "newest" || difficultyFilter || timeFilter || dietaryFilter || filterCategory;

  return (
    <div style={{ marginBottom: 'var(--spacing-3xl)' }}>
      {/* Search Bar */}
      <div style={{ 
        backgroundColor: 'var(--background-primary)',
        border: '1px solid var(--border-light)',
        borderRadius: 'var(--radius-lg)',
        padding: 'var(--spacing-lg)',
        marginBottom: 'var(--spacing-lg)',
        boxShadow: 'var(--shadow-sm)'
      }}>
        <div style={{ position: 'relative', maxWidth: '600px', margin: '0 auto' }}>
          <svg 
            style={{ 
              position: 'absolute',
              left: 'var(--spacing-md)',
              top: '50%',
              transform: 'translateY(-50%)',
              width: '20px',
              height: '20px',
              color: 'var(--text-muted)'
            }}
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor"
          >
            <circle cx="11" cy="11" r="8"></circle>
            <path d="m21 21-4.35-4.35"></path>
          </svg>
          <input
            type="text"
            placeholder="Search recipes, ingredients, or descriptions..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            disabled={disabled}
            style={{
              width: '100%',
              padding: 'var(--spacing-md) var(--spacing-md) var(--spacing-md) 3rem',
              border: '1px solid var(--border-medium)',
              borderRadius: 'var(--radius-md)',
              fontSize: '1rem',
              fontFamily: 'inherit',
              color: 'var(--text-primary)',
              backgroundColor: 'var(--background-primary)',
              transition: 'all var(--transition-normal)',
              outline: 'none'
            }}
            onFocus={(e) => {
              e.target.style.borderColor = 'var(--text-primary)';
              e.target.style.boxShadow = '0 0 0 2px rgba(17, 24, 39, 0.1)';
            }}
            onBlur={(e) => {
              e.target.style.borderColor = 'var(--border-medium)';
              e.target.style.boxShadow = 'none';
            }}
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm("")}
              type="button"
              style={{
                position: 'absolute',
                right: 'var(--spacing-md)',
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: 'var(--text-muted)',
                padding: 'var(--spacing-xs)',
                borderRadius: 'var(--radius-sm)',
                transition: 'color var(--transition-normal)'
              }}
              onMouseEnter={(e) => e.target.style.color = 'var(--text-primary)'}
              onMouseLeave={(e) => e.target.style.color = 'var(--text-muted)'}
            >
              <svg style={{ width: '16px', height: '16px' }} viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* Filters Section */}
      <div style={{ 
        backgroundColor: 'var(--background-primary)',
        border: '1px solid var(--border-light)',
        borderRadius: 'var(--radius-lg)',
        padding: 'var(--spacing-lg)',
        boxShadow: 'var(--shadow-sm)'
      }}>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          marginBottom: 'var(--spacing-lg)',
          flexWrap: 'wrap',
          gap: 'var(--spacing-md)'
        }}>
          <div>
            <h3 style={{ 
              margin: 0, 
              fontSize: '1.125rem', 
              fontWeight: 'var(--font-weight-semibold)',
              color: 'var(--text-primary)',
              marginBottom: 'var(--spacing-xs)'
            }}>
              Filter & Sort
            </h3>
            <span style={{ 
              fontSize: '0.875rem', 
              color: 'var(--text-secondary)'
            }}>
              {resultCount} {resultCount === 1 ? 'recipe' : 'recipes'} found
            </span>
          </div>
          {hasActiveFilters && (
            <button 
              onClick={clearAllFilters}
              style={{
                background: 'none',
                border: '1px solid var(--border-medium)',
                color: 'var(--text-secondary)',
                padding: 'var(--spacing-xs) var(--spacing-md)',
                borderRadius: 'var(--radius-md)',
                fontSize: '0.875rem',
                cursor: 'pointer',
                transition: 'all var(--transition-normal)'
              }}
              onMouseEnter={(e) => {
                e.target.style.borderColor = 'var(--text-primary)';
                e.target.style.color = 'var(--text-primary)';
              }}
              onMouseLeave={(e) => {
                e.target.style.borderColor = 'var(--border-medium)';
                e.target.style.color = 'var(--text-secondary)';
              }}
            >
              Clear all filters
            </button>
          )}
        </div>

        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
          gap: 'var(--spacing-lg)',
          marginBottom: 'var(--spacing-md)'
        }}>
          {/* Sort By */}
          <div>
            <label 
              htmlFor="sort-select"
              style={{
                display: 'block',
                fontSize: '0.875rem',
                fontWeight: 'var(--font-weight-medium)',
                color: 'var(--text-primary)',
                marginBottom: 'var(--spacing-xs)'
              }}
            >
              Sort by
            </label>
            <select
              id="sort-select"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              disabled={disabled}
              style={{
                width: '100%',
                padding: 'var(--spacing-sm) var(--spacing-md)',
                border: '1px solid var(--border-medium)',
                borderRadius: 'var(--radius-md)',
                fontSize: '0.875rem',
                fontFamily: 'inherit',
                color: 'var(--text-primary)',
                backgroundColor: 'var(--background-primary)',
                cursor: 'pointer',
                outline: 'none',
                transition: 'border-color var(--transition-normal)'
              }}
              onFocus={(e) => e.target.style.borderColor = 'var(--text-primary)'}
              onBlur={(e) => e.target.style.borderColor = 'var(--border-medium)'}
            >
              <option value="newest">Newest first</option>
              <option value="title">Name (A-Z)</option>
              <option value="cookingTime">Cooking time</option>
            </select>
          </div>

          {/* Category Filter */}
          <div>
            <label 
              htmlFor="category-select"
              style={{
                display: 'block',
                fontSize: '0.875rem',
                fontWeight: 'var(--font-weight-medium)',
                color: 'var(--text-primary)',
                marginBottom: 'var(--spacing-xs)'
              }}
            >
              Category
            </label>
            <select
              id="category-select"
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              disabled={disabled}
              style={{
                width: '100%',
                padding: 'var(--spacing-sm) var(--spacing-md)',
                border: '1px solid var(--border-medium)',
                borderRadius: 'var(--radius-md)',
                fontSize: '0.875rem',
                fontFamily: 'inherit',
                color: 'var(--text-primary)',
                backgroundColor: 'var(--background-primary)',
                cursor: 'pointer',
                outline: 'none',
                transition: 'border-color var(--transition-normal)'
              }}
              onFocus={(e) => e.target.style.borderColor = 'var(--text-primary)'}
              onBlur={(e) => e.target.style.borderColor = 'var(--border-medium)'}
            >
              <option value="">All categories</option>
              {categories.map((category) => (
                <option key={category.id} value={String(category.id)}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          {/* Cooking Time */}
          <div>
            <label 
              htmlFor="time-select"
              style={{
                display: 'block',
                fontSize: '0.875rem',
                fontWeight: 'var(--font-weight-medium)',
                color: 'var(--text-primary)',
                marginBottom: 'var(--spacing-xs)'
              }}
            >
              Cooking time
            </label>
            <select
              id="time-select"
              value={timeFilter}
              onChange={(e) => setTimeFilter(e.target.value)}
              disabled={disabled}
              style={{
                width: '100%',
                padding: 'var(--spacing-sm) var(--spacing-md)',
                border: '1px solid var(--border-medium)',
                borderRadius: 'var(--radius-md)',
                fontSize: '0.875rem',
                fontFamily: 'inherit',
                color: 'var(--text-primary)',
                backgroundColor: 'var(--background-primary)',
                cursor: 'pointer',
                outline: 'none',
                transition: 'border-color var(--transition-normal)'
              }}
              onFocus={(e) => e.target.style.borderColor = 'var(--text-primary)'}
              onBlur={(e) => e.target.style.borderColor = 'var(--border-medium)'}
            >
              <option value="">Any time</option>
              <option value="quick">Quick (≤30 min)</option>
              <option value="medium">Medium (30-60 min)</option>
              <option value="long">Long (60+ min)</option>
            </select>
          </div>

          {/* Dietary Filter */}
          <div>
            <label 
              htmlFor="dietary-select"
              style={{
                display: 'block',
                fontSize: '0.875rem',
                fontWeight: 'var(--font-weight-medium)',
                color: 'var(--text-primary)',
                marginBottom: 'var(--spacing-xs)'
              }}
            >
              Dietary
            </label>
            <select
              id="dietary-select"
              value={dietaryFilter}
              onChange={(e) => setDietaryFilter(e.target.value)}
              disabled={disabled}
              style={{
                width: '100%',
                padding: 'var(--spacing-sm) var(--spacing-md)',
                border: '1px solid var(--border-medium)',
                borderRadius: 'var(--radius-md)',
                fontSize: '0.875rem',
                fontFamily: 'inherit',
                color: 'var(--text-primary)',
                backgroundColor: 'var(--background-primary)',
                cursor: 'pointer',
                outline: 'none',
                transition: 'border-color var(--transition-normal)'
              }}
              onFocus={(e) => e.target.style.borderColor = 'var(--text-primary)'}
              onBlur={(e) => e.target.style.borderColor = 'var(--border-medium)'}
            >
              <option value="">All dietary types</option>
              <option value="vegetarian">Vegetarian</option>
              <option value="gluten-free">Gluten-free</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchAndFilters;