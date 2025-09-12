package br.com.belval.api.jornadaativa.model.services;

import br.com.belval.api.jornadaativa.model.entity.Comunidades;
import br.com.belval.api.jornadaativa.model.repository.ComunidadesRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
@AllArgsConstructor
public class ComunidadesServiceImpl implements ComunidadesService {

    private ComunidadesRepository comunidadesRepository;

    @Override
    public Comunidades findById(Long id) {
        return comunidadesRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Comunidade não encontrada com o id " + id));
    }

    @Override
    public List<Comunidades> findAll() {
        return comunidadesRepository.findAll();
    }

    @Override
    public Comunidades save(Comunidades comunidades) {
        return comunidadesRepository.save(comunidades);
    }

    @Override
    public void delete(Long id) {
        if (!comunidadesRepository.existsById(id)) {
            throw new RuntimeException("Comunidade não encontrada com o id " + id);
        }
        comunidadesRepository.deleteById(id);
    }

    @Override
    public Comunidades update(Comunidades comunidades, Long id) {
        Comunidades comunidadeAtual = findById(id);
        comunidadeAtual.setNome(comunidades.getNome());
        comunidadeAtual.setFtComunidade(comunidades.getFtComunidade);
        comunidadeAtual.setDescricao(comunidades.getDescricao);
        return comunidadesRepository.save(comunidadeAtual);
    }
}
