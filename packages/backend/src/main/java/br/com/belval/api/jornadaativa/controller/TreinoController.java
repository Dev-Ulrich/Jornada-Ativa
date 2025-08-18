package br.com.belval.api.jornadaativa.controller;

import java.util.Optional;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import br.com.belval.api.jornadaativa.model.Treino;
import br.com.belval.api.jornadaativa.repository.TreinoRepository;

@RestController
@RequestMapping("/treino")
public class TreinoController {

    private static final Logger logger = LoggerFactory.getLogger(TreinoController.class);

    @Autowired
    private TreinoRepository repository;

    // Buscar todos
    @GetMapping
    public ResponseEntity<Iterable<Treino>> obterTreino() {
        return ResponseEntity.ok(repository.findAll());
    }

    // Buscar por ID
    @GetMapping("/{idTreino}")
    public ResponseEntity<Object> buscarPorId(@PathVariable Long idTreino) {
        Optional<Treino> treino = repository.findById(idTreino);

        if (treino.isPresent()) {
            return ResponseEntity.ok(treino.get());
        }

        return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body("Treino não encontrado!");
    }

    // Criar
    @PostMapping
    public ResponseEntity<Treino> criarTreino(@RequestBody Treino treino) {
        logger.info("Treino criado: {}", treino);
        repository.save(treino);
        return ResponseEntity.status(HttpStatus.CREATED).body(treino);
    }

    // Atualizar
    @PutMapping("/{idTreino}")
    public ResponseEntity<Object> atualizarTreino(
            @PathVariable Long idTreino,
            @RequestBody Treino treinoAtualizado) {

        Optional<Treino> treinoOpt = repository.findById(idTreino);

        if (treinoOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("Treino não encontrado!");
        }

        Treino treino = treinoOpt.get();
        // Atualiza todos os campos
        treino.setNome(treinoAtualizado.getNome());
        treino.setTempo(treinoAtualizado.getTempo());
        treino.setVMedia(treinoAtualizado.getVMedia());
        treino.setDistancia(treinoAtualizado.getDistancia());
        treino.setKcal(treinoAtualizado.getKcal());
        treino.setPace(treinoAtualizado.getPace());
        treino.setData(treinoAtualizado.getData());

        repository.save(treino);

        return ResponseEntity.ok(treino);
    }

    // Deletar
    @DeleteMapping("/{idTreino}")
    public ResponseEntity<Object> deletarTreino(@PathVariable Long idTreino) {
        Optional<Treino> treinoOptional = repository.findById(idTreino);

        if (treinoOptional.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("Treino não encontrado!");
        }

        repository.delete(treinoOptional.get());
        return ResponseEntity.ok("Treino deletado com sucesso!");
    }
}
