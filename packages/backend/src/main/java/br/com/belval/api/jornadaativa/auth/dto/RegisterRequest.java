package br.com.belval.api.jornadaativa.auth.dto;

import br.com.belval.api.jornadaativa.model.entity.RoleName;
import com.fasterxml.jackson.annotation.JsonAlias;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

import java.math.BigDecimal;
import java.time.LocalDate;

public record RegisterRequest (
        @NotBlank String nome,
        @Email @NotBlank String email,
        @NotBlank @JsonAlias({"senha"}) String password,
        String genero,          // "M", "F", "N/D" (ou o que você usa)
        LocalDate dataNascimento,
        String nivel,           // "INICIANTE" / "INTERMEDIARIO" / etc.
        BigDecimal altura,          // ex: 1.75
        BigDecimal peso,            // ex: 82.30
        @JsonAlias({"ftPerfil","foto"}) String ftPerfil,
        RoleName role// opcional; default = ROLE_USER) {
) {}
