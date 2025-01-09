import { ChangeEvent, Component } from "react";
import { Recipe } from "../../Models/Recipe";
import FormInput from "../FormInput/FormInput";

interface RecipeFormProps {
  recipe: Partial<Recipe>;
  onSubmit: (recipe: Partial<Recipe>) => void;
}

interface RecipeFormState {
  recipe: Partial<Recipe>;
  errorMessage: string | null;
}

class RecipeForm extends Component<RecipeFormProps, RecipeFormState> {
  constructor(props: RecipeFormProps) {
    super(props);
    this.state = {
      recipe: props.recipe || {},
      errorMessage: null,
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

  validateFields = (): string | null => {
    const { recipe } = this.state;
    if (!recipe.name || !recipe.title || !recipe.description) {
      return "Please fill out all required fields (Name, Title, Description).";
    }
    if (recipe.cookingTime && recipe.cookingTime < 0) {
      return "Cooking time must be a positive number.";
    }
    return null;
  };

  handleSubmit = () => {
    const errorMessage = this.validateFields();
    if (errorMessage) {
      this.setState({ errorMessage });
    } else {
      this.setState({ errorMessage: null });
      this.props.onSubmit(this.state.recipe);
    }
  };

  render() {
    const { recipe, errorMessage } = this.state;

    return (
      <div className="recipe-form">
        {errorMessage && <p className="error-message">{errorMessage}</p>}

        <FormInput
          label="Recipe Name"
          type="text"
          name="name"
          value={recipe.name || ""}
          onChange={this.handleInputChange}
          placeholder="Enter recipe name"
          ariaLabel="Recipe Name"
        />
        <FormInput
          label="Title"
          type="text"
          name="title"
          value={recipe.title || ""}
          onChange={this.handleInputChange}
          placeholder="Enter title"
          ariaLabel="Title"
        />
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
        <FormInput
          label="Servings"
          type="number"
          name="servings"
          value={recipe.servings?.toString() || ""}
          onChange={this.handleNumberInputChange}
          placeholder="Enter number of servings"
          ariaLabel="Servings"
        />
        <FormInput
          label="Categories"
          type="text"
          name="categories"
          value={(recipe.categories || []).join(", ")}
          onChange={this.handleInputChange}
          placeholder="Enter categories (comma-separated)"
          ariaLabel="Categories"
        />
        <FormInput
          label="Photo"
          type="file"
          name="photo"
          onChange={this.handleInputChange}
          ariaLabel="Recipe Photo"
        />

        <button onClick={this.handleSubmit} className="submit-button">
          Submit Recipe
        </button>
      </div>
    );
  }
}

export default RecipeForm;
