package br.com.belval.api.jornadaativa.model;

import java.time.LocalDateTime;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.*;
import lombok.*;
import java.util.List;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Table(name = "comunidade")
public class Comunidades {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_comunidade")
    private Long idComunidade;

    @Column(nullable = false, length = 255)
    private String nome;

    @Column(name = "ft_comunidade", length = 255)
    private String ftComunidade;

    @Column(name = "id_usuario_criador", nullable = false)
    private Long idUsuarioCriador;

    @Column(nullable = false, length = 255)
    private String descricao;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @ManyToOne(cascade = CascadeType.MERGE, fetch = FetchType.LAZY)
    @JoinColumn(name = "id_usuario_criador", referencedColumnName = "id_usuario", nullable = true)
    private Usuario usuarioCriador;

    @OneToMany(mappedBy = "comunidade", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JsonIgnore
    private List<UsuarioComunidade> membros;

    @OneToMany(mappedBy = "comunidade", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JsonIgnore
    private List<Postagem> postagens;

}