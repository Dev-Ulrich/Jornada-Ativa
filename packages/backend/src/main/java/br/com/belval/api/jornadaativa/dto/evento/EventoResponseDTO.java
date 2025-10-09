package br.com.belval.api.jornadaativa.dto.evento;


import br.com.belval.api.jornadaativa.model.entity.StatusEvento;
import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class EventoResponseDTO {
    private Long id;
    private String nome;
    private String descricao;
    private String linkEvento;
    private StatusEvento status;
    @JsonFormat(pattern = "yyyy-MM-dd") private LocalDate dataEvento;
    private String imagemEvento;
    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss") private LocalDateTime createdAt;

}
