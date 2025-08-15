package br.com.belval.api.jornadaativa.repository;

import java.util.List;

import org.springframework.data.repository.CrudRepository;

import br.com.belval.api.jornadaativa.model.Comunidades;

public interface ComunidadesRepository extends CrudRepository<Comunidades, Integer> {
    
    List<Comunidades> findByNomeContainingIgnoreCase(String nome);
    List<Comunidades> findByIntegrantesContainingIgnoreCase(String integrantes);
}