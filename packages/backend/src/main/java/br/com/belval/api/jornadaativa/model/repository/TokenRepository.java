package br.com.belval.api.jornadaativa.model.repository;


import br.com.belval.api.jornadaativa.model.entity.Token;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;


@Repository
public interface TokenRepository extends JpaRepository<Token, Long> {

    Optional<Token> findByToken(String token);

    // tokens válidos do usuário (não expirados e não revogados)
    @Query("""
           select t from Token t
           where t.usuario.id = :usuarioId
             and t.expired = false
             and t.revoked = false
           """)
    List<Token> findAllValidTokenByUser(Long usuarioId);
}
