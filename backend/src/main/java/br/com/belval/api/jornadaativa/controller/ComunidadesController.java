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

import br.com.belval.api.jornadaativa.model.Comunidades;
import br.com.belval.api.jornadaativa.repository.ComunidadesRepository;

@RestController
public class ComunidadesController {

    @Autowired
    private ComunidadesRepository comunidadesRepository;

    @GetMapping("/comunidades")
    public ResponseEntity<Iterable<Comunidades>> obterComunidades() {
        return ResponseEntity
                .status(HttpStatus.OK)
                .body(comunidadesRepository.findAll());
    }

    @GetMapping("/comunidades/{id}")
    public ResponseEntity<Object> buscarPorId(@PathVariable Integer id) {
        Optional<Comunidades> comunidade = comunidadesRepository.findById(id);

        if (comunidade.isPresent()) {
            return ResponseEntity
                    .status(HttpStatus.OK)
                    .body(comunidade.get());
        }
        return ResponseEntity
                .status(HttpStatus.NOT_FOUND)
                .body("Comunidade não encontrada");
    }

    @PostMapping("/comunidades")
    public ResponseEntity<Comunidades> criarComunidade(@RequestBody Comunidades comunidade) {
        comunidadesRepository.save(comunidade);
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(comunidade);
    }

    @PutMapping("/comunidades/{id}")
    public ResponseEntity<Object> atualizarComunidade(
            @PathVariable Integer id, @RequestBody Comunidades comunidade) {
        Optional<Comunidades> comunidadeExistente = comunidadesRepository.findById(id);

        if (comunidadeExistente.isPresent()) {
            comunidade.setId(id);
            comunidadesRepository.save(comunidade);
            return ResponseEntity
                    .status(HttpStatus.OK)
                    .body(comunidade);
        }
        return ResponseEntity
                .status(HttpStatus.NOT_FOUND)
                .body("Comunidade não encontrada");
    }

    @DeleteMapping("/comunidades/{id}")
    public ResponseEntity<Object> deletarComunidade(@PathVariable Integer id) {
        Optional<Comunidades> comunidade = comunidadesRepository.findById(id);

        if (comunidade.isPresent()) {
            comunidadesRepository.delete(comunidade.get());
            return ResponseEntity
                    .status(HttpStatus.NO_CONTENT)
                    .build();
        }
        return ResponseEntity
                .status(HttpStatus.NOT_FOUND)
                .body("Comunidade não encontrada");
    }
}