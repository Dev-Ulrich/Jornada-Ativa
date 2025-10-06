package br.com.belval.api.jornadaativa.dto.usuario;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
public class UsuariosResponseDTO {

    private Long id;
    private String nome;
    private String email;
    private String genero;
    @JsonFormat(pattern = "yyyy-MM-dd") private LocalDate dataNascimento;
    private String ftPerfil;
    private String nivel;
    private BigDecimal altura;
    private BigDecimal peso;
    private String role;
    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss") private LocalDateTime createdAt;
    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss") private LocalDateTime updatedAt;
}