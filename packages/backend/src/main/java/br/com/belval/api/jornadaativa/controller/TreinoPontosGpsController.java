package br.com.belval.api.jornadaativa.controller;


import br.com.belval.api.jornadaativa.exceptions.BadRequest;
import br.com.belval.api.jornadaativa.model.entity.TreinoPontosGPS;
import br.com.belval.api.jornadaativa.model.services.TreinoPontosGPSService;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.net.URI;
import java.util.List;

@RestController
@RequestMapping("/api/treinopontosgps")
@AllArgsConstructor
public class TreinoPontosGpsController {

    private final TreinoPontosGPSService treinoPontosGPSService;

    @GetMapping
    public ResponseEntity<List<TreinoPontosGPS>> findAll() {
        return ResponseEntity.ok().body(treinoPontosGPSService.findAll());
    }

    @PostMapping
    public ResponseEntity<TreinoPontosGPS> save(@RequestBody TreinoPontosGPS treinoPontosGPS) {
        URI uri = URI.create(ServletUriComponentsBuilder.fromCurrentContextPath().path("/api/treinopontosgps").toUriString());
        return ResponseEntity.created(uri).body(treinoPontosGPSService.save(treinoPontosGPS));
    }

    @GetMapping("/{id}")
    public ResponseEntity<TreinoPontosGPS> findById(@PathVariable(value = "id") String id) {
        try {
            return ResponseEntity.ok().body(treinoPontosGPSService.findById(Long.parseLong(id)));
        } catch (NumberFormatException e) {
            throw new BadRequest("'" + id + "' não é um número inteiro válido. Por favor, forneça um valor inteiro, como 10.");
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<TreinoPontosGPS> update(@RequestBody TreinoPontosGPS treinoPontosGPS, @PathVariable(value = "id") String id) {
        try {
            return ResponseEntity.ok().body(treinoPontosGPSService.update(treinoPontosGPS, Long.parseLong(id)));
        } catch (NumberFormatException e) {
            throw new BadRequest("'" + id + "' não é um número inteiro válido. Por favor, forneça um valor inteiro, como 10.");
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Object> delete(@PathVariable(value = "id") String id) {
        try {
            treinoPontosGPSService.delete(Long.parseLong(id));
            return ResponseEntity.ok().body("Usuário com o id " + id + " excluido com sucesso!");
        } catch (NumberFormatException e) {
            throw new BadRequest("'" + id + "' não é um número inteiro válido. Por favor, forneça um valor inteiro, como 10.");
        }
    }
}
