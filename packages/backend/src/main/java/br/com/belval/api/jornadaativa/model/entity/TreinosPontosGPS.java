package br.com.belval.api.jornadaativa.model.entity;


import jakarta.persistence.*;
import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Digits;
import jakarta.validation.constraints.NotNull;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "Treino_PontosGPS")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor
public class TreinosPontosGPS {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_ponto")
    private Long id;

    @ManyToOne(optional = false)
    @JoinColumn(name = "id_historico_treino", nullable = false)
    private HistoricoTreinos historicoTreino;

    @Column(name = "latitude", nullable = false, precision = 9, scale = 6)
    private BigDecimal latitude;

    @Column(name = "longitude", nullable = false, precision = 9, scale = 6)
    private BigDecimal longitude;

    @Column(name = "momento", nullable = false)
    private LocalDateTime momento;
}
