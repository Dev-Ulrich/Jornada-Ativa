package br.com.belval.api.jornadaativa.controller;


import br.com.belval.api.jornadaativa.exceptions.BadRequest;
import br.com.belval.api.jornadaativa.model.entity.HistoricoTreino;
import br.com.belval.api.jornadaativa.model.services.HistoricoTreinoService;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.net.URI;
import java.util.List;

@RestController
@RequestMapping("/api/historicotreino")
@AllArgsConstructor
public class HistoricoTreinoController {
        private final HistoricoTreinoService historicoTreinoService;

        @GetMapping
        public ResponseEntity<List<HistoricoTreino>> findAll() {
            return ResponseEntity.ok().body(historicoTreinoService.findAll());
        }

        @PostMapping
        public ResponseEntity<HistoricoTreino> save(@RequestBody HistoricoTreino historicoTreino) {
            URI uri = URI.create(ServletUriComponentsBuilder.fromCurrentContextPath().path("/api/historicotreino").toUriString());
            return ResponseEntity.created(uri).body(historicoTreinoService.save(historicoTreino));
        }

        @GetMapping("/{id}")
        public ResponseEntity<HistoricoTreino> findById(@PathVariable(value = "id") String id) {
            try {
                return ResponseEntity.ok().body(historicoTreinoService.findById(Long.parseLong(id)));
            } catch (NumberFormatException e) {
                throw new BadRequest("'" + id + "' não é um número inteiro válido. Por favor, forneça um valor inteiro, como 10.");
            }
        }

    @DeleteMapping("/{id}")
    public ResponseEntity<Object> delete(@PathVariable(value = "id") String id) {
        try {
            historicoTreinoService.delete(Long.parseLong(id));
            return ResponseEntity.ok().body("Historico com o id " + id + " excluido com sucesso!");
        } catch (NumberFormatException e) {
            throw new BadRequest("'" + id + "' não é um número inteiro válido. Por favor, forneça um valor inteiro, como 10.");
        }
    }


}
