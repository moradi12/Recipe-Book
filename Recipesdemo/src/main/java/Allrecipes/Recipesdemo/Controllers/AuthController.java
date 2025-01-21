package Allrecipes.Recipesdemo.Controllers;

import Allrecipes.Recipesdemo.DTOs.AuthResponse;
import Allrecipes.Recipesdemo.Entities.User;
import Allrecipes.Recipesdemo.Request.LoginRequest;
import Allrecipes.Recipesdemo.Request.RegisterRequest;
import Allrecipes.Recipesdemo.Security.JWT.JWT;
import Allrecipes.Recipesdemo.Service.CustomerService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@CrossOrigin
@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final CustomerService customerService;
    private final JWT jwtProvider;

    public AuthController(CustomerService customerService, JWT jwtProvider) {
        this.customerService = customerService;
        this.jwtProvider = jwtProvider;
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody LoginRequest loginRequest) {
        User user = customerService.login(loginRequest.getUsernameOrEmail(), loginRequest.getPassword());
        Allrecipes.Recipesdemo.Entities.UserDetails userDetails =
                Allrecipes.Recipesdemo.Entities.UserDetails.builder()
                        .userId(user.getId())
                        .userName(user.getUsername())
                        .email(user.getEmail())
                        .userType(user.getUserType())
                        .build();
        String token = jwtProvider.generateToken(userDetails);
        AuthResponse response = AuthResponse.builder()
                .id(user.getId())
                .username(user.getUsername())
                .email(user.getEmail())
                .userType(user.getUserType().name())
                .token(token)
                .build();
        return ResponseEntity.ok()
                .header("Authorization", "Bearer " + token)
                .body(response);
    }

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@RequestBody RegisterRequest registerRequest) {
        User newUser = customerService.registerUser(
                registerRequest.getUsername(),
                registerRequest.getEmail(),
                registerRequest.getPassword()
        );

        Allrecipes.Recipesdemo.Entities.UserDetails userDetails =
                Allrecipes.Recipesdemo.Entities.UserDetails.builder()
                        .userId(newUser.getId())
                        .userName(newUser.getUsername())
                        .email(newUser.getEmail())
                        .userType(newUser.getUserType())
                        .build();

        String token = jwtProvider.generateToken(userDetails);
        AuthResponse response = AuthResponse.builder()
                .id(newUser.getId())
                .username(newUser.getUsername())
                .email(newUser.getEmail())
                .userType(newUser.getUserType().name())
                .token(token)
                .build();

        // 5. Return token in BOTH body and header
        return ResponseEntity.ok()
                .header("Authorization", "Bearer " + token)
                .body(response);
    }
}
