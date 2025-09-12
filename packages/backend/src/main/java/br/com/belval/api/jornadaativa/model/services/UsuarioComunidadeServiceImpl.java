package br.com.belval.api.jornadaativa.model.services;

import br.com.belval.api.jornadaativa.exceptions.NotFound;
import br.com.belval.api.jornadaativa.model.entity.UsuarioComunidade;
import br.com.belval.api.jornadaativa.model.repository.UsuarioComunidadeRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Service
@Transactional
@AllArgsConstructor
public class UsuarioComunidadeServiceImpl implements UsuarioComunidadeService {

    private final UsuarioComunidadeRepository usuarioComunidadeRepository;

    @Override
    public UsuarioComunidade findById(Long id) {
        return usuarioComunidadeRepository.findById(id)
                .orElseThrow(() -> new NotFound("UsuárioComunidade não encontrado com o id " + id));
    }

    @Override
    public List<UsuarioComunidade> findAll() {
        return usuarioComunidadeRepository.findAll();
    }

    @Override
    public UsuarioComunidade save(UsuarioComunidade usuarioComunidade) {
        return usuarioComunidadeRepository.save(usuarioComunidade);
    }

    @Override
    public void delete(Long id) {
        if (!usuarioComunidadeRepository.existsById(id)) {
            throw new NotFound("UsuárioComunidade não encontrado com o id " + id);
        }
        usuarioComunidadeRepository.deleteById(id);
    }

    @Override
    public UsuarioComunidade update(UsuarioComunidade usuarioComunidade, Long id) {
        UsuarioComunidade atual = findById(id);
        atual.setDataEntrada(usuarioComunidade.getDataEntrada());
        atual.setUsuario(usuarioComunidade.getUsuario());
        atual.setComunidade(usuarioComunidade.getComunidade());
        return usuarioComunidadeRepository.save(atual);
    }
}