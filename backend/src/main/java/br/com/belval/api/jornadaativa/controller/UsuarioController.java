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

import br.com.belval.api.jornadaativa.model.Usuario;
import br.com.belval.api.jornadaativa.repository.UsuarioRepository;

@RestController
public class UsuarioController {

    @Autowired
    private UsuarioRepository repository;

    @GetMapping("/usuarios")
    public ResponseEntity<Iterable<Usuario>> obterUsuarios() {
        return ResponseEntity
                .status(HttpStatus.OK)
                .body(repository.findAll());
    }

    @GetMapping("/usuarios/{id}")
    public ResponseEntity<Object> buscarPorId(@PathVariable Integer id) {
        Optional<Usuario> usuario = repository.findById(id);

        if (usuario.isPresent()) {
            return ResponseEntity
                    .status(HttpStatus.OK)
                    .body(usuario.get());
        }

        return ResponseEntity
                .status(HttpStatus.NOT_FOUND)
                .body("Usuário não encontrado!");
    }

    @PostMapping("/usuarios")
    public ResponseEntity<Usuario> criarUsuario(@RequestBody Usuario usuario) {
        System.out.println("Usuário criado..." + usuario.toString());
        repository.save(usuario);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(usuario);
    }

    @PutMapping("/usuarios/{id}")
    public ResponseEntity<Object> atualizarUsuario(
            @PathVariable Integer id,
            @RequestBody Usuario usuario) {

        Optional<Usuario> usuarioOpt = repository.findById(id);

        if (usuarioOpt.isEmpty()) {
            return ResponseEntity
                    .status(HttpStatus.NOT_FOUND)
                    .body("Usuário não encontrado!");
        }

        usuario.setId(id);
        repository.save(usuario);

        return ResponseEntity
                .status(HttpStatus.OK)
                .body("Usuário atualizado com sucesso!");
    }

    @DeleteMapping("/usuarios/{id}")
    public ResponseEntity<Object> deletarUsuario(@PathVariable Integer id) {
        Optional<Usuario> usuarioOptional = repository.findById(id);

        if (usuarioOptional.isEmpty()) {
            return ResponseEntity
                    .status(HttpStatus.NOT_FOUND)
                    .body("Usuário não encontrado!");
        }

        Usuario usuario = usuarioOptional.get();
        repository.delete(usuario);

        return ResponseEntity
                .status(HttpStatus.OK)
                .body("Usuário deletado com sucesso!");
    }
}