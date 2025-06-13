package br.com.belval.api.jornadaativa.controller;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import br.com.belval.api.jornadaativa.model.Eventos;
import br.com.belval.api.jornadaativa.repository.EventosRepository;

@RestController
public class EventoController {

    @Autowired
    private EventosRepository eventosRepository;

    @GetMapping("/eventos")
    public ResponseEntity<Iterable<Eventos>> obterEventos() {
        return ResponseEntity
                .status(HttpStatus.OK)
                .body(eventosRepository.findAll());
    }

    @GetMapping("/eventos/{id}")
    public ResponseEntity<Object> buscarPorId(@PathVariable Integer id) {
        Optional<Eventos> evento = eventosRepository.findById(id);

        if (evento.isPresent()) {
            return ResponseEntity
                    .status(HttpStatus.OK)
                    .body(evento.get());
        }
        return ResponseEntity
                .status(HttpStatus.NOT_FOUND)
                .body("Evento não encontrado");
    }

    @PostMapping("/eventos")
    public ResponseEntity<Eventos> criarEvento(@RequestBody Eventos evento) {
        eventosRepository.save(evento);
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(evento);
    }

    @PutMapping("/eventos/{id}")
    public ResponseEntity<Object> atualizarEvento(
            @PathVariable Integer id, @RequestBody Eventos evento) {
        Optional<Eventos> eventoExistente = eventosRepository.findById(id);

        if (eventoExistente.isPresent()) {
            evento.setId(id);
            eventosRepository.save(evento);
            return ResponseEntity
                    .status(HttpStatus.OK)
                    .body(evento);
        }
        return ResponseEntity
                .status(HttpStatus.NOT_FOUND)
                .body("Evento não encontrado");
    }

    @DeleteMapping("/eventos/{id}")
    public ResponseEntity<Object> excluirEvento(@PathVariable Integer id) {
        Optional<Eventos> eventoExistente = eventosRepository.findById(id);

        if (eventoExistente.isPresent()) {
            eventosRepository.deleteById(id);
            return ResponseEntity
                    .status(HttpStatus.NO_CONTENT)
                    .build();
        }
        return ResponseEntity
                .status(HttpStatus.NOT_FOUND)
                .body("Evento não encontrado");
    }
}