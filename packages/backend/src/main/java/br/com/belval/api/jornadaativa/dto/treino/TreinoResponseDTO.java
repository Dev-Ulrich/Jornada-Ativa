package br.com.belval.api.jornadaativa.dto.treino;


import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TreinoResponseDTO {

    private Long id;
    private String nome;
    private String descricao;
    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss") private LocalDateTime createdAt;
    private String nivel;
}
