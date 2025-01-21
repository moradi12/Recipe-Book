package Allrecipes.Recipesdemo.Service;

import Allrecipes.Recipesdemo.Entities.Favorite;
import Allrecipes.Recipesdemo.Entities.User;
import Allrecipes.Recipesdemo.Exceptions.FavoriteAlreadyExistsException;
import Allrecipes.Recipesdemo.Exceptions.FavoriteNotFoundException;
import Allrecipes.Recipesdemo.Recipe.Recipe;
import Allrecipes.Recipesdemo.Repositories.FavoriteRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Slf4j
public class FavoriteService {

    private final FavoriteRepository favoriteRepository;

    @Transactional
    public Favorite addFavorite(User user, Recipe recipe) {
        log.debug("Attempting to add recipe ID {} to favorites for user ID {}", recipe.getId(), user.getId());

        if (favoriteRepository.existsByUserIdAndRecipeId(user.getId(), recipe.getId())) {
            log.error("Favorite already exists for user ID {} and recipe ID {}", user.getId(), recipe.getId());
            throw new FavoriteAlreadyExistsException("This recipe is already in the user's favorites.");
        }

        Favorite favorite = Favorite.builder()
                .user(user)
                .recipe(recipe)
                .build();
        Favorite savedFavorite = favoriteRepository.save(favorite);

        log.info("Added recipe ID {} to favorites for user ID {}", recipe.getId(), user.getId());
        return savedFavorite;
    }

    @Transactional
    public void removeFavorite(User user, Recipe recipe) {
        log.debug("Attempting to remove recipe ID {} from favorites for user ID {}", recipe.getId(), user.getId());

        Optional<Favorite> favoriteOpt = favoriteRepository.findByUserIdAndRecipeId(user.getId(), recipe.getId());
        Favorite favorite = favoriteOpt.orElseThrow(() -> {
            log.error("Favorite not found for user ID {} and recipe ID {}", user.getId(), recipe.getId());
            return new FavoriteNotFoundException("This recipe is not in the user's favorites.");
        });

        favoriteRepository.delete(favorite);
        log.info("Removed recipe ID {} from favorites for user ID {}", recipe.getId(), user.getId());
    }

    @Transactional(readOnly = true)
    public List<Favorite> getFavoritesByUserId(Long userId) {
        log.debug("Fetching favorites for user ID {}", userId);
        return favoriteRepository.findByUserId(userId);
    }

    @Transactional(readOnly = true)
    public boolean isRecipeFavorite(Long userId, Long recipeId) {
        log.debug("Checking if recipe ID {} is a favorite for user ID {}", recipeId, userId);
        return favoriteRepository.existsByUserIdAndRecipeId(userId, recipeId);
    }
}
