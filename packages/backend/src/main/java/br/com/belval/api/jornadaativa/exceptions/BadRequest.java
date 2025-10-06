package br.com.belval.api.jornadaativa.exceptions;

public class BadRequest extends RuntimeException {

    public BadRequest(String message) {

        super(message);
    }
}