package Allrecipes.Recipesdemo.Exceptions;

public class InvalidRecipeDataException extends RuntimeException {
    public InvalidRecipeDataException(String message) {
        super(message);
    }

    public InvalidRecipeDataException(String message, Throwable cause) { // New constructor
        super(message, cause);
    }
}
