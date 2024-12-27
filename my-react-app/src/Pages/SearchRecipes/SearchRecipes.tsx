import axios from 'axios';
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { RecipeResponse } from '../../Models/RecipeResponse';
import { notify } from '../../Utiles/notif';
import { RootState } from '../Redux/RootState';

const SearchRecipes: React.FC = () => {
  const [title, setTitle] = useState<string>('');
  const [results, setResults] = useState<RecipeResponse[]>([]);
  const [error, setError] = useState<string>('');
  const token = useSelector((state: RootState) => state.auth.token);

  const handleSearch = async () => {
    try {
      setError('');
      setResults([]);

      if (!title.trim()) {
        setError('Please enter a title to search.');
        return;
      }
      if (!token) {
        setError('Authentication token is missing. Please log in.');
        return;
      }

      const response = await axios.get<RecipeResponse[]>(
        `/api/recipes/search?title=${encodeURIComponent(title)}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      if (response.data.length === 0) {
        setError(`No recipes found with the title containing "${title}"`);
        notify.error(`No recipes found with the title containing "${title}"`);
      } else {
        setResults(response.data);
        notify.success('Recipes found!');
      }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      console.error('Error searching recipes:', err);
      setError(err?.response?.data || 'An unexpected error occurred while searching for recipes.');
      notify.error('An unexpected error occurred while searching for recipes.');
    }
  };

  return (
    <div style={{ margin: '1rem' }}>
      <h2>Search Recipes</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <div>
        <label>Title: </label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <button onClick={handleSearch}>Search</button>
      </div>

      {results.length > 0 && (
        <div style={{ marginTop: '1rem' }}>
          <h3>Results:</h3>
          <ul>
            {results.map((recipe) => (
              <li key={recipe.id}>
                <strong>{recipe.title}</strong> - {recipe.description}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default SearchRecipes;
