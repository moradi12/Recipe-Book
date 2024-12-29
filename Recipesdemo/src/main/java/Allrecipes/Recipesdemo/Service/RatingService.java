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
import jakarta.validation.ValidationException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class RatingService {

    private final RatingRepository ratingRepository;
    private final RecipeRepository recipeRepository;
    private final UserRepository userRepository;
    private final RatingMapper ratingMapper;

    /**
     * Creates a new rating for a recipe by a user.
     *
     * @param request The RatingCreateRequest containing rating details.
     * @return The created RatingResponse DTO.
     * @throws ResourceNotFoundException If the recipe or user is not found.
     * @throws ValidationException       If the user has already rated the recipe or the score is invalid.
     */
    @Transactional
    public RatingResponse createRating(RatingCreateRequest request) {
        log.debug("Creating rating with Recipe ID: {} and User ID: {}", request.getRecipeId(), request.getUserId());

        Recipe recipe = recipeRepository.findById(request.getRecipeId())
                .orElseThrow(() -> {
                    log.error("Recipe not found with id: {}", request.getRecipeId());
                    return new ResourceNotFoundException("Recipe not found with id: " + request.getRecipeId());
                });

        User user = userRepository.findById(request.getUserId())
                .orElseThrow(() -> {
                    log.error("User not found with id: {}", request.getUserId());
                    return new ResourceNotFoundException("User not found with id: " + request.getUserId());
                });

        if (ratingRepository.existsByRecipeIdAndUserId(recipe.getId(), user.getId())) {
            log.error("User ID {} has already rated Recipe ID {}", user.getId(), recipe.getId());
            throw new ValidationException("User has already rated this recipe.");
        }

        if (request.getScore() < 1 || request.getScore() > 5) {
            log.error("Invalid score: {}. Score must be between 1 and 5.", request.getScore());
            throw new ValidationException("Score must be between 1 and 5.");
        }

        Rating rating = Rating.builder()
                .score(request.getScore())
                .comment(request.getComment())
                .recipe(recipe)
                .user(user)
                .build();

        Rating savedRating = ratingRepository.save(rating);
        log.info("Rating created with ID: {}", savedRating.getId());
        return ratingMapper.toDto(savedRating);
    }

    /**
     * Retrieves a rating by its ID.
     *
     * @param id The ID of the rating.
     * @return The RatingResponse DTO.
     * @throws ResourceNotFoundException If the rating is not found.
     */
    @Transactional(readOnly = true)
    public RatingResponse getRatingById(Long id) {
        log.debug("Fetching rating with ID: {}", id);
        Rating rating = ratingRepository.findById(id)
                .orElseThrow(() -> {
                    log.error("Rating not found with id: {}", id);
                    return new ResourceNotFoundException("Rating not found with id: " + id);
                });

        return ratingMapper.toDto(rating);
    }

    /**
     * Updates an existing rating.
     *
     * @param id             The ID of the rating to update.
     * @param request        The RatingUpdateRequest containing updated details.
     * @param requestingUser The User attempting to update the rating.
     * @return The updated RatingResponse DTO.
     * @throws ResourceNotFoundException      If the rating is not found.
     * @throws UnauthorizedActionException    If the user is not authorized to modify the rating.
     * @throws ValidationException            If the updated score is invalid.
     */
    @Transactional
    public RatingResponse updateRating(Long id, RatingUpdateRequest request, User requestingUser) {
        log.debug("Updating rating with ID: {} by User ID: {}", id, requestingUser.getId());

        Rating rating = ratingRepository.findById(id)
                .orElseThrow(() -> {
                    log.error("Rating not found with id: {}", id);
                    return new ResourceNotFoundException("Rating not found with id: " + id);
                });

        if (!rating.getUser().getId().equals(requestingUser.getId())) {
            log.error("User ID {} is not authorized to modify Rating ID {}", requestingUser.getId(), id);
            throw new UnauthorizedActionException("You are not authorized to modify this rating.");
        }

        if (request.getScore() != null) {
            if (request.getScore() < 1 || request.getScore() > 5) {
                log.error("Invalid score: {}. Score must be between 1 and 5.", request.getScore());
                throw new ValidationException("Score must be between 1 and 5.");
            }
            rating.setScore(request.getScore());
            log.debug("Updated score to {}", request.getScore());
        }

        if (request.getComment() != null) {
            rating.setComment(request.getComment());
            log.debug("Updated comment to {}", request.getComment());
        }

        Rating updatedRating = ratingRepository.save(rating);
        log.info("Rating updated with ID: {}", updatedRating.getId());
        return ratingMapper.toDto(updatedRating);
    }

    /**
     * Deletes a rating by its ID.
     *
     * @param id             The ID of the rating to delete.
     * @param requestingUser The User attempting to delete the rating.
     * @throws ResourceNotFoundException   If the rating is not found.
     * @throws UnauthorizedActionException If the user is not authorized to delete the rating.
     */
    @Transactional
    public void deleteRating(Long id, User requestingUser) {
        log.debug("Deleting rating with ID: {} by User ID: {}", id, requestingUser.getId());

        Rating rating = ratingRepository.findById(id)
                .orElseThrow(() -> {
                    log.error("Rating not found with id: {}", id);
                    return new ResourceNotFoundException("Rating not found with id: " + id);
                });

        if (!rating.getUser().getId().equals(requestingUser.getId())) {
            log.error("User ID {} is not authorized to delete Rating ID {}", requestingUser.getId(), id);
            throw new UnauthorizedActionException("You are not authorized to delete this rating.");
        }

        ratingRepository.delete(rating);
        log.info("Rating deleted with ID: {}", id);
    }

    /**
     * Retrieves all active ratings.
     *
     * @return A list of RatingResponse DTOs.
     */
    @Transactional(readOnly = true)
    public List<RatingResponse> getAllRatings() {
        log.debug("Fetching all active ratings.");
        return ratingRepository.findAllActive()
                .stream()
                .map(ratingMapper::toDto)
                .collect(Collectors.toList());
    }

    /**
     * Retrieves all ratings for a specific recipe.
     *
     * @param recipeId The ID of the recipe.
     * @return A list of RatingResponse DTOs.
     */
    @Transactional(readOnly = true)
    public List<RatingResponse> getRatingsByRecipeId(Long recipeId) {
        log.debug("Fetching ratings for Recipe ID: {}", recipeId);
        return ratingRepository.findByRecipe_IdAndDeletedFalse(recipeId, Pageable.unpaged())
                .stream()
                .map(ratingMapper::toDto)
                .collect(Collectors.toList());
    }
    @Transactional(readOnly = true)
    public boolean isRatingOwner(Long ratingId, User user) {
        log.debug("Checking ownership of Rating ID: {} by User ID: {}", ratingId, user.getId());

        boolean isOwner = ratingRepository.isRatingOwner(ratingId, user.getId());
        if (!isOwner) {
            log.warn("User ID {} is not the owner of Rating ID {}", user.getId(), ratingId);
        }
        return isOwner;
    }
    /**
     * Retrieves all ratings made by a specific user.
     *
     * @param userId The ID of the user.
     * @return A list of RatingResponse DTOs.
     */
    @Transactional(readOnly = true)
    public List<RatingResponse> getRatingsByUserId(Long userId) {
        log.debug("Fetching ratings for User ID: {}", userId);
        return ratingRepository.findByUser_IdAndDeletedFalse(userId, Pageable.unpaged())
                .stream()
                .map(ratingMapper::toDto)
                .collect(Collectors.toList());
    }



}
