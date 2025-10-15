package br.com.belval.api.jornadaativa.auth.dto;

import br.com.belval.api.jornadaativa.model.entity.RoleName;

import java.math.BigDecimal;
import java.time.LocalDate;

public record RegisterRequest (
        String nome,
        String email,
        String password,
        String genero,          // "M", "F", "N/D" (ou o que você usa)
        LocalDate dataNascimento,
        String nivel,           // "INICIANTE" / "INTERMEDIARIO" / etc.
        BigDecimal altura,          // ex: 1.75
        BigDecimal peso,            // ex: 82.30
        RoleName role// opcional; default = ROLE_USER) {
) {}
