package br.com.belval.api.jornadaativa.controller;


import br.com.belval.api.jornadaativa.exceptions.BadRequest;
import br.com.belval.api.jornadaativa.model.entity.Usuario;
import br.com.belval.api.jornadaativa.model.services.UsuarioService;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.net.URI;
import java.util.List;

@RestController
@RequestMapping("/api/usuario")
@AllArgsConstructor
public class UsuarioController {

    private final UsuarioService usuarioService;

    @GetMapping
    public ResponseEntity<List<Usuario>> findAll() {
        return ResponseEntity.ok().body(usuarioService.findAll());
    }

    @PostMapping
    public ResponseEntity<Usuario> save(@RequestBody Usuario usuario) {
        URI uri = URI.create(ServletUriComponentsBuilder.fromCurrentContextPath().path("/api/usuario").toUriString());
        return ResponseEntity.created(uri).body(usuarioService.save(usuario));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Usuario> findById(@PathVariable(value = "id") String id) {
        try {
            return ResponseEntity.ok().body(usuarioService.findById(Long.parseLong(id)));
        } catch (NumberFormatException e) {
            throw new BadRequest("'" + id + "' não é um número inteiro válido. Por favor, forneça um valor inteiro, como 10.");
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<Usuario> update(@RequestBody Usuario usuario, @PathVariable(value = "id") String id) {
        try {
            return ResponseEntity.ok().body(usuarioService.update(usuario, Long.parseLong(id)));
        } catch (NumberFormatException e) {
            throw new BadRequest("'" + id + "' não é um número inteiro válido. Por favor, forneça um valor inteiro, como 10.");
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Object> delete(@PathVariable(value = "id") String id) {
        try {
            usuarioService.delete(Long.parseLong(id));
            return ResponseEntity.ok().body("Usuário com o id " + id + " excluido com sucesso!");
        } catch (NumberFormatException e) {
            throw new BadRequest("'" + id + "' não é um número inteiro válido. Por favor, forneça um valor inteiro, como 10.");
        }
    }
}
