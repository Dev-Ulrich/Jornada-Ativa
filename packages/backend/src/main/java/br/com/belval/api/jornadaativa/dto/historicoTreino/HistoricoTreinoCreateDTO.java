package br.com.belval.api.jornadaativa.dto.historicoTreino;


import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.validation.constraints.Digits;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;


@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class HistoricoTreinoCreateDTO {

    @NotNull private Long usuarioId;
    private Long treinoId; // opcional
    @NotNull @JsonFormat(pattern = "yyyy-MM-dd") private LocalDate data;
    @NotNull @Digits(integer = 6, fraction = 2) private BigDecimal tempo;
    @NotNull @Digits(integer = 6, fraction = 2) private BigDecimal vMedia;
    @NotNull @Digits(integer = 6, fraction = 2) private BigDecimal distancia;
    @NotNull @Digits(integer = 4, fraction = 2) private BigDecimal kcal;
    @NotNull @Digits(integer = 2, fraction = 2) private BigDecimal pace;

}
