package br.com.belval.api.jornadaativa.model.services;

import br.com.belval.api.jornadaativa.model.entity.HistoricoTreino;

import java.util.List;

public interface HistoricoTreinoService {

    public HistoricoTreino findById(Long id);

    List<HistoricoTreino> findAll();

    public HistoricoTreino save(HistoricoTreino historicoTreino);

    public void delete(Long id);

    public HistoricoTreino update(HistoricoTreino historicoTreino, Long id);

}
