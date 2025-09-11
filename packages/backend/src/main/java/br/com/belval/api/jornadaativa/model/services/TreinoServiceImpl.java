package br.com.belval.api.jornadaativa.model.services;

import br.com.belval.api.jornadaativa.exceptions.NotFound;
import br.com.belval.api.jornadaativa.model.entity.Treino;
import br.com.belval.api.jornadaativa.model.repository.TreinoRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
@AllArgsConstructor
public class TreinoServiceImpl implements TreinoService {

    private final TreinoRepository treinoRepository;

    @Override
    public Treino findById(Long id) {
        return treinoRepository.findById(id)
                .orElseThrow(() -> new NotFound("Treino não encontrado com o id " + id));
    }

    @Override
    public List<Treino> findAll() {
        return treinoRepository.findAll();
    }

    @Override
    public Treino save(Treino treino) {
        return treinoRepository.save(treino);
    }

    @Override
    public void delete(Long id) {
        if (!treinoRepository.existsById(id)) {
            throw new NotFound("Treino não encontrado com o id " + id);
        }
        treinoRepository.deleteById(id);
    }

    @Override
    public Treino update(Treino treino, Long id) {
        Treino treinoAtual = findById(id);
        treinoAtual.setNome(treino.getNome());
        treinoAtual.setDescricao(treino.getDescricao());
        
        return treinoRepository.save(treinoAtual);
    }
}