package br.com.belval.api.jornadaativa.model.services;

import br.com.belval.api.jornadaativa.model.entity.Usuario;
import java.util.List;

public interface UsuarioService {
    Usuario findById(Long id);

    List<Usuario> findAll();

    Usuario save(Usuario usuario);

    void delete(Long id);

    Usuario update(Usuario usuario, Long id);
}