package br.com.belval.api.jornadaativa.exceptions.security;


import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.web.access.AccessDeniedHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.util.Map;

@Component
public class CustomAccessDeniedHandler implements AccessDeniedHandler {
    @Override
    public void handle(HttpServletRequest request, HttpServletResponse response, AccessDeniedException accessDeniedException) throws IOException, ServletException {
        response.setStatus(HttpServletResponse.SC_FORBIDDEN); // 403
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        var mapper = new ObjectMapper();
        var erro = Map.of(
                "status", 403,
                "erro", "Acesso negado: você não tem permissão para acessar este recurso."
        );
        response.getWriter().write(mapper.writeValueAsString(erro));
        // response.getWriter().write("{\"erro\": \"Acesso negado: você não tem permissão para acessar este recurso.\"}");
    }
}
