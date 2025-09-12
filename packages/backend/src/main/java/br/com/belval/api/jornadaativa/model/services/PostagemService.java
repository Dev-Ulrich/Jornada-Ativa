package br.com.belval.api.jornadaativa.model.services;

import br.com.belval.api.jornadaativa.model.entity.Postagem;

import java.util.List;

public interface PostagemService {

    Postagem findById(Long id);

    List<Postagem> findAll();

    Postagem save(Postagem postagem);

    void delete(Long id);

    Postagem update(Postagem postagem, Long id);
}
