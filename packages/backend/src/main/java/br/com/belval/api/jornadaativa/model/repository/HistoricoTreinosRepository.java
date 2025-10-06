package br.com.belval.api.jornadaativa.model.repository;


import br.com.belval.api.jornadaativa.model.entity.HistoricoTreinos;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface HistoricoTreinosRepository extends JpaRepository<HistoricoTreinos, Long> {

    // todos os históricos de um usuário
    List<HistoricoTreinos> findByUsuarioId(Long usuarioId);

    // paginação + ordenação por data desc (use Pageable com sort, se quiser)
    Page<HistoricoTreinos> findByUsuarioId(Long usuarioId, Pageable pageable);

    // buscar por faixa de datas de um usuário
    List<HistoricoTreinos> findByUsuarioIdAndDataBetween(Long usuarioId, LocalDate inicio, LocalDate fim);
}
