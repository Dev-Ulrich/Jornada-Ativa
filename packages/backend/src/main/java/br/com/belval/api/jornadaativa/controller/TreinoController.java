package br.com.belval.api.jornadaativa.controller;


import br.com.belval.api.jornadaativa.exceptions.BadRequest;
import br.com.belval.api.jornadaativa.model.entity.Treino;
import br.com.belval.api.jornadaativa.model.entity.Usuario;
import br.com.belval.api.jornadaativa.model.services.TreinoService;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.net.URI;
import java.util.List;

@RestController
@RequestMapping("/api/treino")
@AllArgsConstructor
public class TreinoController {

    private TreinoService treinoService;

    @GetMapping
    public ResponseEntity<List<Treino>> findAll() {
        return ResponseEntity.ok().body(treinoService.findAll());
    }

    @PostMapping
    public ResponseEntity<Treino> save(@RequestBody Treino treino) {
        URI uri = URI.create(ServletUriComponentsBuilder.fromCurrentContextPath().path("/api/treino").toUriString());
        return ResponseEntity.created(uri).body(treinoService.save(treino));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Treino> findById(@PathVariable(value = "id") String id) {
        try {
            return ResponseEntity.ok().body(treinoService.findById(Long.parseLong(id)));
        } catch (NumberFormatException e) {
            throw new BadRequest("'" + id + "' não é um número inteiro válido. Por favor, forneça um valor inteiro, como 10.");
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<Treino> update(@RequestBody Treino treino, @PathVariable(value = "id") String id) {
        try {
            return ResponseEntity.ok().body(treinoService.update(treino, Long.parseLong(id)));
        } catch (NumberFormatException e) {
            throw new BadRequest("'" + id + "' não é um número inteiro válido. Por favor, forneça um valor inteiro, como 10.");
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Object> delete(@PathVariable(value = "id") String id) {
        try {
            treinoService.delete(Long.parseLong(id));
            return ResponseEntity.ok().body("Treino com o id " + id + " excluido com sucesso!");
        } catch (NumberFormatException e) {
            throw new BadRequest("'" + id + "' não é um número inteiro válido. Por favor, forneça um valor inteiro, como 10.");
        }
    }
}
