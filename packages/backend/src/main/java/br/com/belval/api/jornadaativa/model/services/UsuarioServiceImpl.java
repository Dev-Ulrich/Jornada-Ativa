package br.com.belval.api.jornadaativa.model.services;

import br.com.belval.api.jornadaativa.exceptions.NotFound;
import br.com.belval.api.jornadaativa.model.entity.Usuario;
import br.com.belval.api.jornadaativa.model.repository.UsuarioRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@Transactional
@AllArgsConstructor
public class UsuarioServiceImpl implements UsuarioService {

    private final UsuarioRepository usuarioRepository;

    @Override
    public Usuario findById(Long id) {
        return usuarioRepository.findById(id)
                .orElseThrow(() -> new NotFound("Usuário não encontrado com o id " + id));
    }

    @Override
    public List<Usuario> findAll() {
        return usuarioRepository.findAll();
    }

    @Override
    public Usuario save(Usuario usuario) {
        return usuarioRepository.save(usuario);
    }

    @Override
    public void delete(Long id) {
        if (!usuarioRepository.existsById(id)) {
            throw new NotFound("Usuário não encontrado com o id " + id);
        }
        usuarioRepository.deleteById(id);
    }

    @Override
    public Usuario update(Usuario usuario, Long id) {
        Usuario usuarioAtual = findById(id);
        usuarioAtual.setNome(usuario.getNome());
        usuarioAtual.setEmail(usuario.getEmail());
        usuarioAtual.setSenha_hash(usuario.getSenha_hash());
        usuarioAtual.setDataNascimento(usuario.getDataNascimento());
        usuarioAtual.setAltura(usuario.getAltura());
        usuarioAtual.setCreatedAt(usuario.getCreatedAt());
        usuarioAtual.setUpdatedAt(LocalDateTime.now());
        usuarioAtual.setFotoPerfil(usuario.getFotoPerfil());

        return usuarioRepository.save(usuarioAtual);
    }
}
