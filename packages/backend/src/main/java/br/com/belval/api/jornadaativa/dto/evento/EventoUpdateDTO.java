package br.com.belval.api.jornadaativa.dto.evento;

import br.com.belval.api.jornadaativa.model.entity.StatusEvento;
import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.validation.constraints.*;
import lombok.*;

import java.time.LocalDate;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class EventoUpdateDTO {
    @Size(max = 255) private String nome;
    @Size(max = 255) private String descricao;
    @Size(max = 255) private String linkEvento;
    @JsonFormat(pattern = "yyyy-MM-dd") private LocalDate dataEvento;
    @Size(max = 255) private String imagemEvento;
    @NotNull
    private StatusEvento status;
}
