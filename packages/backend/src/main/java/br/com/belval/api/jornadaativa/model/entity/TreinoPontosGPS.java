package br.com.belval.api.jornadaativa.model.entity;

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
    @Column(name = "id_ponto")
    private Long idPonto;

    @Column(nullable = false, precision = 9, scale = 6)
    @JsonDeserialize(using = BigDecimalDeserializer.class)
    private BigDecimal latitude;

    @Column(nullable = false, precision = 9, scale = 6)
    @JsonDeserialize(using = BigDecimalDeserializer.class)
    private BigDecimal longitude;

    @Column(nullable = false)
    private LocalDateTime momento;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_historico_treino", referencedColumnName = "id_historico_treino", nullable = false)
    private HistoricoTreino historicoTreino;
}