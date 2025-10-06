package br.com.belval.api.jornadaativa.dto.usuario;


import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.validation.constraints.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UsuariosUpdateDTO {

    @Size(max = 255) private String nome;
    @Email @Size(max = 255) private String email;
    @Size(min = 6, max = 255) private String senha;
    @Size(max = 10) private String genero;
    @JsonFormat(pattern = "yyyy-MM-dd") private LocalDate dataNascimento;
    @Size(max = 255) private String ftPerfil;
    @Size(max = 50) private String nivel;
    @Digits(integer = 1, fraction = 2) private BigDecimal altura;
    @Digits(integer = 3, fraction = 2) private BigDecimal peso;
    @Size(max = 45) private String role;

}
