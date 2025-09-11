package br.com.belval.api.jornadaativa.model.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;

import org.springframework.stereotype.Repository;

import br.com.belval.api.jornadaativa.model.entity.Comunidades;

@Repository
public interface ComunidadesRepository extends JpaRepository<Comunidades, Long> {
    
}