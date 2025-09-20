package br.com.belval.api.jornadaativa.controller;


import br.com.belval.api.jornadaativa.exceptions.BadRequest;
import br.com.belval.api.jornadaativa.model.entity.Comunidades;
import br.com.belval.api.jornadaativa.model.services.ComunidadesService;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.net.URI;
import java.util.List;

@RestController
@RequestMapping("/api/comunidade")
@AllArgsConstructor
public class    ComunidadeController {

    private final ComunidadesService comunidadesService;

    @GetMapping
    public ResponseEntity<List<Comunidades>> findAll() {
        return ResponseEntity.ok().body(comunidadesService.findAll());
    }

    @PostMapping
    public ResponseEntity<Comunidades> save(@RequestBody Comunidades comunidades) {
        URI uri = URI.create(ServletUriComponentsBuilder.fromCurrentContextPath().path("/api/comunidade").toUriString());
        return ResponseEntity.created(uri).body(comunidadesService.save(comunidades));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Comunidades> findById(@PathVariable(value = "id") String id) {
        try {
            return ResponseEntity.ok().body(comunidadesService.findById(Long.parseLong(id)));
        } catch (NumberFormatException e) {
            throw new BadRequest("'" + id + "' não é um número inteiro válido. Por favor, forneça um valor inteiro, como 10.");
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<Comunidades> update(@RequestBody Comunidades comunidades, @PathVariable(value = "id") String id) {
        try {
            return ResponseEntity.ok().body(comunidadesService.update(comunidades, Long.parseLong(id)));
        } catch (NumberFormatException e) {
            throw new BadRequest("'" + id + "' não é um número inteiro válido. Por favor, forneça um valor inteiro, como 10.");
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Object> delete(@PathVariable(value = "id") String id) {
        try {
            comunidadesService.delete(Long.parseLong(id));
            return ResponseEntity.ok().body("Comunidade com o id " + id + " excluida com sucesso!");
        } catch (NumberFormatException e) {
            throw new BadRequest("'" + id + "' não é um número inteiro válido. Por favor, forneça um valor inteiro, como 10.");
        }
    }
}
