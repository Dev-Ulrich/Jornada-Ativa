package br.com.belval.api.jornadaativa.model.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import br.com.belval.api.jornadaativa.model.entity.UsuarioComunidade;

import java.util.List;
import java.util.Optional;
import java.time.LocalDateTime;

@Repository
public interface UsuarioComunidadeRepository extends JpaRepository<UsuarioComunidade, Long> {

}