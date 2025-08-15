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

import br.com.belval.api.jornadaativa.model.Comunidades;
import br.com.belval.api.jornadaativa.repository.ComunidadesRepository;

@RestController
public class ComunidadesController {
    private static final Logger logger = LoggerFactory.getLogger(ComunidadesController.class);

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
                .body("Comunidade não encontrada!");
    }

    @PostMapping("/comunidades")
    public ResponseEntity<?> criarComunidade(
        @RequestParam("nome") String nome,
        @RequestParam("descricao") String descricao,
        @RequestParam("integrantes") String integrantes,
        @RequestParam(value = "fotoPerfil", required = false) MultipartFile fotoPerfil
    ) {
        logger.info("Recebendo requisição para criar comunidade com nome: " + nome + ", descricao: " + descricao + ", arquivo: " + (fotoPerfil != null ? fotoPerfil.getOriginalFilename() : "null"));
        Comunidades comunidade = new Comunidades();
        comunidade.setNome(nome);
        comunidade.setDescricao(descricao);
        comunidade.setIntegrantes(integrantes);

        String uploadDir = "E:/Jornada-Ativa/backend/uploads/";
        String fileName = null;
        if (fotoPerfil != null && !fotoPerfil.isEmpty()) {
            fileName = fotoPerfil.getOriginalFilename();
            File uploadPath = new File(uploadDir);
            if (!uploadPath.exists()) {
                uploadPath.mkdirs();
            }
            try {
                fotoPerfil.transferTo(new File(uploadDir + fileName));
                logger.info("Arquivo transferido com sucesso: " + fileName);
                comunidade.setFotoPerfil("/uploads/" + fileName);
            } catch (IOException e) {
                logger.error("Erro ao salvar o arquivo: " + fileName, e);
                e.printStackTrace();
            }
        } else {
            logger.warn("Arquivo recebido está vazio.");
        }

        comunidadesRepository.save(comunidade);

        return ResponseEntity
            .status(HttpStatus.CREATED)
            .body(comunidade);
    }

    @PutMapping("/comunidades/{id}")
    public ResponseEntity<Object> atualizarComunidade(
        @PathVariable Integer id,
        @RequestParam("nome") String nome,
        @RequestParam("descricao") String descricao,
        @RequestParam("integrantes") String integrantes,
        @RequestParam(value = "fotoPerfil", required = false) MultipartFile fotoPerfil
    ) {

        Optional<Comunidades> comunidadeOpt = comunidadesRepository.findById(id);

        if (comunidadeOpt.isEmpty()) {
            return ResponseEntity
                    .status(HttpStatus.NOT_FOUND)
                    .body("Comunidade não encontrada!");
        }

        Comunidades comunidade = comunidadeOpt.get();
        comunidade.setNome(nome);
        comunidade.setDescricao(descricao);
        comunidade.setIntegrantes(integrantes);

        if (fotoPerfil != null && !fotoPerfil.isEmpty()) {
            String uploadDir = "E:/Jornada-Ativa/backend/uploads/";
            String fileName = fotoPerfil.getOriginalFilename();
            try {
                fotoPerfil.transferTo(new File(uploadDir + fileName));
                comunidade.setFotoPerfil("/uploads/" + fileName);
            } catch (IOException e) {
                e.printStackTrace();
                return ResponseEntity
                        .status(HttpStatus.INTERNAL_SERVER_ERROR)
                        .body("Erro ao salvar o arquivo.");
            }
        }

        comunidadesRepository.save(comunidade);

        return ResponseEntity
                .status(HttpStatus.OK)
                .body("Comunidade atualizada com sucesso!");
    }

    @DeleteMapping("/comunidades/{id}")
    public ResponseEntity<Object> deletarComunidade(@PathVariable Integer id) {
        Optional<Comunidades> comunidadeOptional = comunidadesRepository.findById(id);

        if (comunidadeOptional.isEmpty()) {
            return ResponseEntity
                    .status(HttpStatus.NOT_FOUND)
                    .body("Comunidade não encontrada!");
        }

        Comunidades comunidade = comunidadeOptional.get();
        comunidadesRepository.delete(comunidade);

        return ResponseEntity
                .status(HttpStatus.OK)
                .body("Comunidade deletada com sucesso!");
    }
}