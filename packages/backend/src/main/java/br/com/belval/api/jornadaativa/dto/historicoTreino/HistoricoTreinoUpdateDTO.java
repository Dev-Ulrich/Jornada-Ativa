package br.com.belval.api.jornadaativa.dto.historicoTreino;


import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.validation.constraints.Digits;
import jakarta.validation.constraints.PositiveOrZero;
import jakarta.validation.constraints.Size;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.OffsetDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class HistoricoTreinoUpdateDTO {


    private Long usuarioId;
    @JsonFormat(pattern = "yyyy-MM-dd") private LocalDate data;
    @Digits(integer = 6, fraction = 2) private BigDecimal tempo;
    @Digits(integer = 6, fraction = 2) private BigDecimal vMedia;
    @Digits(integer = 6, fraction = 2) private BigDecimal distancia;
    @Digits(integer = 4, fraction = 2) private BigDecimal kcal;
    @Digits(integer = 2, fraction = 2) private BigDecimal pace;
    private Long treinoId; // opcional

}
