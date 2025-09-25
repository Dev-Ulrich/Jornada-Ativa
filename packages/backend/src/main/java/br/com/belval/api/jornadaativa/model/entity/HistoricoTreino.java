package br.com.belval.api.jornadaativa.model.entity;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

import com.fasterxml.jackson.databind.annotation.JsonDeserialize;

import br.com.belval.api.jornadaativa.util.BigDecimalDeserializer;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Table(name = "Historico_Treino")

public class HistoricoTreino {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_historico_treino")
    private Long id;
    @Column(nullable = false)
    private LocalDate data;
    @Column(nullable = false, precision = 8, scale = 2)
    @JsonDeserialize(using = BigDecimalDeserializer.class)
    private BigDecimal tempo;
    @Column(nullable = false, name = "v_media", precision = 8, scale = 2)
    @JsonDeserialize(using = BigDecimalDeserializer.class)
    private BigDecimal vMedia;
    @Column(nullable = false, precision = 8, scale = 2)
    @JsonDeserialize(using = BigDecimalDeserializer.class)
    private BigDecimal distancia;
    @Column(nullable = false, precision = 6, scale = 2)
    @JsonDeserialize(using = BigDecimalDeserializer.class)
    private BigDecimal kcal;
    @Column(nullable = false, precision = 4, scale = 2)
    @JsonDeserialize(using = BigDecimalDeserializer.class)
    private BigDecimal pace;
    @Column(name = "created_at", nullable = false, updatable = false)
    @org.hibernate.annotations.CreationTimestamp
    private LocalDateTime createdAt;

    @ManyToOne(cascade = CascadeType.MERGE, fetch = FetchType.LAZY)
    @JoinColumn(name = "id_usuario", referencedColumnName = "id_usuario", nullable = true)
    private Usuario usuario;

    @ManyToOne(cascade = CascadeType.MERGE, fetch = FetchType.LAZY)
    @JoinColumn(name = "id_treino", referencedColumnName = "id_treino", nullable = true)
    private Treino treino;

    @OneToMany(mappedBy = "historicoTreino", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<TreinoPontosGPS> pontos;
}
