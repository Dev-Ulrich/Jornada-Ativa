package br.com.belval.api.jornadaativa.dto.evento;


import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class EventoResponseDTO {
    private Long id;
    private String nome;
    private String descricao;
    private String linkEvento;
    @JsonFormat(pattern = "yyyy-MM-dd") private LocalDate dataEvento;
    private String imagemEvento;
    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss") private LocalDateTime createdAt;
}
