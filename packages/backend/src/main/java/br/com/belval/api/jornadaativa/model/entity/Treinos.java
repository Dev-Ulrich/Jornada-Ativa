package br.com.belval.api.jornadaativa.model.entity;


import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;


@Entity
@Table(name = "Treino")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor
public class Treinos {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_treino")
    private Long id;

    @Column(name = "nome", nullable = false, length = 255)
    private String nome;

    @Column(name = "descricao", length = 255)
    private String descricao;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "nivel", length = 50, nullable = false)
    private String nivel;


}

