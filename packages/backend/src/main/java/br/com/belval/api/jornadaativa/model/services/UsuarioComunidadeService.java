package br.com.belval.api.jornadaativa.model.services;

import br.com.belval.api.jornadaativa.model.entity.UsuarioComunidade;
import java.util.List;

public interface UsuarioComunidadeService {
    UsuarioComunidade findById(Long id);

    List<UsuarioComunidade> findAll();

    UsuarioComunidade save(UsuarioComunidade usuarioComunidade);

    void delete(Long id);

    UsuarioComunidade update(UsuarioComunidade usuarioComunidade, Long id);
}
