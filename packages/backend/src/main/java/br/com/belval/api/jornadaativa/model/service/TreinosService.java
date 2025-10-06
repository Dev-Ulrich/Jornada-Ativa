package br.com.belval.api.jornadaativa.model.service;


import br.com.belval.api.jornadaativa.exceptions.NotFound;
import br.com.belval.api.jornadaativa.model.entity.Treinos;
import br.com.belval.api.jornadaativa.model.repository.TreinoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class TreinosService {

    private final TreinoRepository treinoRepository;

    @Transactional
    public Treinos criar(Treinos treino) {
        return treinoRepository.save(treino);
    }

    @Transactional
    public Treinos atualizar(Long id, Treinos dto) {
        Treinos treino = buscarPorId(id);
        treino.setNome(dto.getNome());
        treino.setDescricao(dto.getDescricao());
        return treinoRepository.save(treino);
    }

    @Transactional
    public void excluir(Long id) {
        Treinos treino = buscarPorId(id);
        treinoRepository.delete(treino);
    }

    public Treinos buscarPorId(Long id) {
        return treinoRepository.findById(id)
                .orElseThrow(() -> new NotFound("Treino não encontrado: " + id));
    }

    public List<Treinos> listar(String nome) {
        return (nome == null || nome.isBlank())
                ? treinoRepository.findAll()
                : treinoRepository.findByNomeContainingIgnoreCase(nome);
    }

}
