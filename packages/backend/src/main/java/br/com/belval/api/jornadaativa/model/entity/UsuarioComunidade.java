package br.com.belval.api.jornadaativa.model.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Table(name = "Usuario_Comunidade")
public class UsuarioComunidade {

    @EmbeddedId
    private UsuarioComunidadeId id;

    @ManyToOne(cascade = CascadeType.MERGE, fetch = FetchType.LAZY)
    @MapsId("idUsuario")
    @JoinColumn(name = "id_usuario")
    private Usuario usuario;

    @ManyToOne(cascade = CascadeType.MERGE, fetch = FetchType.LAZY)
    @MapsId("idComunidade")
    @JoinColumn(name = "id_comunidade")
    private Comunidades comunidade;

    @Column(name = "data_entrada", nullable = false)
    private java.time.LocalDateTime dataEntrada;
}