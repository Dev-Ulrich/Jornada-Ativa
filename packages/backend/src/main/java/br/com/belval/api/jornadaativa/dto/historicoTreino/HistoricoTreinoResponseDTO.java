package br.com.belval.api.jornadaativa.dto.historicoTreino;


import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.OffsetDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class HistoricoTreinoResponseDTO {

    private Long id;
    private Long usuarioId;
    private Long treinoId;
    @JsonFormat(pattern = "yyyy-MM-dd") private LocalDate data;
    private BigDecimal tempo;
    private BigDecimal vMedia;
    private BigDecimal distancia;
    private BigDecimal kcal;
    private BigDecimal pace;
    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss") private LocalDateTime createdAt;
}
