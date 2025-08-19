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
    <div className="search-filters-container">
      {/* Search Bar */}
      <div className="search-section">
        <div className="search-input-container">
          <svg 
            className="search-icon"
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
            className="search-input-field"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm("")}
              type="button"
              className="search-clear-button"
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
      <div className="filters-section">
        <div className="filters-header">
          <div>
            <h3 className="filters-title">
              Filter & Sort
            </h3>
            <span className="filters-count">
              {resultCount} {resultCount === 1 ? 'recipe' : 'recipes'} found
            </span>
          </div>
          {hasActiveFilters && (
            <button 
              onClick={clearAllFilters}
              className="clear-filters-btn"
            >
              Clear all filters
            </button>
          )}
        </div>

        <div className="filters-grid">
          {/* Sort By */}
          <div className="filter-group">
            <label htmlFor="sort-select" className="filter-label">
              Sort by
            </label>
            <select
              id="sort-select"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              disabled={disabled}
              className="filter-select"
            >
              <option value="newest">Newest first</option>
              <option value="title">Name (A-Z)</option>
              <option value="cookingTime">Cooking time</option>
            </select>
          </div>

          {/* Category Filter */}
          <div className="filter-group">
            <label htmlFor="category-select" className="filter-label">
              Category
            </label>
            <select
              id="category-select"
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              disabled={disabled}
              className="filter-select"
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