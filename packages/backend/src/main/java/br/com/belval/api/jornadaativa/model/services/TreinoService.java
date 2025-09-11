package br.com.belval.api.jornadaativa.model.services;
import br.com.belval.api.jornadaativa.model.entity.Treino;

import java.util.List;

public interface TreinoService {

    public Treino findById(Long id);

    List<Treino> findAll();

    public Treino save(Treino treino);

    public void delete(Long id);

    public Treino update(Treino Treino, Long id);

}
