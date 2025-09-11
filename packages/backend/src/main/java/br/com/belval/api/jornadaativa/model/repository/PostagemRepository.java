package br.com.belval.api.jornadaativa.model.repository;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import org.springframework.stereotype.Repository;

import br.com.belval.api.jornadaativa.model.entity.Postagem;

@Repository
public interface PostagemRepository extends JpaRepository<Postagem, Long> {

}