package br.com.belval.api.jornadaativa.model;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import com.fasterxml.jackson.databind.annotation.JsonDeserialize;

import br.com.belval.api.jornadaativa.util.BigDecimalDeserializer;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Table(name = "treino_pontos_gps")
public class TreinoPontosGPS {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idPonto;

    @Column(nullable = false)
    private Long idHistoricoTreino;

    @Column(nullable = false, precision = 9, scale = 6)
    @JsonDeserialize(using = BigDecimalDeserializer.class)
    private BigDecimal latitude;

    @Column(nullable = false, precision = 9, scale = 6)
    @JsonDeserialize(using = BigDecimalDeserializer.class)
    private BigDecimal longitude;

    @Column(nullable = false)
    private LocalDateTime momento;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "historico_treino_id", referencedColumnName = "idHistoricoTreino")
    private HistoricoTreino historicoTreino;
}