package br.com.belval.api.jornadaativa.model.entity;

import java.util.List;

import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;
import jakarta.persistence.OneToMany;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

@Entity
@DiscriminatorValue("CLIENTE")
@Data
@AllArgsConstructor
@NoArgsConstructor
@EqualsAndHashCode(callSuper = false)
public class Cliente extends Usuario {

    @OneToMany(mappedBy = "usuario")
    private List<HistoricoTreino> historicoTreinos;

    @OneToMany(mappedBy = "usuario")
    private List<UsuarioComunidade> comunidades;

    @OneToMany(mappedBy = "usuario")
    private List<Postagem> postagens;

    

}
