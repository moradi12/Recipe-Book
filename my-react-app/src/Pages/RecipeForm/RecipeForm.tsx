import { ChangeEvent, Component } from "react";
import { Recipe } from "../../Models/Recipe";
import FormInput from "../FormInput/FormInput";

interface RecipeFormProps {
  recipe: Partial<Recipe>;
  onSubmit: (recipe: Partial<Recipe>) => Promise<void>;
}

interface RecipeFormState {
  recipe: Partial<Recipe>;
  errorMessage: Record<string, string> | null;
  isSubmitting: boolean;
}

class RecipeForm extends Component<RecipeFormProps, RecipeFormState> {
  constructor(props: RecipeFormProps) {
    super(props);
    this.state = {
      recipe: props.recipe || {},
      errorMessage: null,
      isSubmitting: false,
    };
  }

  handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type, files } = e.target as HTMLInputElement;

    if (type === "file" && files) {
      // Handle file input separately
      this.setState((prevState) => ({
        recipe: {
          ...prevState.recipe,
          [name]: files[0], // Store the selected file
        },
      }));
    } else {
      this.setState((prevState) => ({
        recipe: {
          ...prevState.recipe,
          [name]: value,
        },
      }));
    }
  };

  handleNumberInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    const numericValue = Number(value);

    if ((!isNaN(numericValue) && numericValue >= 0) || value === "") {
      this.setState((prevState) => ({
        recipe: {
          ...prevState.recipe,
          [name]: numericValue,
        },
      }));
    }
  };

  handleAddCategory = (category: string) => {
    this.setState((prevState) => ({
      recipe: {
        ...prevState.recipe,
        categories: [...(prevState.recipe.categories || []), category],
      },
    }));
  };

  handleRemoveCategory = (index: number) => {
    this.setState((prevState) => ({
      recipe: {
        ...prevState.recipe,
        categories: (prevState.recipe.categories || []).filter((_, i) => i !== index),
      },
    }));
  };

  validateFields = (): Record<string, string> => {
    const { recipe } = this.state;
    const errors: Record<string, string> = {};

    if (!recipe.name) errors.name = "Recipe name is required.";
    if (!recipe.title) errors.title = "Title is required.";
    if (!recipe.description) errors.description = "Description is required.";
    if (recipe.cookingTime && recipe.cookingTime < 0) {
      errors.cookingTime = "Cooking time must be a positive number.";
    }

    return errors;
  };

  resetForm = () => {
    this.setState({
      recipe: {},
      errorMessage: null,
      isSubmitting: false,
    });
  };

  handleSubmit = async () => {
    const errors = this.validateFields();
    if (Object.keys(errors).length > 0) {
      this.setState({ errorMessage: errors });
      return;
    }

    this.setState({ isSubmitting: true, errorMessage: null });

    try {
      await this.props.onSubmit(this.state.recipe);
      this.resetForm();
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      this.setState({
        errorMessage: { global: "An error occurred while submitting the form." },
        isSubmitting: false,
      });
    }
  };

  render() {
    const { recipe, errorMessage, isSubmitting } = this.state;

    return (
      <div className="recipe-form">
        {errorMessage?.global && <p className="error-message">{errorMessage.global}</p>}

        <FormInput
          label="Recipe Name"
          type="text"
          name="name"
          value={recipe.name || ""}
          onChange={this.handleInputChange}
          placeholder="Enter recipe name"
          ariaLabel="Recipe Name"
        />
        {errorMessage?.name && <p className="error-message">{errorMessage.name}</p>}

        <FormInput
          label="Title"
          type="text"
          name="title"
          value={recipe.title || ""}
          onChange={this.handleInputChange}
          placeholder="Enter title"
          ariaLabel="Title"
        />
        {errorMessage?.title && <p className="error-message">{errorMessage.title}</p>}

        <FormInput
          label="Description"
          type="textarea"
          name="description"
          value={recipe.description || ""}
          onChange={this.handleInputChange}
          placeholder="Enter a brief description"
          multiline
          ariaLabel="Description"
        />
        {errorMessage?.description && <p className="error-message">{errorMessage.description}</p>}

        <FormInput
          label="Preparation Steps"
          type="textarea"
          name="preparationSteps"
          value={recipe.preparationSteps || ""}
          onChange={this.handleInputChange}
          placeholder="Enter preparation steps"
          multiline
          ariaLabel="Preparation Steps"
        />

        <FormInput
          label="Cooking Time (mins)"
          type="number"
          name="cookingTime"
          value={recipe.cookingTime?.toString() || ""}
          onChange={this.handleNumberInputChange}
          placeholder="Enter cooking time in minutes"
          ariaLabel="Cooking Time"
        />
        {errorMessage?.cookingTime && <p className="error-message">{errorMessage.cookingTime}</p>}

        <FormInput
          label="Servings"
          type="number"
          name="servings"
          value={recipe.servings?.toString() || ""}
          onChange={this.handleNumberInputChange}
          placeholder="Enter number of servings"
          ariaLabel="Servings"
        />

        <div className="categories-section">
          <label>Categories</label>
          {(recipe.categories || []).map((category, index) => (
            <div key={index}>
              <span>{category}</span>
              <button type="button" onClick={() => this.handleRemoveCategory(index)}>
                Remove
              </button>
            </div>
          ))}
          <input
            type="text"
            placeholder="Add a category"
            onKeyDown={(e) => {
              if (e.key === "Enter" && e.currentTarget.value) {
                this.handleAddCategory(e.currentTarget.value);
                e.currentTarget.value = ""; // Clear input
              }
            }}
          />
        </div>

        <FormInput
          label="Photo"
          type="file"
          name="photo"
          onChange={this.handleInputChange}
          ariaLabel="Recipe Photo"
        />

        <button
          onClick={this.handleSubmit}
          className="submit-button"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Submitting..." : "Submit Recipe"}
        </button>
      </div>
    );
  }
}

export default RecipeForm;
