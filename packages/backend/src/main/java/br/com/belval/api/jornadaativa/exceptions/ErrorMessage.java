package br.com.belval.api.jornadaativa.exceptions;



import lombok.Data;
import org.springframework.http.HttpStatus;

import java.time.LocalDateTime;


@Data
public class ErrorMessage {

    private LocalDateTime timestamp;
    private String[] messages;
    private HttpStatus title;
    private int  status;
    public ErrorMessage(LocalDateTime timestamp, String[] messages, HttpStatus title) {
        this.timestamp = timestamp;
        this.messages = messages;
        this.title = title;
        this.status = title.value();

    }
}
