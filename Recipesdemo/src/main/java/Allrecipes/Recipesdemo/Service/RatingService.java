package Allrecipes.Recipesdemo.Service;

import Allrecipes.Recipesdemo.Entities.Rating;
import Allrecipes.Recipesdemo.Entities.User;
import Allrecipes.Recipesdemo.Exceptions.ResourceNotFoundException;
import Allrecipes.Recipesdemo.Exceptions.UnauthorizedActionException;
import Allrecipes.Recipesdemo.Rating.RatingResponse;
import Allrecipes.Recipesdemo.Rating.RatingUpdateRequest;
import Allrecipes.Recipesdemo.Recipe.Recipe;
import Allrecipes.Recipesdemo.Repositories.RatingRepository;
import Allrecipes.Recipesdemo.Repositories.RecipeRepository;
import Allrecipes.Recipesdemo.Repositories.UserRepository;
import Allrecipes.Recipesdemo.Request.RatingCreateRequest;
import Allrecipes.Recipesdemo.Response.RatingMapper;
import jakarta.transaction.Transactional;
import jakarta.validation.ValidationException;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class RatingService {

    private final RatingRepository ratingRepository;
    private final RecipeRepository recipeRepository;
    private final UserRepository userRepository;
    private final RatingMapper ratingMapper;

    @Transactional
    public RatingResponse createRating(RatingCreateRequest request) {
        Recipe recipe = recipeRepository.findById(request.getRecipeId())
                .orElseThrow(() -> new ResourceNotFoundException("Recipe not found with id: " + request.getRecipeId()));

        User user = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + request.getUserId()));

        if (ratingRepository.existsByRecipeIdAndUserId(recipe.getId(), user.getId())) {
            throw new ValidationException("User has already rated this recipe.");
        }

        if (request.getScore() < 1 || request.getScore() > 5) {
            throw new ValidationException("Score must be between 1 and 5.");
        }

        Rating rating = Rating.builder()
                .score(request.getScore())
                .comment(request.getComment())
                .recipe(recipe)
                .user(user)
                .build();

        Rating savedRating = ratingRepository.save(rating);
        return ratingMapper.toDto(savedRating);
    }

    public RatingResponse getRatingById(Long id) {
        Rating rating = ratingRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Rating not found with id: " + id));

        return ratingMapper.toDto(rating);
    }

    @Transactional
    public RatingResponse updateRating(Long id, RatingUpdateRequest request, User requestingUser) {
        Rating rating = ratingRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Rating not found with id: " + id));

        if (!rating.getUser().getId().equals(requestingUser.getId())) {
            throw new UnauthorizedActionException("You are not authorized to modify this rating.");
        }

        if (request.getScore() != null) {
            if (request.getScore() < 1 || request.getScore() > 5) {
                throw new ValidationException("Score must be between 1 and 5.");
            }
            rating.setScore(request.getScore());
        }

        if (request.getComment() != null) {
            rating.setComment(request.getComment());
        }

        Rating updatedRating = ratingRepository.save(rating);
        return ratingMapper.toDto(updatedRating);
    }

    @Transactional
    public void deleteRating(Long id, User requestingUser) {
        Rating rating = ratingRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Rating not found with id: " + id));

        if (!rating.getUser().getId().equals(requestingUser.getId())) {
            throw new UnauthorizedActionException("You are not authorized to delete this rating.");
        }

        ratingRepository.delete(rating);
    }

    public List<RatingResponse> getAllRatings() {
        return ratingRepository.findAllActive()
                .stream()
                .map(ratingMapper::toDto)
                .collect(Collectors.toList());
    }

    public List<RatingResponse> getRatingsByRecipeId(Long recipeId) {
        return ratingRepository.findByRecipe_IdAndDeletedFalse(recipeId, Pageable.unpaged())
                .stream()
                .map(ratingMapper::toDto)
                .collect(Collectors.toList());
    }

    public List<RatingResponse> getRatingsByUserId(Long userId) {
        return ratingRepository.findByUser_IdAndDeletedFalse(userId, Pageable.unpaged())
                .stream()
                .map(ratingMapper::toDto)
                .collect(Collectors.toList());
    }
}
