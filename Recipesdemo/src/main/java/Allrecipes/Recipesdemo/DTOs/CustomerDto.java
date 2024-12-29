package Allrecipes.Recipesdemo.DTOs;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CustomerDto {
    private Long id;
    private String username;
    private String email;
    private String password;
}
