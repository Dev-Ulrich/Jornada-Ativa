package br.com.belval.api.jornadaativa.model;

import jakarta.persistence.Embeddable;
import lombok.*;

import java.io.Serializable;

@Embeddable
@Data
@NoArgsConstructor
@AllArgsConstructor
public class UsuarioComunidadeId implements Serializable {
    private Long idUsuario;
    private Long idComunidade;
}