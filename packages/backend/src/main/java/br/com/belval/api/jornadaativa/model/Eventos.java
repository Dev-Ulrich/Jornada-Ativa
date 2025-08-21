package br.com.belval.api.jornadaativa.model;

import java.time.LocalDate;
import java.time.LocalDateTime;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Table(name = "eventos")
public class Eventos {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_evento")
    private Long idEvento;

    @Column(nullable = false, length = 255)
    private String nome;

    @Column(nullable = false, length = 255)
    private String descricao;

    @Column(name = "link_evento", nullable = false, length = 255)
    private String linkEvento;

    @Column(name = "data_evento")
    private LocalDate dataEvento;

    @Column(name = "imagem_evento", length = 255)
    private String imagemEvento;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;
}