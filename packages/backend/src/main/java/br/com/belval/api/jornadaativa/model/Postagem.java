package br.com.belval.api.jornadaativa.model;

import java.time.LocalDateTime;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Table(name = "postagem")
public class Postagem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_postagem")
    private Long idPostagem;

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
    @JoinColumn(name = "usuario_id", referencedColumnName = "idUsuario", nullable = true)
    private Usuario usuario;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "comunidade_id", referencedColumnName = "idComunidade")
    private Comunidades comunidade;
}