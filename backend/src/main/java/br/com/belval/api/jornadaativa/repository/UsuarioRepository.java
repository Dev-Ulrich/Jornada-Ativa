package br.com.belval.api.jornadaativa.repository;

import java.util.List;

import org.springframework.data.repository.CrudRepository;

import br.com.belval.api.jornadaativa.model.Usuario;

public interface UsuarioRepository extends CrudRepository<Usuario, Integer> {

    List<Usuario> findByNomeContainingIgnoreCase(String nome);
}