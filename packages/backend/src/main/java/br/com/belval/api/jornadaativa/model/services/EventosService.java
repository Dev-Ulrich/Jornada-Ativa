package br.com.belval.api.jornadaativa.model.services;

import br.com.belval.api.jornadaativa.model.entity.Eventos;

import java.util.List;

public interface EventosService {

    public Eventos findById (long id);

    List<Eventos> findAll();

    public Eventos save(Eventos eventos);

    public void delete(Eventos eventos);

    public void delete(Eventos eventos, long id);
}
