package br.com.belval.api.jornadaativa.exceptions;


public class Forbidden extends RuntimeException {

    public Forbidden(String message) {
        super(message);
    }
}