package br.com.belval.api.jornadaativa.model.entity;

import java.time.LocalDateTime;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Table(name = "Postagem")
public class Postagem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_postagem")
    private Long id;

    @Column(nullable = false, columnDefinition = "NVARCHAR(MAX)")
    private String conteudo;

    @Column(nullable = false)
    private Integer coracao = 0;

    @Column(nullable = false)
    private Integer likes = 0;

    @Column(name = "emoji_feliz", nullable = false)
    private Integer emojiFeliz = 0;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;


    @ManyToOne(cascade = CascadeType.MERGE, fetch = FetchType.LAZY)
    @JoinColumn(name = "id_usuario", referencedColumnName = "id_usuario", nullable = true)
    private Usuario usuario;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_comunidade", referencedColumnName = "id_comunidade")
    private Comunidades comunidade;
}