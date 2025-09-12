package br.com.belval.api.jornadaativa.model.services;

import br.com.belval.api.jornadaativa.model.entity.Eventos;

import java.util.List;

public interface EventosService {

    Eventos findById (Long id);

    List<Eventos> findAll();

    Eventos save(Eventos eventos);

    void delete(Long id);

    Eventos update(Eventos eventos, long id);
}
