package br.com.belval.api.jornadaativa.exceptions;

import java.time.LocalDateTime;
import java.time.ZoneId;

import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;


@RestControllerAdvice
@Slf4j
public class AppExceptionHander {

    private final ZoneId zoneBrasil = ZoneId.of("America/Sao_Paulo");

    // Erro 400
    @ExceptionHandler(BadRequest.class)
    public ResponseEntity<Object> handleBadRequest(BadRequest ex) {
        return buildErrorResponse(ex, HttpStatus.BAD_REQUEST, ex.getMessage());
    }

    // Erro 404 (recurso não encontrado)
    @ExceptionHandler(NotFound.class)
    public ResponseEntity<Object> handleNotFound(NotFound ex) {
        return buildErrorResponse(ex, HttpStatus.NOT_FOUND, ex.getMessage());
    }

    // Erro 403 (Acesso proibido)
    @ExceptionHandler(Forbidden.class)
    public ResponseEntity<Object> handleForbide(Forbidden ex) {
        return buildErrorResponse(ex, HttpStatus.FORBIDDEN, ex.getMessage());
    }

    // Erro 500 (Problemas no Servidor)
    @ExceptionHandler(Exception.class)
    public ResponseEntity<Object> handleGenericException(Exception ex) {
        return buildErrorResponse(ex, HttpStatus.INTERNAL_SERVER_ERROR, "Ocorreu um erro interno no servidor.");
    }

    private ResponseEntity<Object> buildErrorResponse(Exception e, HttpStatus status, String userMessage) {
        log.error("Erro [{}]: {}", status, e.getMessage(), e);
        String[] messages = { userMessage };
        ErrorMessage errorMessage = new ErrorMessage(LocalDateTime.now(zoneBrasil), messages, status);
        return new ResponseEntity<>(errorMessage, new HttpHeaders(), status);
    }

}