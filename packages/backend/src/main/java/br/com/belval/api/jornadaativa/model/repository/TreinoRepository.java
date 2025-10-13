package br.com.belval.api.jornadaativa.model.repository;


import br.com.belval.api.jornadaativa.model.entity.Treinos;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TreinoRepository extends JpaRepository<Treinos, Long> {

    List<Treinos> findByNomeContainingIgnoreCase(String nome);

    List<Treinos> findByNivelContainingIgnoreCase(String nivel);
}
