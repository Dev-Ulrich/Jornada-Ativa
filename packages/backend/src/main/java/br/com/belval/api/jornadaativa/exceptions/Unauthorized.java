package br.com.belval.api.jornadaativa.exceptions;

public class Unauthorized extends RuntimeException {

    public Unauthorized(String message) {
        super(message);
    }
}
