package br.com.belval.api.jornadaativa.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;


import br.com.belval.api.jornadaativa.model.Comunidades;

import java.time.LocalDateTime;

import org.springframework.stereotype.Repository;

@Repository
public interface ComunidadesRepository extends JpaRepository<Comunidades, Integer> {

    List<Comunidades> findByNomeContainingIgnoreCase(String nome);

    List<Comunidades> findByCreatedAt(LocalDateTime createdAt);
}