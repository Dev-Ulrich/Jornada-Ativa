package br.com.belval.api.jornadaativa.repository;

import br.com.belval.api.jornadaativa.model.UsuarioComunidade;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;
import java.time.LocalDateTime;

@Repository
public interface UsuarioComunidadeRepository extends JpaRepository<UsuarioComunidade, Long> {

    Optional findById(Long id);

    List<UsuarioComunidade> findByDataEntrada(LocalDateTime dataEntrada);
}