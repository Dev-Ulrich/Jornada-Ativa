package br.com.belval.api.jornadaativa.controller;


import br.com.belval.api.jornadaativa.exceptions.BadRequest;
import br.com.belval.api.jornadaativa.model.entity.Postagem;
import br.com.belval.api.jornadaativa.model.entity.Usuario;
import br.com.belval.api.jornadaativa.model.services.PostagemService;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.net.URI;
import java.util.List;

@RestController
@RequestMapping("/api/postagem")
@AllArgsConstructor
public class PostagemController {

    private final PostagemService postagemService;

    @GetMapping
    public ResponseEntity<List<Postagem>> findAll() {
        return ResponseEntity.ok().body(postagemService.findAll());
    }

    @PostMapping
    public ResponseEntity<Postagem> save(@RequestBody Postagem postagem) {
        URI uri = URI.create(ServletUriComponentsBuilder.fromCurrentContextPath().path("/api/usuario").toUriString());
        return ResponseEntity.created(uri).body(postagemService.save(postagem));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Postagem> findById(@PathVariable(value = "id") String id) {
        try {
            return ResponseEntity.ok().body(postagemService.findById(Long.parseLong(id)));
        } catch (NumberFormatException e) {
            throw new BadRequest("'" + id + "' não é um número inteiro válido. Por favor, forneça um valor inteiro, como 10.");
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<Postagem> update(@RequestBody Postagem postagem, @PathVariable(value = "id") String id) {
        try {
            return ResponseEntity.ok().body(postagemService.update(postagem, Long.parseLong(id)));
        } catch (NumberFormatException e) {
            throw new BadRequest("'" + id + "' não é um número inteiro válido. Por favor, forneça um valor inteiro, como 10.");
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Object> delete(@PathVariable(value = "id") String id) {
        try {
            postagemService.delete(Long.parseLong(id));
            return ResponseEntity.ok().body("Postagem com o id " + id + " excluido com sucesso!");
        } catch (NumberFormatException e) {
            throw new BadRequest("'" + id + "' não é um número inteiro válido. Por favor, forneça um valor inteiro, como 10.");
        }
    }
}
