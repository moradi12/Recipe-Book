package Allrecipes.Recipesdemo.Request;

import lombok.Getter;
import lombok.Setter;

@Setter@Getter
public class RegisterRequest {
    private String username;
    private String email;
    private String password;

}
