package br.com.belval.api.jornadaativa.model.repository;


import br.com.belval.api.jornadaativa.model.entity.Eventos;
import br.com.belval.api.jornadaativa.model.entity.StatusEvento;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface EventosRepository extends JpaRepository<Eventos, Long> {

    // busca por nome/parte do nome
    List<Eventos> findByNomeContainingIgnoreCase(String nome);

    // eventos a partir de uma data (ex.: próximos eventos)
    List<Eventos> findByDataEventoGreaterThanEqualOrderByDataEventoAsc(LocalDate data);

    // eventos em um intervalo
    List<Eventos> findByDataEventoBetweenOrderByDataEventoAsc(LocalDate inicio, LocalDate fim);

    //Status evento
    long countByStatus(StatusEvento status);
}
