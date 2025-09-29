package br.com.belval.api.jornadaativa.exceptions.security;


import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.util.Map;

@Component
public class CustomAuthenticationEntryPoint implements AuthenticationEntryPoint {

    @Override
    public void commence(HttpServletRequest request, HttpServletResponse response, AuthenticationException authException) throws IOException, ServletException {
        response.setStatus(HttpServletResponse.SC_UNAUTHORIZED); // 401
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        var mapper = new ObjectMapper();
        var erro = Map.of(
                "status", 401,
                "erro", "Você não está autenticado. Faça login para acessar este recurso."
        );

        response.getWriter().write(mapper.writeValueAsString(erro));

        //response.getWriter().write("{\"erro\": \"Você não está autenticado. Faça login para acessar este recurso.\"}");
    }
}