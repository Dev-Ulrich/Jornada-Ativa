package br.com.belval.api.jornadaativa.dto.token;


import lombok.*;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class TokenResponseDTO {
    private String accessToken;
    private String refreshToken;
    private String tokenType = "Bearer";
}
