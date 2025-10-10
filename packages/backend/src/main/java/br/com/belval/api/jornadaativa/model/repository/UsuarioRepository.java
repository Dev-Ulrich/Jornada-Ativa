package br.com.belval.api.jornadaativa.model.repository;


import br.com.belval.api.jornadaativa.model.entity.Usuarios;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.Optional;


@Repository
public interface UsuarioRepository extends JpaRepository<Usuarios, Long> {

    Optional<Usuarios> findByEmail(String email);

    boolean existsByEmail(String email);


    long countByCreatedAtBetween(LocalDateTime inicio, LocalDateTime fim);


}
