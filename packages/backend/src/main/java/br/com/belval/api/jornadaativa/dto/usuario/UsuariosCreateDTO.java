package br.com.belval.api.jornadaativa.dto.usuario;

import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.validation.constraints.*;
import lombok.*;


import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;


@Getter @Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UsuariosCreateDTO {
    @NotBlank @Size(max = 255) private String nome;
    @NotBlank @Email @Size(max = 255) private String email;
    @NotBlank @Size(min = 6, max = 255) private String senha; // será hasheada
    @NotBlank @Size(max = 10) private String genero;
    @NotNull @JsonFormat(pattern = "yyyy-MM-dd") private LocalDate dataNascimento;
    @Size(max = 255) private String ftPerfil;
    @NotBlank @Size(max = 50) private String nivel;
    @NotNull @Digits(integer = 1, fraction = 2) private BigDecimal altura; // 3,2
    @NotNull @Digits(integer = 3, fraction = 2) private BigDecimal peso;   // 5,2
    @Size(max = 45) private String role; // opcional

}


