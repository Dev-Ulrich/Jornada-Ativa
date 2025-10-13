package br.com.belval.api.jornadaativa.model.service;

import br.com.belval.api.jornadaativa.exceptions.NotFound;
import br.com.belval.api.jornadaativa.model.entity.Treinos;
import br.com.belval.api.jornadaativa.model.repository.TreinoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;

@Service
@RequiredArgsConstructor
@Transactional // transação por padrão; métodos readOnly especificados abaixo
public class TreinosService {

    private final TreinoRepository treinoRepository;

    /* ======================
       Helpers de normalização
       ====================== */
    private String norm(String s) {
        return s == null ? null : s.trim();
    }

    /**
     * Normaliza nível para: iniciante | intermediario | avancado
     */
    private String normalizeNivel(String raw) {
        if (raw == null) return null;
        String n = raw.trim().toLowerCase();
        if (n.equals("1") || n.startsWith("iniciante")) return "iniciante";
        if (n.equals("2") || n.startsWith("intermedi")) return "intermediario";
        if (n.equals("3") || n.startsWith("avança") || n.startsWith("avanca")) return "avancado";
        // caso venha algo fora do esperado, devolve como veio (ou lance exceção se preferir)
        return n;
    }

    /* =========
       CRIAR
       ========= */
    public Treinos criar(Treinos treino) {
        // proteção básica: trim e normalização antes de salvar
        treino.setNome(norm(treino.getNome()));
        treino.setDescricao(norm(treino.getDescricao()));
        treino.setNivel(normalizeNivel(treino.getNivel()));
        return treinoRepository.save(treino);
    }

    /* =========
       ATUALIZAR
       ========= */
    public Treinos atualizar(Long id, Treinos dto) {
        Treinos treino = buscarPorId(id);

        if (dto.getNome() != null) {
            treino.setNome(norm(dto.getNome()));
        }
        if (dto.getDescricao() != null) {
            treino.setDescricao(norm(dto.getDescricao()));
        }
        if (dto.getNivel() != null) {
            treino.setNivel(normalizeNivel(dto.getNivel()));
        }

        // como a classe já é @Transactional, o flush acontece automaticamente;
        // ainda assim, manter o save deixa a intenção explícita:
        return treinoRepository.save(treino);
    }

    /* =========
       EXCLUIR
       ========= */
    public void excluir(Long id) {
        Treinos treino = buscarPorId(id);
        treinoRepository.delete(treino);
    }

    /* =========
       BUSCAR POR ID
       ========= */
    @Transactional(readOnly = true)
    public Treinos buscarPorId(Long id) {
        return treinoRepository.findById(id)
                .orElseThrow(() -> new NotFound("Treino não encontrado: " + id));
    }

    /* =========
       LISTAR (nome OU nível)
       ========= */
    @Transactional(readOnly = true)
    public List<Treinos> listar(String termo) {
        if (termo == null || termo.isBlank()) {
            return treinoRepository.findAll();
        }

        String q = termo.trim();

        List<Treinos> porNome = treinoRepository.findByNomeContainingIgnoreCase(q);
        List<Treinos> porNivel = new ArrayList<>();

        // busca parcial por nível (ex.: "ini" -> pega "iniciante", "avan" -> "avançado")
        porNivel.addAll(treinoRepository.findByNivelContainingIgnoreCase(q));

        // (opcional) tentar forma “normalizada” sem acento / mapeada
        String qNorm = normalizeNivelHint(q); // abaixo
        if (!q.equalsIgnoreCase(qNorm)) {
            porNivel.addAll(treinoRepository.findByNivelContainingIgnoreCase(qNorm));
        }

        // unir sem duplicar
        LinkedHashSet<Treinos> unicos = new LinkedHashSet<>();
        unicos.addAll(porNome);
        unicos.addAll(porNivel);
        return new ArrayList<>(unicos);
    }

    // ajuda para normalizar “avan/avançado”, “inter/intermediario”, “ini/iniciante”
    private String normalizeNivelHint(String raw) {
        if (raw == null) return "";
        String n = raw.trim().toLowerCase();
        if ("avançado".startsWith(n) || "avancado".startsWith(n) || n.startsWith("avan")) return "avancado";
        if ("intermediario".startsWith(n) || "intermediário".startsWith(n) || n.startsWith("inter"))
            return "intermediario";
        if ("iniciante".startsWith(n) || n.startsWith("ini")) return "iniciante";
        // fallback: tira acento do que veio
        return n.replace("ã", "a").replace("á", "a").replace("é", "e").replace("í", "i").replace("ó", "o").replace("ú", "u").replace("ç", "c");
    }
}