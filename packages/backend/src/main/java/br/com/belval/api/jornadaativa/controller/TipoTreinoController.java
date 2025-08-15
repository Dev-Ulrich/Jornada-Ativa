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

import br.com.belval.api.jornadaativa.model.TipoTreino;
import br.com.belval.api.jornadaativa.repository.TipoTreinoRepository;

@RestController
public class TipoTreinoController {

    @Autowired
    private TipoTreinoRepository repository;

    @GetMapping("/tipoTreinos")
    public ResponseEntity<Iterable<TipoTreino>> obterTipoTreinos() {
        return ResponseEntity
                .status(HttpStatus.OK)
                .body(repository.findAll());
    }

    @GetMapping("/tipoTreinos/{id}")
    public ResponseEntity<Object> buscarPorId(
            @PathVariable Integer id) {

        Optional<TipoTreino> tipoTreino = repository.findById(id);

        if (tipoTreino.isPresent()) {
            return ResponseEntity
                    .status(HttpStatus.OK)
                    .body(tipoTreino.get());
        }
        return ResponseEntity
                .status(HttpStatus.NOT_FOUND)
                .body("TipoTreino não encontrado");
    }

    @PostMapping("/tipoTreinos")
    public ResponseEntity<TipoTreino> criarTipoTreino(
            @RequestBody TipoTreino tipoTreino) {

        System.out.println("TipoTreino ..." + tipoTreino.toString());
        repository.save(tipoTreino);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(tipoTreino);
    }

    @PutMapping("/tipoTreinos/{id}")
    public ResponseEntity<Object> atualizarTipoTreino(
            @PathVariable Integer id,
            @RequestBody TipoTreino tipoTreino) {

        Optional<TipoTreino> tipoTreinoOpt = repository.findById(id);

        if (tipoTreinoOpt.isEmpty()) {
            return ResponseEntity
                    .status(HttpStatus.NOT_FOUND)
                    .body("TipoTreino não encontrado!");
        }

        tipoTreino.setId(id);
        repository.save(tipoTreino);

        return ResponseEntity
                .status(HttpStatus.OK)
                .body("TipoTreino atualizado com sucesso!");
    }

    @DeleteMapping("/tipoTreinos/{id}")
    public ResponseEntity<Object> deletarTipoTreino(
            @PathVariable("id") Integer id) {

        Optional<TipoTreino> tipoTreinoOptional = repository.findById(id);

        if (tipoTreinoOptional.isEmpty()) {
            return ResponseEntity
                    .status(HttpStatus.NOT_FOUND)
                    .body("TipoTreino não encontrado!");
        }

        TipoTreino tipoTreino = tipoTreinoOptional.get();
        repository.delete(tipoTreino);

        return ResponseEntity
                .status(HttpStatus.OK)
                .body("TipoTreino deletado com sucesso!");
    }
}