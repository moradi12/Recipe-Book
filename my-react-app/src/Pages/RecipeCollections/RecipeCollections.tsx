import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCollections } from '../../hooks/useCollections';
import { useAuth } from '../../hooks/useAuth';
import './RecipeCollections.css';

const RecipeCollections: React.FC = () => {
  const navigate = useNavigate();
  const { requireAuth } = useAuth();
  const [activeTab, setActiveTab] = useState<'collections' | 'meal-plans' | 'shopping-lists'>('collections');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [createType, setCreateType] = useState<'collection' | 'meal-plan' | 'shopping-list'>('collection');

  const {
    collections,
    mealPlans,
    shoppingLists,
    loading,
    actionLoading,
    createCollection,
    deleteCollection,
    createMealPlan,
    createShoppingList,
    generateShoppingListFromMealPlan
  } = useCollections();

  const [newItem, setNewItem] = useState({
    name: '',
    description: '',
    isPublic: false,
    tags: '',
    startDate: '',
    endDate: ''
  });

  const handleCreateItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!requireAuth()) return;

    let result = false;

    try {
      if (createType === 'collection') {
        result = await createCollection({
          name: newItem.name,
          description: newItem.description,
          isPublic: newItem.isPublic,
          tags: newItem.tags.split(',').map(tag => tag.trim()).filter(tag => tag)
        });
      } else if (createType === 'meal-plan') {
        result = await createMealPlan({
          name: newItem.name,
          description: newItem.description,
          startDate: newItem.startDate,
          endDate: newItem.endDate
        });
      } else if (createType === 'shopping-list') {
        result = await createShoppingList({
          name: newItem.name
        });
      }

      if (result) {
        setShowCreateModal(false);
        setNewItem({
          name: '',
          description: '',
          isPublic: false,
          tags: '',
          startDate: '',
          endDate: ''
        });
      }
    } catch (error) {
      console.error('Error creating item:', error);
    }
  };

  const openCreateModal = (type: 'collection' | 'meal-plan' | 'shopping-list') => {
    setCreateType(type);
    setShowCreateModal(true);
  };

  if (loading) {
    return (
      <div className="collections-loading">
        <div className="loading-spinner"></div>
        <p>Loading your collections...</p>
      </div>
    );
  }

  return (
    <div className="recipe-collections-page">
      {/* Header */}
      <div className="collections-header">
        <div className="header-content">
          <h1>My Recipe Collections</h1>
          <p>Organize your recipes, plan your meals, and create shopping lists</p>
        </div>
        <div className="header-actions">
          <button 
            className="create-btn primary"
            onClick={() => openCreateModal('collection')}
          >
            + New Collection
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="collections-navigation">
        <nav className="collections-tabs">
          <button 
            className={`tab-button ${activeTab === 'collections' ? 'active' : ''}`}
            onClick={() => setActiveTab('collections')}
          >
            <span className="tab-icon">📚</span>
            Collections ({collections.length})
          </button>
          <button 
            className={`tab-button ${activeTab === 'meal-plans' ? 'active' : ''}`}
            onClick={() => setActiveTab('meal-plans')}
          >
            <span className="tab-icon">🗓️</span>
            Meal Plans ({mealPlans.length})
          </button>
          <button 
            className={`tab-button ${activeTab === 'shopping-lists' ? 'active' : ''}`}
            onClick={() => setActiveTab('shopping-lists')}
          >
            <span className="tab-icon">🛒</span>
            Shopping Lists ({shoppingLists.length})
          </button>
        </nav>
      </div>

      {/* Content */}
      <div className="collections-content">
        {activeTab === 'collections' && (
          <div className="collections-tab">
            <div className="tab-header">
              <h2>Recipe Collections</h2>
              <div className="tab-actions">
                <button 
                  className="create-btn secondary"
                  onClick={() => openCreateModal('collection')}
                >
                  + Create Collection
                </button>
              </div>
            </div>

            {collections.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">📚</div>
                <h3>No collections yet</h3>
                <p>Create your first collection to organize your favorite recipes</p>
                <button 
                  className="create-btn primary"
                  onClick={() => openCreateModal('collection')}
                >
                  Create Collection
                </button>
              </div>
            ) : (
              <div className="collections-grid">
                {collections.map((collection) => (
                  <div key={collection.id} className="collection-card">
                    <div className="collection-header">
                      {collection.coverImage && (
                        <div className="collection-cover">
                          <img src={collection.coverImage} alt={collection.name} />
                        </div>
                      )}
                      <div className="collection-info">
                        <h3>{collection.name}</h3>
                        {collection.description && (
                          <p className="collection-description">{collection.description}</p>
                        )}
                      </div>
                    </div>

                    <div className="collection-meta">
                      <span className="recipe-count">
                        📖 {collection.recipeCount} recipes
                      </span>
                      <span className={`visibility ${collection.isPublic ? 'public' : 'private'}`}>
                        {collection.isPublic ? '🌍 Public' : '🔒 Private'}
                      </span>
                    </div>

                    {collection.tags.length > 0 && (
                      <div className="collection-tags">
                        {collection.tags.slice(0, 3).map((tag, index) => (
                          <span key={index} className="tag">
                            {tag}
                          </span>
                        ))}
                        {collection.tags.length > 3 && (
                          <span className="tag more">+{collection.tags.length - 3}</span>
                        )}
                      </div>
                    )}

                    <div className="collection-actions">
                      <button 
                        className="action-btn view"
                        onClick={() => navigate(`/collections/${collection.id}`)}
                      >
                        View
                      </button>
                      <button 
                        className="action-btn edit"
                        onClick={() => navigate(`/collections/${collection.id}/edit`)}
                      >
                        Edit
                      </button>
                      <button 
                        className="action-btn delete"
                        onClick={() => deleteCollection(collection.id)}
                        disabled={actionLoading}
                      >
                        Delete
                      </button>
                    </div>

                    <div className="collection-footer">
                      <span className="created-date">
                        Created {new Date(collection.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'meal-plans' && (
          <div className="meal-plans-tab">
            <div className="tab-header">
              <h2>Meal Plans</h2>
              <div className="tab-actions">
                <button 
                  className="create-btn secondary"
                  onClick={() => openCreateModal('meal-plan')}
                >
                  + Create Meal Plan
                </button>
              </div>
            </div>

            {mealPlans.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">🗓️</div>
                <h3>No meal plans yet</h3>
                <p>Plan your weekly meals and stay organized</p>
                <button 
                  className="create-btn primary"
                  onClick={() => openCreateModal('meal-plan')}
                >
                  Create Meal Plan
                </button>
              </div>
            ) : (
              <div className="meal-plans-grid">
                {mealPlans.map((plan) => (
                  <div key={plan.id} className="meal-plan-card">
                    <div className="meal-plan-header">
                      <h3>{plan.name}</h3>
                      {plan.description && (
                        <p className="meal-plan-description">{plan.description}</p>
                      )}
                    </div>

                    <div className="meal-plan-dates">
                      <span className="date-range">
                        📅 {new Date(plan.startDate).toLocaleDateString()} - {new Date(plan.endDate).toLocaleDateString()}
                      </span>
                    </div>

                    <div className="meal-plan-actions">
                      <button 
                        className="action-btn view"
                        onClick={() => navigate(`/meal-plans/${plan.id}`)}
                      >
                        View Plan
                      </button>
                      <button 
                        className="action-btn edit"
                        onClick={() => navigate(`/meal-plans/${plan.id}/edit`)}
                      >
                        Edit
                      </button>
                      <button 
                        className="action-btn generate"
                        onClick={() => generateShoppingListFromMealPlan(plan.id)}
                        disabled={actionLoading}
                      >
                        Generate Shopping List
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'shopping-lists' && (
          <div className="shopping-lists-tab">
            <div className="tab-header">
              <h2>Shopping Lists</h2>
              <div className="tab-actions">
                <button 
                  className="create-btn secondary"
                  onClick={() => openCreateModal('shopping-list')}
                >
                  + Create Shopping List
                </button>
              </div>
            </div>

            {shoppingLists.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">🛒</div>
                <h3>No shopping lists yet</h3>
                <p>Create shopping lists for your recipes and meal plans</p>
                <button 
                  className="create-btn primary"
                  onClick={() => openCreateModal('shopping-list')}
                >
                  Create Shopping List
                </button>
              </div>
            ) : (
              <div className="shopping-lists-grid">
                {shoppingLists.map((list) => (
                  <div key={list.id} className="shopping-list-card">
                    <div className="shopping-list-header">
                      <h3>{list.name}</h3>
                      <span className={`status ${list.isCompleted ? 'completed' : 'pending'}`}>
                        {list.isCompleted ? '✅ Completed' : '⏳ Pending'}
                      </span>
                    </div>

                    <div className="shopping-list-stats">
                      <span className="item-count">
                        📝 {list.items.length} items
                      </span>
                      <span className="checked-count">
                        ✅ {list.items.filter(item => item.isChecked).length} checked
                      </span>
                    </div>

                    <div className="shopping-list-preview">
                      {list.items.slice(0, 3).map((item) => (
                        <div key={item.id} className={`preview-item ${item.isChecked ? 'checked' : ''}`}>
                          <span className="item-name">{item.ingredient}</span>
                          <span className="item-quantity">{item.quantity} {item.unit}</span>
                        </div>
                      ))}
                      {list.items.length > 3 && (
                        <div className="preview-more">
                          +{list.items.length - 3} more items
                        </div>
                      )}
                    </div>

                    <div className="shopping-list-actions">
                      <button 
                        className="action-btn view"
                        onClick={() => navigate(`/shopping-lists/${list.id}`)}
                      >
                        View List
                      </button>
                      <button 
                        className="action-btn edit"
                        onClick={() => navigate(`/shopping-lists/${list.id}/edit`)}
                      >
                        Edit
                      </button>
                    </div>

                    <div className="shopping-list-footer">
                      <span className="created-date">
                        Created {new Date(list.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Create Modal */}
      {showCreateModal && (
        <div className="modal-overlay">
          <div className="create-modal">
            <div className="modal-header">
              <h3>
                Create New {createType === 'collection' ? 'Collection' : 
                           createType === 'meal-plan' ? 'Meal Plan' : 'Shopping List'}
              </h3>
              <button 
                className="modal-close"
                onClick={() => setShowCreateModal(false)}
              >
                ×
              </button>
            </div>

            <form onSubmit={handleCreateItem} className="create-form">
              <div className="form-group">
                <label htmlFor="name">Name *</label>
                <input
                  type="text"
                  id="name"
                  value={newItem.name}
                  onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                  placeholder={`Enter ${createType === 'collection' ? 'collection' : 
                                       createType === 'meal-plan' ? 'meal plan' : 'shopping list'} name`}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="description">Description</label>
                <textarea
                  id="description"
                  value={newItem.description}
                  onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
                  placeholder="Optional description"
                  rows={3}
                />
              </div>

              {createType === 'collection' && (
                <>
                  <div className="form-group">
                    <label htmlFor="tags">Tags</label>
                    <input
                      type="text"
                      id="tags"
                      value={newItem.tags}
                      onChange={(e) => setNewItem({ ...newItem, tags: e.target.value })}
                      placeholder="Enter tags separated by commas"
                    />
                  </div>

                  <div className="form-group checkbox">
                    <label htmlFor="isPublic">
                      <input
                        type="checkbox"
                        id="isPublic"
                        checked={newItem.isPublic}
                        onChange={(e) => setNewItem({ ...newItem, isPublic: e.target.checked })}
                      />
                      Make this collection public
                    </label>
                  </div>
                </>
              )}

              {createType === 'meal-plan' && (
                <>
                  <div className="form-group">
                    <label htmlFor="startDate">Start Date *</label>
                    <input
                      type="date"
                      id="startDate"
                      value={newItem.startDate}
                      onChange={(e) => setNewItem({ ...newItem, startDate: e.target.value })}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="endDate">End Date *</label>
                    <input
                      type="date"
                      id="endDate"
                      value={newItem.endDate}
                      onChange={(e) => setNewItem({ ...newItem, endDate: e.target.value })}
                      required
                    />
                  </div>
                </>
              )}

              <div className="modal-actions">
                <button 
                  type="button" 
                  className="btn-cancel"
                  onClick={() => setShowCreateModal(false)}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="btn-create"
                  disabled={actionLoading}
                >
                  {actionLoading ? 'Creating...' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default RecipeCollections;