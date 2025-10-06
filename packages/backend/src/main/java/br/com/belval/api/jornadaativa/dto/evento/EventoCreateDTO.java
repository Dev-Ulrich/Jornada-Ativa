package br.com.belval.api.jornadaativa.dto.evento;


import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.*;
import jakarta.validation.constraints.*;

import java.time.LocalDate;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class EventoCreateDTO {
    @NotBlank @Size(max = 255) private String nome;
    @NotBlank @Size(max = 255) private String descricao;
    @NotBlank @Size(max = 255) private String linkEvento;
    @JsonFormat(pattern = "yyyy-MM-dd") private LocalDate dataEvento; // opcional
    @Size(max = 255) private String imagemEvento;
}

