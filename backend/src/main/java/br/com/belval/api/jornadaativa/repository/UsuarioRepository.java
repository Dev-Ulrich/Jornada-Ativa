package br.com.belval.api.jornadaativa.repository;

import java.util.List;

import org.springframework.data.repository.CrudRepository;

import br.com.belval.api.jornadaativa.model.Usuarios;

public interface UsuarioRepository extends CrudRepository<Usuarios, Integer> {

    List<Usuarios> findByNomeContainingIgnoreCase(String nome);
}