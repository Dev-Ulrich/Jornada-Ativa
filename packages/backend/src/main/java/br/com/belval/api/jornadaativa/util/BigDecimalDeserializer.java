package br.com.belval.api.jornadaativa.util;

import com.fasterxml.jackson.core.JsonParser;
import com.fasterxml.jackson.databind.DeserializationContext;
import com.fasterxml.jackson.databind.JsonDeserializer;

import java.io.IOException;
import java.math.BigDecimal;

public class BigDecimalDeserializer extends JsonDeserializer<BigDecimal> {

    @Override
    public BigDecimal deserialize(JsonParser p, DeserializationContext ctxt) throws IOException {

        String valor = p.getText();
        if (valor == null || valor.isEmpty()) {
            return BigDecimal.ZERO;
        }
        valor = valor.replace(",", ".");
        return new BigDecimal(valor);
    }
}