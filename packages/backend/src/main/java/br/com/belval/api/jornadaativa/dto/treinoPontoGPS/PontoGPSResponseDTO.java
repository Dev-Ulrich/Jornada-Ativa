package br.com.belval.api.jornadaativa.dto.treinoPontoGPS;


import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.*;

import java.time.LocalDateTime;
import java.time.OffsetDateTime;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class PontoGPSResponseDTO {
    private Long id;
    private Long historicoTreinoId;
    private Double latitude;
    private Double longitude;
    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss") private LocalDateTime momento;
}

