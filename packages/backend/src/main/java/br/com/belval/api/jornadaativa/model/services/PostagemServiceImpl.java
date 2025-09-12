package br.com.belval.api.jornadaativa.model.services;


import br.com.belval.api.jornadaativa.exceptions.NotFound;
import br.com.belval.api.jornadaativa.model.entity.Postagem;
import br.com.belval.api.jornadaativa.model.entity.Usuario;
import br.com.belval.api.jornadaativa.model.repository.PostagemRepository;
import br.com.belval.api.jornadaativa.model.repository.UsuarioRepository;
import jakarta.transaction.Transactional;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@Transactional
@AllArgsConstructor
public class PostagemServiceImpl implements PostagemService {

    private final PostagemRepository postagemRepository;

    @Override
    public Postagem findById(Long id) {
        return postagemRepository.findById(id)
                .orElseThrow(() -> new NotFound("Postagem não encontrado com o id " + id));
    }

    @Override
    public List<Postagem> findAll() {
        return postagemRepository.findAll();
    }

    @Override
    public Postagem save(Postagem postagem) {
        return postagemRepository.save(postagem);
    }

    @Override
    public void delete(Long id) {
        if (!postagemRepository.existsById(id)) {
            throw new NotFound("Postagem não encontrado com o id " + id);
        }
        postagemRepository.deleteById(id);
    }

    @Override
    public Postagem update(Postagem postagem, Long id) {
        Postagem postagemAtual = findById(id);
        postagemAtual.setConteudo(postagem.getConteudo());
        postagemAtual.setCoracao(postagem.getCoracao());
        postagemAtual.setLikes(postagem.getLikes());
        postagemAtual.setEmojiFeliz(postagem.getEmojiFeliz());

        return postagemRepository.save(postagemAtual);
    }
}
