package br.com.belval.api.jornadaativa.repository;

import java.time.LocalDateTime;
import java.util.List;

import br.com.belval.api.jornadaativa.model.Postagem;

import org.springframework.data.jpa.repository.JpaRepository;

import org.springframework.stereotype.Repository;

@Repository
public interface PostagemRepository extends JpaRepository<Postagem, Long> {
    List<Postagem> findByCreatedAt(LocalDateTime createdAt);
}