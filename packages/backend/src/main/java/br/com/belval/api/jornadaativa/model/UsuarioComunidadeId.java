package br.com.belval.api.jornadaativa.model;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import lombok.*;

import java.io.Serializable;

@Embeddable
@Data
@NoArgsConstructor
@AllArgsConstructor
public class UsuarioComunidadeId implements Serializable {
    @Column(name = "id_usuario")
    private Long idUsuario;
    @Column(name = "id_comunidade")
    private Long idComunidade;
}