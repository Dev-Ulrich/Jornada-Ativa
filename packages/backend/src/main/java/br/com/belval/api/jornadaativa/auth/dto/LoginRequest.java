package br.com.belval.api.jornadaativa.auth.dto;

import com.fasterxml.jackson.annotation.JsonAlias;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public record LoginRequest(
        @Email @NotBlank String email,
        @NotBlank @JsonAlias({"senha"}) String password

) {}
