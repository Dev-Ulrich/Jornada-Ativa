package br.com.belval.api.jornadaativa.model.services;

import br.com.belval.api.jornadaativa.model.entity.Comunidades;

import java.util.List;

public interface ComunidadesService {

    public Comunidades findById(Long id);

    List<Comunidades> findAll();

    public Comunidades save(Comunidades comunidades);

    public void delete(Long id);

    public Comunidades update(Comunidades comunidades, Long id);

}
