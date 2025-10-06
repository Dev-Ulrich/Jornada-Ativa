package br.com.belval.api.jornadaativa.model.service;


import br.com.belval.api.jornadaativa.exceptions.Business;
import br.com.belval.api.jornadaativa.exceptions.NotFound;
import br.com.belval.api.jornadaativa.model.entity.Token;
import br.com.belval.api.jornadaativa.model.entity.TokenType;
import br.com.belval.api.jornadaativa.model.entity.Usuarios;
import br.com.belval.api.jornadaativa.model.repository.TokenRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Clock;
import java.time.Instant;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class TokenService {

    private final TokenRepository tokenRepository;

    // Opcional (para testes): permite injetar clock e manipular "agora"
    private final Clock clock = Clock.systemUTC();

    /** Cria e persiste um token do tipo BEARER para o usuário informado. */
    @Transactional
    public Token criarTokenParaUsuario(Usuarios usuario, String tokenString) {
        if (usuario == null || usuario.getId() == null) {
            throw new Business("Usuário inválido para criação de token.");
        }
        if (tokenString == null || tokenString.isBlank()) {
            throw new Business("Token não pode ser vazio.");
        }
        Token token = Token.builder()
                .token(tokenString)
                .tokenType(TokenType.BEARER)
                .revoked(false)
                .expired(false)
                .usuario(usuario)
                .build();
        return tokenRepository.save(token);
    }

    /** Revoga todos os tokens válidos (não revogados e não expirados) do usuário. */
    @Transactional
    public void revogarTokensValidosDoUsuario(Long usuarioId) {
        List<Token> validos = tokenRepository.findAllValidTokenByUser(usuarioId);
        if (validos.isEmpty()) return;

        for (Token t : validos) {
            t.setRevoked(true);
            t.setExpired(true);
        }
        tokenRepository.saveAll(validos);
    }

    /** Revoga um token específico (ex.: logout de uma sessão) */
    @Transactional
    public void revogarToken(String tokenString) {
        Token token = buscarPorString(tokenString);
        token.setRevoked(true);
        token.setExpired(true);
        tokenRepository.save(token);
    }

    /** Busca token por string ou lança 404. */
    public Token buscarPorString(String tokenString) {
        return tokenRepository.findByToken(tokenString)
                .orElseThrow(() -> new NotFound("Token não encontrado."));
    }

    /** Valida token: precisa existir, não estar expirado nem revogado. */
    public void validarOuLancar(String tokenString) {
        Token token = buscarPorString(tokenString);
        boolean expired = Boolean.TRUE.equals(token.getExpired());
        boolean revoked = Boolean.TRUE.equals(token.getRevoked());
        if (expired || revoked) {
            throw new Business("Token inválido ou revogado.");
        }
    }

    /** Marca token como expirado (útil em fluxos refresh/expiração manual). */
    @Transactional
    public void expirarToken(String tokenString) {
        Token token = buscarPorString(tokenString);
        token.setExpired(true);
        tokenRepository.save(token);
    }

    /** (Opcional) Remove tokens com alguma política de expiração baseada no tempo. */
    @Transactional
    public int limparTokensExpiradosAntigos(Instant limite) {
        List<Token> expirados = tokenRepository.findAll().stream()
                .filter(t -> Boolean.TRUE.equals(t.getExpired()) || Boolean.TRUE.equals(t.getRevoked()))
                .toList();
        if (expirados.isEmpty()) return 0;
        tokenRepository.deleteAll(expirados);
        return expirados.size();
    }

    /** Helper: "agora" (para políticas de expiração com tempo, se você adicionar timestamps ao Token). */
    private Instant agora() {
        return Instant.now(clock);
    }
}
