package Allrecipes.Recipesdemo.Request;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;

@Data
public class LoginRequest {
    @NotBlank(message = "Username or Email is required.")
    private String usernameOrEmail;

    @NotBlank(message = "Password is required.")
    private String password;
}