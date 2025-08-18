package br.com.belval.api.jornadaativa.controller;

import java.io.File;
import java.io.IOException;
import java.math.BigDecimal;
import java.time.LocalDate;
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

import br.com.belval.api.jornadaativa.model.Usuario;
import br.com.belval.api.jornadaativa.repository.UsuarioRepository;

@RestController
public class UsuarioController {

    private static final Logger logger = LoggerFactory.getLogger(UsuarioController.class);

    @Autowired
    private UsuarioRepository repository;

    // Buscar todos
    @GetMapping("/usuario")
    public ResponseEntity<Iterable<Usuario>> obterUsuario() {
        return ResponseEntity
                .status(HttpStatus.OK)
                .body(repository.findAll());
    }

    // Buscar por ID
    @GetMapping("/usuario/{idUsuario}")
    public ResponseEntity<Object> buscarPorId(@PathVariable Long idUsuario) {
        Optional<Usuario> usuario = repository.findById(idUsuario);

        if (usuario.isPresent()) {
            return ResponseEntity
                    .status(HttpStatus.OK)
                    .body(usuario.get());
        }

        return ResponseEntity
                .status(HttpStatus.NOT_FOUND)
                .body("Usuário não encontrado!");
    }

    // Criar
    @PostMapping("/usuario")
    public ResponseEntity<?> criarUsuario(
            @RequestParam("nome") String nome,
            @RequestParam("email") String email,
            @RequestParam("senha") String senha,
            @RequestParam("genero") String genero,
            @RequestParam("dataNascimento") LocalDate dataNascimento,
            @RequestParam("nivel") Integer nivel,
            @RequestParam("altura") BigDecimal altura,
            @RequestParam("peso") BigDecimal peso,
            @RequestParam(value = "file", required = false) MultipartFile file) {

        logger.info("Recebendo requisição para criar usuário com nome: " + nome +
                ", email: " + email +
                ", arquivo: " + (file != null ? file.getOriginalFilename() : "null"));

        Usuario usuario = new Usuario();
        usuario.setNome(nome);
        usuario.setEmail(email);
        usuario.setSenha(senha);
        usuario.setGenero(genero);
        usuario.setDataNascimento(dataNascimento);
        usuario.setNivel(nivel);
        usuario.setAltura(altura);
        usuario.setPeso(peso);

        String uploadDir = "E:/Jornada-Ativa/backend/uploads/";
        if (file != null && !file.isEmpty()) {
            String fileName = file.getOriginalFilename();
            File uploadPath = new File(uploadDir);
            if (!uploadPath.exists()) {
                uploadPath.mkdirs();
            }
            try {
                file.transferTo(new File(uploadDir + fileName));
                logger.info("Arquivo transferido com sucesso: " + fileName);
                usuario.setFotoPerfil("/uploads/" + fileName);
            } catch (IOException e) {
                logger.error("Erro ao salvar o arquivo: " + fileName, e);
            }
        } else {
            logger.warn("Arquivo recebido está vazio ou nulo.");
        }

        repository.save(usuario);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(usuario);
    }

    // Atualizar
    @PutMapping("/usuario/{idUsuario}")
    public ResponseEntity<Object> atualizarUsuario(
            @PathVariable Long idUsuario,
            @RequestParam("nome") String nome,
            @RequestParam("email") String email,
            @RequestParam(value = "file", required = false) MultipartFile file) {

        Optional<Usuario> usuarioOpt = repository.findById(idUsuario);

        if (usuarioOpt.isEmpty()) {
            return ResponseEntity
                    .status(HttpStatus.NOT_FOUND)
                    .body("Usuário não encontrado!");
        }

        Usuario usuario = usuarioOpt.get();
        usuario.setNome(nome);
        usuario.setEmail(email);

        if (file != null && !file.isEmpty()) {
            String uploadDir = "E:/Jornada-Ativa/backend/uploads/";
            String fileName = file.getOriginalFilename();
            try {
                file.transferTo(new File(uploadDir + fileName));
                usuario.setFotoPerfil("/uploads/" + fileName);
            } catch (IOException e) {
                logger.error("Erro ao salvar o arquivo: " + fileName, e);
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

    // Deletar
    @DeleteMapping("/usuario/{idUsuario}")
    public ResponseEntity<Object> deletarUsuario(@PathVariable Long idUsuario) {
        Optional<Usuario> usuarioOptional = repository.findById(idUsuario);

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
