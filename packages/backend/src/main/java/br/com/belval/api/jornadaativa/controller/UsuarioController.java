package br.com.belval.api.jornadaativa.controller;

import java.io.File;
import java.io.IOException;
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
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import br.com.belval.api.jornadaativa.model.Usuarios;
import br.com.belval.api.jornadaativa.repository.UsuarioRepository;

@RestController
public class UsuarioController {
    private static final Logger logger = LoggerFactory.getLogger(UsuarioController.class);
    @Autowired
    private UsuarioRepository repository;

    @GetMapping("/usuarios")
    public ResponseEntity<Iterable<Usuarios>> obterUsuarios() {
        return ResponseEntity
                .status(HttpStatus.OK)
                .body(repository.findAll());
    }

    @GetMapping("/usuarios/{id}")
    public ResponseEntity<Object> buscarPorId(@PathVariable Integer id) {
        Optional<Usuarios> usuario = repository.findById(id);

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
    public ResponseEntity<?> criarUsuario(
            @RequestParam("nome") String nome,
            @RequestParam("email") String email,
            @RequestParam("senha") String senha,
            @RequestParam(value = "files", required = false) MultipartFile file // Altere para MultipartFile file
    ) {
        logger.info("Recebendo requisição para criar usuário com nome: " + nome + ", email: " + email + ", arquivo: "
                + (file != null ? file.getOriginalFilename() : "null"));
        Usuarios usuario = new Usuarios();
        usuario.setNome(nome);
        usuario.setEmail(email);
        usuario.setSenha(senha);

        String uploadDir = "E:/Jornada-Ativa/backend/uploads/"; // Declaração da variável uploadDir
        String fileName = null; // Declaração da variável fileName
        if (file != null && !file.isEmpty()) { // Altere a condição para verificar se o arquivo não é nulo e não está
                                               // vazio
            fileName = file.getOriginalFilename();
            File uploadPath = new File(uploadDir);
            if (!uploadPath.exists()) {
                uploadPath.mkdirs();
            }
            try {
                file.transferTo(new File(uploadDir + fileName));
                logger.info("Arquivo transferido com sucesso: " + fileName); // Adicione esta linha
                usuario.setFotoPerfil("/uploads/" + fileName);
            } catch (IOException e) {
                logger.error("Erro ao salvar o arquivo: " + fileName, e);
                e.printStackTrace();
            }
        } else {
            logger.warn("Arquivo recebido está vazio.");
        }

        repository.save(usuario);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(usuario);
    }

    @PutMapping("/usuarios/{id}")
    public ResponseEntity<Object> atualizarUsuario(
            @PathVariable Integer id,
            @RequestParam("nome") String nome,
            @RequestParam("email") String email,
            @RequestParam(value = "files", required = false) MultipartFile file) {

        Optional<Usuarios> usuarioOpt = repository.findById(id);

        if (usuarioOpt.isEmpty()) {
            return ResponseEntity
                    .status(HttpStatus.NOT_FOUND)
                    .body("Usuário não encontrado!");
        }

        Usuarios usuario = usuarioOpt.get();
        usuario.setNome(nome);
        usuario.setEmail(email);

        if (file != null && !file.isEmpty()) {
            String uploadDir = "E:/Jornada-Ativa/backend/uploads/";
            String fileName = file.getOriginalFilename();
            try {
                file.transferTo(new File(uploadDir + fileName));
                usuario.setFotoPerfil("/uploads/" + fileName);
            } catch (IOException e) {
                e.printStackTrace();
                return ResponseEntity
                        .status(HttpStatus.INTERNAL_SERVER_ERROR)
                        .body("Erro ao salvar o arquivo.");
            }
        }

        repository.save(usuario);

        return ResponseEntity
                .status(HttpStatus.OK)
                .body("Usuário atualizado com sucesso!");
    }

    @DeleteMapping("/usuarios/{id}")
    public ResponseEntity<Object> deletarUsuario(@PathVariable Integer id) {
        Optional<Usuarios> usuarioOptional = repository.findById(id);

        if (usuarioOptional.isEmpty()) {
            return ResponseEntity
                    .status(HttpStatus.NOT_FOUND)
                    .body("Usuário não encontrado!");
        }

        Usuarios usuario = usuarioOptional.get();
        repository.delete(usuario);

        return ResponseEntity
                .status(HttpStatus.OK)
                .body("Usuário deletado com sucesso!");
    }
}