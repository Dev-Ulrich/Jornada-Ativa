package br.com.belval.api.jornadaativa.dto.token;


import jakarta.validation.constraints.NotBlank;
import lombok.*;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class TokenRefreshRequestDTO {
    @NotBlank private String refreshToken;
}
