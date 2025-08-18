package br.com.belval.api.jornadaativa.repository;

import java.util.List;

import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import br.com.belval.api.jornadaativa.model.Usuario;

@Repository
public interface UsuarioRepository extends CrudRepository<Usuario, Long> {

    // Buscar usuário por e-mail
    Usuario findByEmail(String email);

    // Buscar usuário por nome
    Usuario findByNome(String nome);

    // Buscar usuários por nível
    List<Usuario> findByNivel(Integer nivel);

    // Buscar usuários contendo parte do nome (ex: "Vic" -> "Victor")
    List<Usuario> findByNomeContainingIgnoreCase(String nome);


}