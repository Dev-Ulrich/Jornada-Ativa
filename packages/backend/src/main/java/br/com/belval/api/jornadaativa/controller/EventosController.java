package br.com.belval.api.jornadaativa.controller;


import br.com.belval.api.jornadaativa.exceptions.BadRequest;
import br.com.belval.api.jornadaativa.model.entity.Eventos;
import br.com.belval.api.jornadaativa.model.entity.Usuario;
import br.com.belval.api.jornadaativa.model.repository.EventosRepository;
import br.com.belval.api.jornadaativa.model.services.EventosService;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.net.URI;
import java.util.List;

@RestController
@RequestMapping("/api/eventos")
@AllArgsConstructor
public class EventosController {

    private final EventosRepository eventosRepository;
    private final EventosService eventosService;

    @GetMapping
    public ResponseEntity<List<Eventos>> findAll() {
        return ResponseEntity.ok().body(eventosService.findAll());
    }

    @PostMapping
    public ResponseEntity<Eventos> save(@RequestBody Eventos eventos) {
        URI uri = URI.create(ServletUriComponentsBuilder.fromCurrentContextPath().path("/api/eventos").toUriString());
        return ResponseEntity.created(uri).body(eventosService.save(eventos));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Eventos> findById(@PathVariable(value = "id") String id) {
        try {
            return ResponseEntity.ok().body(eventosService.findById(Long.parseLong(id)));
        } catch (NumberFormatException e) {
            throw new BadRequest("'" + id + "' não é um número inteiro válido. Por favor, forneça um valor inteiro, como 10.");
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<Eventos> update(@RequestBody Eventos eventos, @PathVariable(value = "id") String id) {
        try {
            return ResponseEntity.ok().body(eventosService.update(eventos, Long.parseLong(id)));
        } catch (NumberFormatException e) {
            throw new BadRequest("'" + id + "' não é um número inteiro válido. Por favor, forneça um valor inteiro, como 10.");
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Object> delete(@PathVariable(value = "id") String id) {
        try {
            eventosService.delete(Long.parseLong(id));
            return ResponseEntity.ok().body("Evento com o id " + id + " excluido com sucesso!");
        } catch (NumberFormatException e) {
            throw new BadRequest("'" + id + "' não é um número inteiro válido. Por favor, forneça um valor inteiro, como 10.");
        }
    }
}
