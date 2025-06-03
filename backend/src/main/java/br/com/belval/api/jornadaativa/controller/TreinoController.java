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

import br.com.belval.api.jornadaativa.model.Treinos;
import br.com.belval.api.jornadaativa.repository.TreinoRepository;

@RestController
public class TreinoController {
    @Autowired
    private TreinoRepository repository;

    @GetMapping("/treinos")
    public ResponseEntity<Iterable<Treinos>> obterTreinos() {
        return ResponseEntity
                .status(HttpStatus.OK)
                .body(repository.findAll());
    }

    @GetMapping("/treinos/{id}")
    public ResponseEntity<Object> buscarPorId(@PathVariable Integer id) {
        Optional<Treinos> treino = repository.findById(id);

        if (treino.isPresent()) {
            return ResponseEntity
                    .status(HttpStatus.OK)
                    .body(treino.get());
        }
        return ResponseEntity
                .status(HttpStatus.NOT_FOUND)
                .body("Treino não encontrado!");
    }

    @PostMapping("/treinos")
    public ResponseEntity<Treinos> criarTreino(@RequestBody Treinos treino) {
        System.out.println("Treino criado ..." + treino.toString());
        repository.save(treino);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(treino);
    }

    @PutMapping("/treinos/{id}")
    public ResponseEntity<Object> atualizarTreino(
            @PathVariable Integer id,
            @RequestBody Treinos treino) {

        Optional<Treinos> treinoOpt = repository.findById(id);

        if (treinoOpt.isEmpty()) {
            return ResponseEntity
                    .status(HttpStatus.NOT_FOUND)
                    .body("Treino não encontrado!");
        }

        treino.setId(id);
        repository.save(treino);

        return ResponseEntity
                .status(HttpStatus.OK)
                .body("Treino atualizado com sucesso!");
    }

    @DeleteMapping("/treinos/{id}")
    public ResponseEntity<Object> deletarTreino(@PathVariable Integer id) {
        Optional<Treinos> treinoOptional = repository.findById(id);

        if (treinoOptional.isEmpty()) {
            return ResponseEntity
                    .status(HttpStatus.NOT_FOUND)
                    .body("Treino não encontrado!");
        }

        Treinos treino = treinoOptional.get();
        repository.delete(treino);

        return ResponseEntity
                .status(HttpStatus.OK)
                .body("Treino deletado com sucesso!");
    }
}