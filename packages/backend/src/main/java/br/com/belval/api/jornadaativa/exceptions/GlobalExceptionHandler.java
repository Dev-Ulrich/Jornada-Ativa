package br.com.belval.api.jornadaativa.exceptions;



import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.HashMap;
import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {

    private final ZoneId zoneBrasil = ZoneId.of("America/Sao_Paulo");

    // Erro 400 ( Url mal formada pelo front-end)
    @ExceptionHandler(BadRequest.class)
    public ResponseEntity<Object> handleBadRequest(BadRequest ex) {
        return buildErrorResponse( HttpStatus.BAD_REQUEST, "Ulr mal formata pelo front-end", ex.getMessage(), null);
    }


    // 404 – recurso não encontrado
    @ExceptionHandler(NotFound.class)
    public ResponseEntity<Object> handleNotFound(NotFound ex) {
        return buildErrorResponse(HttpStatus.NOT_FOUND, "Recurso não encontrado.", ex.getMessage(), null);
    }

    // 409 – conflito de dados (duplicidade etc.)
    @ExceptionHandler(Business.class)
    public ResponseEntity<Object> handleBusiness(Business ex) {
        return buildErrorResponse(HttpStatus.CONFLICT, "Conflito de dados.", ex.getMessage(), null);
    }

    // Erro 500 ( Problemas no Servidor )
    @ExceptionHandler(Exception.class)
    public ResponseEntity<Object> handleGenericException(Exception ex) {
        return buildErrorResponse(HttpStatus.INTERNAL_SERVER_ERROR, "Ocorreu um erro interno no servidor.", ex.getMessage(), null);
    }


    // 401 – não autenticado
    @ExceptionHandler(Unauthorized.class)
    public ResponseEntity<Object> handleUnauthorized(Unauthorized ex) {
        return buildErrorResponse(HttpStatus.UNAUTHORIZED, "Não autenticado.", ex.getMessage(), null);
    }

    // 403 – sem permissão
    @ExceptionHandler(Forbidden.class)
    public ResponseEntity<Object> handleForbidden(Forbidden ex) {
        return buildErrorResponse(HttpStatus.FORBIDDEN, "Acesso negado.", ex.getMessage(), null);
    }

    private ResponseEntity<Object> buildErrorResponse(
            HttpStatus status,
            String error,
            String message,
            Map<String, ?> details
    ) {
        Map<String, Object> body = new HashMap<>();
        body.put("timestamp", LocalDateTime.now());
        body.put("status", status.value());
        body.put("error", error);
        body.put("message", message);
        if (details != null && !details.isEmpty()) {
            body.put("details", details);
        }
        return ResponseEntity.status(status).body(body);
    }

}
