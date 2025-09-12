package br.com.belval.api.jornadaativa.controller;

import br.com.belval.api.jornadaativa.exceptions.BadRequest;
import br.com.belval.api.jornadaativa.model.entity.UsuarioComunidade;
import br.com.belval.api.jornadaativa.model.services.UsuarioComunidadeService;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.net.URI;
import java.util.List;

@RestController
@RequestMapping("/api/usuariocomunidade")
@AllArgsConstructor
public class UsuarioComunidadeController {

    private final UsuarioComunidadeService usuarioComunidadeService;

    @GetMapping
    public ResponseEntity<List<UsuarioComunidade>> findAll() {
        return ResponseEntity.ok().body(usuarioComunidadeService.findAll());
    }

    @PostMapping
    public ResponseEntity<UsuarioComunidade> save(@RequestBody UsuarioComunidade usuarioComunidade) {
        URI uri = URI.create(ServletUriComponentsBuilder.fromCurrentContextPath().path("/api/usuarioComunidade").toUriString());
        return ResponseEntity.created(uri).body(usuarioComunidadeService.save(usuarioComunidade));
    }

    @GetMapping("/{id}")
    public ResponseEntity<UsuarioComunidade> findById(@PathVariable(value = "id") String id) {
        try {
            return ResponseEntity.ok().body(usuarioComunidadeService.findById(Long.parseLong(id)));
        } catch (NumberFormatException e) {
            throw new BadRequest("'" + id + "' não é um número inteiro válido. Por favor, forneça um valor inteiro, como 10.");
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<UsuarioComunidade> update(@RequestBody UsuarioComunidade usuarioComunidade, @PathVariable(value = "id") String id) {
        try {
            return ResponseEntity.ok().body(usuarioComunidadeService.update(usuarioComunidade, Long.parseLong(id)));
        } catch (NumberFormatException e) {
            throw new BadRequest("'" + id + "' não é um número inteiro válido. Por favor, forneça um valor inteiro, como 10.");
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Object> delete(@PathVariable(value = "id") String id) {
        try {
            usuarioComunidadeService.delete(Long.parseLong(id));
            return ResponseEntity.ok().body("UsuárioComunidade com o id " + id + " excluido com sucesso!");
        } catch (NumberFormatException e) {
            throw new BadRequest("'" + id + "' não é um número inteiro válido. Por favor, forneça um valor inteiro, como 10.");
        }
    }
}
