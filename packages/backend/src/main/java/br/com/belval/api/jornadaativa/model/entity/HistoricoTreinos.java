package br.com.belval.api.jornadaativa.model.entity;


import jakarta.persistence.*;
import jakarta.validation.constraints.Digits;
import jakarta.validation.constraints.NotNull;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "Historico_Treino")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor
public class HistoricoTreinos {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_historico_treino")
    private Long id;

    @Column(name = "data", nullable = false)
    private LocalDate data;

    @Column(name = "tempo", nullable = false, precision = 8, scale = 2)
    private BigDecimal tempo;

    @Column(name = "v_media", nullable = false, precision = 8, scale = 2)
    private BigDecimal vMedia;

    @Column(name = "distancia", nullable = false, precision = 8, scale = 2)
    private BigDecimal distancia;

    @Column(name = "kcal", nullable = false, precision = 6, scale = 2)
    private BigDecimal kcal;

    @Column(name = "pace", nullable = false, precision = 4, scale = 2)
    private BigDecimal pace;

    @ManyToOne(optional = false)
    @JoinColumn(name = "id_usuario", nullable = false)
    private Usuarios usuario;

    @ManyToOne(optional = true)
    @JoinColumn(name = "id_treino")
    private Treinos treino;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @OneToMany(mappedBy = "historicoTreino", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<TreinosPontosGPS> pontos;

    public HistoricoTreinos(Long id) {
        this.id = id;
    }

}
