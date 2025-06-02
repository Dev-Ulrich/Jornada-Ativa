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
    private TipoTreinoRepository tipoTreinoRepository;

    @GetMapping("/tipoTreino")
    public ResponseEntity<Iterable<TipoTreino>> obterTipoTreinos() {
        return ResponseEntity
                .status(HttpStatus.OK)
                .body(tipoTreinoRepository.findAll());
    }

    @GetMapping("/tipoTreino/{idTipoTreino}")
    public ResponseEntity<Object> buscarPorId(
            @PathVariable Integer idTipoTreino) {

        Optional<TipoTreino> tipoTreino = tipoTreinoRepository.findById(idTipoTreino);

        if (tipoTreino.isPresent()) {
            return ResponseEntity
                    .status(HttpStatus.OK)
                    .body(tipoTreino.get());
        }
        return ResponseEntity
                .status(HttpStatus.NOT_FOUND)
                .body("TipoTreino não encontrado");
    }

    @PostMapping("/tipoTreino")
    public ResponseEntity<TipoTreino> criarTipoTreino(
            @RequestBody TipoTreino tipoTreino) {

        System.out.println("TipoTreino ..." + tipoTreino.toString());
        tipoTreinoRepository.save(tipoTreino);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(tipoTreino);
    }

    @PutMapping("/tipoTreino/{idTipoTreino}")
    public ResponseEntity<Object> atualizarTipoTreino(
            @PathVariable Integer idTipoTreino,
            @RequestBody TipoTreino tipoTreino) {

        Optional<TipoTreino> tipoTreinoOpt = tipoTreinoRepository.findById(idTipoTreino);

        if (tipoTreinoOpt.isEmpty()) {
            return ResponseEntity
                    .status(HttpStatus.NOT_FOUND)
                    .body("TipoTreino não encontrado!");
        }

        tipoTreino.setIdTipoTreino(idTipoTreino);
        tipoTreinoRepository.save(tipoTreino);

        return ResponseEntity
                .status(HttpStatus.OK)
                .body("TipoTreino atualizado com sucesso!");
    }

    @DeleteMapping("/tipoTreino/{idTipoTreino}")
    public ResponseEntity<Object> deletarTipoTreino(
            @PathVariable("idTipoTreino") Integer idTipoTreino) {

        Optional<TipoTreino> tipoTreinoOptional = tipoTreinoRepository.findById(idTipoTreino);

        if (tipoTreinoOptional.isEmpty()) {
            return ResponseEntity
                    .status(HttpStatus.NOT_FOUND)
                    .body("TipoTreino não encontrado!");
        }

        TipoTreino tipoTreino = tipoTreinoOptional.get();
        tipoTreinoRepository.delete(tipoTreino);

        return ResponseEntity
                .status(HttpStatus.OK)
                .body("TipoTreino deletado com sucesso!");
    }
}