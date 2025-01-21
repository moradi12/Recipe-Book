package Allrecipes.Recipesdemo.Controllers;

import Allrecipes.Recipesdemo.Entities.Enums.UserType;
import Allrecipes.Recipesdemo.Entities.User;
import Allrecipes.Recipesdemo.Exceptions.UserNotFoundException;
import Allrecipes.Recipesdemo.Response.UserResponse;
import Allrecipes.Recipesdemo.Security.JWT.JWT;
import Allrecipes.Recipesdemo.Service.CustomerService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.security.auth.login.LoginException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@CrossOrigin
@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
@Slf4j
public class CustomerController {
    private final CustomerService customerService;
    private final JWT jwtUtil;

    @PostMapping("/register")
    public ResponseEntity<?> registerUser(
            @RequestParam String username,
            @RequestParam String email,
            @RequestParam String password) {
        try {
            User newUser = customerService.registerUser(username, email, password);
            UserResponse response = customerService.toUserResponse(newUser);
            log.info("User registered successfully: {}", newUser.getUsername());
            return new ResponseEntity<>(response, HttpStatus.CREATED);
        } catch (IllegalArgumentException e) {
            // Handle cases like invalid input parameters
            log.error("Registration failed: {}", e.getMessage());
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        } catch (Exception e) {
            // Handle any other unexpected exceptions
            log.error("Registration failed due to an unexpected error.", e);
            return new ResponseEntity<>("Registration failed due to an unexpected error.", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(
            @RequestParam String usernameOrEmail,
            @RequestParam String password) {
        try {
            User user = customerService.login(usernameOrEmail, password);

            Allrecipes.Recipesdemo.Entities.UserDetails userDetails =
                    new Allrecipes.Recipesdemo.Entities.UserDetails(
                            user.getId(),
                            user.getUsername(),
                            user.getEmail(),
                            user.getUserType()
                    );
            String token = jwtUtil.generateToken(userDetails);
            HttpHeaders headers = new HttpHeaders();
            headers.set("Authorization", "Bearer " + token);

            UserResponse userResponse = customerService.toUserResponse(user);

            Map<String, Object> responseBody = new HashMap<>();
            responseBody.put("message", "Login successful");
            responseBody.put("user", userResponse);

            log.info("User logged in successfully: {}", user.getUsername());

            return new ResponseEntity<>(responseBody, headers, HttpStatus.OK);
        } catch (UserNotFoundException e) {
            log.warn("Login failed: {}", e.getMessage());
            return new ResponseEntity<>(e.getMessage(), HttpStatus.UNAUTHORIZED);
        } catch (Exception e) {

            log.error("Login failed due to an unexpected error.", e);
            return new ResponseEntity<>("Login failed due to an unexpected error.", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping
    public ResponseEntity<?> getAllUsers(@RequestHeader("Authorization") String authHeader) {
        try {
            // Check if user is Admin
            jwtUtil.checkUser(authHeader, UserType.ADMIN);
            log.debug("Admin authorized to fetch all users.");

            List<UserResponse> users = customerService.getAllUsers().stream()
                    .map(customerService::toUserResponse)
                    .collect(Collectors.toList());

            log.info("Retrieved {} users.", users.size());

            return ResponseEntity.ok(users);
        } catch (UserNotFoundException e) {

            log.warn("Fetching all users failed: {}", e.getMessage());
            return new ResponseEntity<>(e.getMessage(), HttpStatus.NOT_FOUND);
        } catch (LoginException e) {
            log.warn("Fetching all users unauthorized: {}", e.getMessage());

            return new ResponseEntity<>(e.getMessage(), HttpStatus.FORBIDDEN);
        } catch (Exception e) {
            log.error("Failed to retrieve users due to an unexpected error.", e);
            return new ResponseEntity<>("Failed to retrieve users due to an unexpected error.", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteUser(
            @RequestHeader("Authorization") String authHeader,
            @PathVariable Long id) {
        try {
            jwtUtil.checkUser(authHeader, UserType.ADMIN);
            log.debug("Admin authorized to delete user with ID: {}", id);

            customerService.deleteUser(id);
            log.info("User with ID {} deleted successfully.", id);

            return ResponseEntity.noContent().build();
        } catch (UserNotFoundException e) {

            log.warn("Deletion failed: {}", e.getMessage());
            return new ResponseEntity<>(e.getMessage(), HttpStatus.NOT_FOUND);
        } catch (LoginException e) {

            log.warn("Deletion unauthorized: {}", e.getMessage());
            return new ResponseEntity<>(e.getMessage(), HttpStatus.FORBIDDEN);
        } catch (Exception e) {

            log.error("Failed to delete user due to an unexpected error.", e);
            return new ResponseEntity<>("Failed to delete user due to an unexpected error.", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateUser(
            @RequestHeader("Authorization") String authHeader,
            @PathVariable Long id,
            @RequestParam(required = false) String username,
            @RequestParam(required = false) String email,
            @RequestParam(required = false) String password) {
        try {
            // Validate token
            String token = authHeader.replace("Bearer ", "");
            jwtUtil.validateToken(token);
            log.debug("Token validated for update operation.");

            // Extract user type and email from token
            String userType = jwtUtil.getUserType(token);
            String userEmail = jwtUtil.extractEmail(token);
            Optional<User> currentUserOpt = customerService.findByUsernameOrEmail(userEmail);
            User currentUser = currentUserOpt.orElseThrow(() -> new UserNotFoundException("Current user not found."));

            if (!UserType.ADMIN.name().equals(userType) && !currentUser.getId().equals(id)) {
                log.warn("User ID {} is not authorized to update User ID {}", currentUser.getId(), id);
                throw new LoginException("User not allowed to update another user's data.");
            }

            customerService.updateUser(id, username, email, password);
            log.info("User with ID {} updated successfully.", id);

            User updatedUser = customerService.findById(id)
                    .orElseThrow(() -> new UserNotFoundException("User not found after update."));
            UserResponse response = customerService.toUserResponse(updatedUser);
            return ResponseEntity.ok(response);
        } catch (UserNotFoundException e) {
            // Handle cases where the user is not found
            log.warn("Update failed: {}", e.getMessage());
            return new ResponseEntity<>(e.getMessage(), HttpStatus.NOT_FOUND);
        } catch (LoginException e) {
            // Handle unauthorized access
            log.warn("Update unauthorized: {}", e.getMessage());
            return new ResponseEntity<>(e.getMessage(), HttpStatus.FORBIDDEN);
        } catch (IllegalArgumentException e) {
            // Handle invalid input parameters
            log.warn("Update failed due to invalid parameters: {}", e.getMessage());
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        } catch (Exception e) {
            // Handle any other unexpected exceptions
            log.error("Failed to update user due to an unexpected error.", e);
            return new ResponseEntity<>("Failed to update user due to an unexpected error.", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PostMapping("/{id}/favorites/{recipeId}")
    public ResponseEntity<?> addFavorite(
            @RequestHeader("Authorization") String authHeader,
            @PathVariable Long id,
            @PathVariable Long recipeId) {
        try {
            String token = authHeader.replace("Bearer ", "");
            jwtUtil.validateToken(token);
            log.debug("Token validated for adding favorite recipe.");

            String userType = jwtUtil.getUserType(token);
            String userEmail = jwtUtil.extractEmail(token);

            User currentUser = customerService.findByUsernameOrEmail(userEmail)
                    .orElseThrow(() -> new UserNotFoundException("Current user not found."));

            if (!UserType.ADMIN.name().equals(userType) && !currentUser.getId().equals(id)) {
                log.warn("User ID {} is not authorized to modify favorites of User ID {}", currentUser.getId(), id);
                throw new LoginException("User not allowed to modify favorites of another user.");
            }

            customerService.addFavoriteRecipe(currentUser, recipeId);
            log.info("Favorite recipe ID {} added for User ID {}.", recipeId, id);

            User updatedUser = customerService.findById(id)
                    .orElseThrow(() -> new UserNotFoundException("User not found after adding favorite."));
            UserResponse response = customerService.toUserResponse(updatedUser);
            return ResponseEntity.ok(response);
        } catch (UserNotFoundException e) {
            // Handle cases where the user is not found
            log.warn("Adding favorite failed: {}", e.getMessage());
            return new ResponseEntity<>(e.getMessage(), HttpStatus.NOT_FOUND);
        } catch (LoginException e) {
            // Handle unauthorized access
            log.warn("Adding favorite unauthorized: {}", e.getMessage());
            return new ResponseEntity<>(e.getMessage(), HttpStatus.FORBIDDEN);
        } catch (IllegalArgumentException e) {
            // Handle invalid input parameters
            log.warn("Adding favorite failed due to invalid parameters: {}", e.getMessage());
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        } catch (Exception e) {
            // Handle any other unexpected exceptions
            log.error("Failed to add favorite due to an unexpected error.", e);
            return new ResponseEntity<>("Failed to add favorite due to an unexpected error.", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @DeleteMapping("/{id}/favorites/{recipeId}")
    public ResponseEntity<?> removeFavorite(
            @RequestHeader("Authorization") String authHeader,
            @PathVariable Long id,
            @PathVariable Long recipeId) {
        try {
            String token = authHeader.replace("Bearer ", "");
            jwtUtil.validateToken(token);
            log.debug("Token validated for removing favorite recipe.");

            String userType = jwtUtil.getUserType(token);
            String userEmail = jwtUtil.extractEmail(token);

            User currentUser = customerService.findByUsernameOrEmail(userEmail)
                    .orElseThrow(() -> new UserNotFoundException("Current user not found."));

            if (!UserType.ADMIN.name().equals(userType) && !currentUser.getId().equals(id)) {
                log.warn("User ID {} is not authorized to remove favorites of User ID {}", currentUser.getId(), id);
                throw new LoginException("User not allowed to remove favorites of another user.");
            }

            customerService.removeFavoriteRecipe(currentUser, recipeId);
            log.info("Favorite recipe ID {} removed for User ID {}.", recipeId, id);

            User updatedUser = customerService.findById(id)
                    .orElseThrow(() -> new UserNotFoundException("User not found after removing favorite."));
            UserResponse response = customerService.toUserResponse(updatedUser);
            return ResponseEntity.ok(response);
        } catch (UserNotFoundException e) {

            log.warn("Removing favorite failed: {}", e.getMessage());
            return new ResponseEntity<>(e.getMessage(), HttpStatus.NOT_FOUND);
        } catch (LoginException e) {

            log.warn("Removing favorite unauthorized: {}", e.getMessage());
            return new ResponseEntity<>(e.getMessage(), HttpStatus.FORBIDDEN);
        } catch (IllegalArgumentException e) {

            log.warn("Removing favorite failed due to invalid parameters: {}", e.getMessage());
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        } catch (Exception e) {

            log.error("Failed to remove favorite due to an unexpected error.", e);
            return new ResponseEntity<>("Failed to remove favorite due to an unexpected error.", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PostMapping("/{id}/assignUserType")
    public ResponseEntity<?> assignUserType(
            @RequestHeader("Authorization") String authHeader,
            @PathVariable Long id,
            @RequestParam UserType userType) {
        try {
            jwtUtil.checkUser(authHeader, UserType.ADMIN);
            log.debug("Admin authorized to assign user type.");

            customerService.assignUserTypeToUser(id, userType);
            log.info("Assigned user type {} to User ID {}.", userType, id);

            User updatedUser = customerService.findById(id)
                    .orElseThrow(() -> new UserNotFoundException("User not found after type assignment."));
            UserResponse response = customerService.toUserResponse(updatedUser);
            return ResponseEntity.ok(response);
        } catch (UserNotFoundException e) {

            log.warn("Assigning user type failed: {}", e.getMessage());
            return new ResponseEntity<>(e.getMessage(), HttpStatus.NOT_FOUND);
        } catch (LoginException e) {

            log.warn("Assigning user type unauthorized: {}", e.getMessage());
            return new ResponseEntity<>(e.getMessage(), HttpStatus.FORBIDDEN);
        } catch (IllegalArgumentException e) {

            log.warn("Assigning user type failed due to invalid parameters: {}", e.getMessage());
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        } catch (Exception e) {

            log.error("Failed to assign user type due to an unexpected error.", e);
            return new ResponseEntity<>("Failed to assign user type due to an unexpected error.", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    private User getCurrentUser(String authHeader) throws LoginException, UserNotFoundException {
        String token = authHeader.replace("Bearer ", "");
        jwtUtil.validateToken(token);
        String userType = jwtUtil.getUserType(token);
        String userEmail = jwtUtil.extractEmail(token);
        return customerService.findByUsernameOrEmail(userEmail)
                .orElseThrow(() -> new UserNotFoundException("Current user not found."));
    }

    @PutMapping("/update-password")
    public ResponseEntity<?> updatePassword(
            @RequestHeader("Authorization") String authHeader,
            @RequestParam String newPassword
    ) {
        try {
            User currentUser = getCurrentUser(authHeader);
            if (newPassword == null || newPassword.length() < 6) {
                throw new IllegalArgumentException("Password must be at least 6 characters long.");
            }
            // Update password
            customerService.updateUser(currentUser.getId(), null, null, newPassword);
            Allrecipes.Recipesdemo.Entities.UserDetails userDetails =
                    new Allrecipes.Recipesdemo.Entities.UserDetails(
                            currentUser.getId(),
                            currentUser.getUsername(),
                            currentUser.getEmail(),
                            currentUser.getUserType()
                    );
            String newToken = jwtUtil.generateToken(userDetails);

            HttpHeaders headers = new HttpHeaders();
            headers.set("Authorization", "Bearer " + newToken);

            return ResponseEntity.ok()
                    .headers(headers)
                    .body(Map.of("message", "Password updated successfully."));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Failed to update password."));
        }
    }
}