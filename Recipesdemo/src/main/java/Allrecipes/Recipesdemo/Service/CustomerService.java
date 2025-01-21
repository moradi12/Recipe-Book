package Allrecipes.Recipesdemo.Service;

import Allrecipes.Recipesdemo.Recipe.Recipe;
import Allrecipes.Recipesdemo.Response.UserResponse;
import Allrecipes.Recipesdemo.Entities.Enums.UserType;
import Allrecipes.Recipesdemo.Entities.User;
import Allrecipes.Recipesdemo.Exceptions.*;
import Allrecipes.Recipesdemo.Repositories.RecipeRepository;
import Allrecipes.Recipesdemo.Repositories.UserRepository;
import Allrecipes.Recipesdemo.Security.JWT.JWT;
import jakarta.annotation.PostConstruct;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class CustomerService {
    private final UserRepository userRepository;
    private final RecipeRepository recipeRepository;
    private final JWT jwt;

    public CustomerService(UserRepository userRepository, RecipeRepository recipeRepository) {
        this.userRepository = userRepository;
        this.recipeRepository = recipeRepository;
        this.jwt = new JWT();
    }

    @PostConstruct
    @Transactional
    public void seedAdminUser() {
        if (!userRepository.findByEmail("admin@admin.com").isPresent()) {
            User admin = User.builder()
                    .username("admin")
                    .email("admin@admin.com")
                    .password("admin")
                    .userType(UserType.ADMIN)
                    .build();
            userRepository.save(admin);
        }
    }


    @Transactional(readOnly = true)
    public User login(String usernameOrEmail, String rawPassword) {
        User user = userRepository.findByUsername(usernameOrEmail)
                .or(() -> userRepository.findByEmail(usernameOrEmail))
                .orElseThrow(() -> new UserNotFoundException("User with username or email '" + usernameOrEmail + "' not found."));

        if (!rawPassword.equals(user.getPassword())) {
            throw new UserNotFoundException("Invalid username/email or password.");
        }

        return user;
    }

    @Transactional
    public User registerUser(String username, String email, String rawPassword) {
        validateRegistrationData(username, email, rawPassword);

        if (userRepository.findByUsername(username).isPresent()) {
            throw new UsernameAlreadyTakenException("Username '" + username + "' is already taken.");
        }

        if (userRepository.findByEmail(email).isPresent()) {
            throw new EmailAlreadyTakenException("Email '" + email + "' is already in use.");
        }

        User user = User.builder()
                .username(username)
                .email(email)
                .password(rawPassword)
                .userType(UserType.CUSTOMER)
                .build();
        return userRepository.save(user);


    }

    public boolean validateToken(String token) {
        try {
            return jwt.validateToken(token);
        } catch (Exception e) {
            System.out.println("Token validation failed: " + e.getMessage());
            return false;
        }
    }
    public boolean checkUser(String token, UserType userType) {
        try {
            return jwt.checkUser(token, userType);
        } catch (Exception e) {
            System.out.println("Failed to check user: " + e.getMessage());
            return false;
        }
    }

    private void validateRegistrationData(String username, String email, String rawPassword) {
        if (username == null || username.isBlank()) {
            throw new IllegalArgumentException("Username cannot be null or empty.");
        }
        if (email == null || email.isBlank()) {
            throw new IllegalArgumentException("Email cannot be null or empty.");
        }
        if (rawPassword == null || rawPassword.length() < 6) {
            throw new IllegalArgumentException("Password must be at least 6 characters long.");
        }
    }

    @Transactional(readOnly = true)
    public Optional<User> findByUsernameOrEmail(String usernameOrEmail) {
        return userRepository.findByUsernameOrEmail(usernameOrEmail, usernameOrEmail);
    }


    @Transactional(readOnly = true)
    public Optional<User> findById(Long id) {
        return userRepository.findById(id);
    }


    @Transactional(readOnly = true)
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }


    @Transactional
    public void deleteUser(Long id) {
        if (!userRepository.existsById(id)) {
            throw new UserNotFoundException("User with ID " + id + " not found.");
        }
        userRepository.deleteById(id);
    }


    @Transactional(readOnly = true)
    public UserResponse toUserResponse(User user) {
        return UserResponse.builder()
                .id(user.getId())
                .username(user.getUsername())
                .email(user.getEmail())
                .userType(user.getUserType().name())
                .favorites(
                        user.getFavorites().stream()
                                .map(Recipe::getId)
                                .collect(Collectors.toSet())
                )
                .build();
    }


    @Transactional(readOnly = true)
    public List<UserResponse> getAllUserResponses() {
        return userRepository.findAll().stream()
                .map(this::toUserResponse)
                .collect(Collectors.toList());
    }


    @Transactional
    public void updateUser(Long userId, String newUsername, String newEmail, String newPassword) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new UserNotFoundException("User with ID " + userId + " not found."));

        if (newUsername != null && !newUsername.isBlank() && !newUsername.equals(user.getUsername())) {
            if (userRepository.findByUsername(newUsername).isPresent()) {
                throw new UsernameAlreadyTakenException("Username '" + newUsername + "' is already taken.");
            }
            user.setUsername(newUsername);
        }

        if (newEmail != null && !newEmail.isBlank() && !newEmail.equals(user.getEmail())) {
            if (userRepository.findByEmail(newEmail).isPresent()) {
                throw new EmailAlreadyTakenException("Email '" + newEmail + "' is already in use.");
            }
            user.setEmail(newEmail);
        }

        if (newPassword != null && newPassword.length() >= 6) {
            user.setPassword(newPassword);
        }

        userRepository.save(user);
    }


    @Transactional
    public void addFavoriteRecipe(User user, Long recipeId) {
        Recipe recipe = recipeRepository.findById(recipeId)
                .orElseThrow(() -> new RecipeNotFoundException("Recipe with ID " + recipeId + " not found."));
        if (user.getFavorites().contains(recipe)) {
            throw new IllegalArgumentException("Recipe is already in favorites.");
        }
        user.getFavorites().add(recipe);
        userRepository.save(user);
    }

    @Transactional
    public void removeFavoriteRecipe(User user, Long recipeId) {
        Recipe recipe = recipeRepository.findById(recipeId)
                .orElseThrow(() -> new RecipeNotFoundException("Recipe with ID " + recipeId + " not found."));
        if (!user.getFavorites().contains(recipe)) {
            throw new IllegalArgumentException("Recipe is not in favorites.");
        }
        user.getFavorites().remove(recipe);
        userRepository.save(user);
    }

    @Transactional
    public void assignUserTypeToUser(Long userId, UserType newUserType) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new UserNotFoundException("User with ID " + userId + " not found."));
        user.setUserType(newUserType);
        userRepository.save(user);
    }


}
