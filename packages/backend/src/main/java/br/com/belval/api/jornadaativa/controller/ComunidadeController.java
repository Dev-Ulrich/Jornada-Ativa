package br.com.belval.api.jornadaativa.controller;


import br.com.belval.api.jornadaativa.exceptions.BadRequest;
import br.com.belval.api.jornadaativa.model.entity.Comunidade;
import br.com.belval.api.jornadaativa.model.services.ComunidadeService;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.net.URI;
import java.util.List;

@RestController
@RequestMapping("/api/comunidade")
@AllArgsConstructor
public class ComunidadeController {

    private final ComunidadeService comunidadeService;

    @GetMapping
    public ResponseEntity<List<Comunidade>> findAll() {
        return ResponseEntity.ok().body(comunidadeService.findAll());
    }

    @PostMapping
    public ResponseEntity<Comunidade> save(@RequestBody Comunidade comunidade) {
        URI uri = URI.create(ServletUriComponentsBuilder.fromCurrentContextPath().path("/api/comunidade").toUriString());
        return ResponseEntity.created(uri).body(comunidadeService.save(comunidade));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Comunidade> findById(@PathVariable(value = "id") String id) {
        try {
            return ResponseEntity.ok().body(comunidadeService.findById(Long.parseLong(id)));
        } catch (NumberFormatException e) {
            throw new BadRequest("'" + id + "' não é um número inteiro válido. Por favor, forneça um valor inteiro, como 10.");
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<Comunidade> update(@RequestBody Comunidade comunidade, @PathVariable(value = "id") String id) {
        try {
            return ResponseEntity.ok().body(comunidadeService.update(comunidade, Long.parseLong(id)));
        } catch (NumberFormatException e) {
            throw new BadRequest("'" + id + "' não é um número inteiro válido. Por favor, forneça um valor inteiro, como 10.");
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Object> delete(@PathVariable(value = "id") String id) {
        try {
            comunidadeService.delete(Long.parseLong(id));
            return ResponseEntity.ok().body("Comunidade com o id " + id + " excluida com sucesso!");
        } catch (NumberFormatException e) {
            throw new BadRequest("'" + id + "' não é um número inteiro válido. Por favor, forneça um valor inteiro, como 10.");
        }
    }
}
