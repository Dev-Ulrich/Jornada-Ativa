package br.com.belval.api.jornadaativa.model.service;


import br.com.belval.api.jornadaativa.exceptions.NotFound;
import br.com.belval.api.jornadaativa.model.entity.Eventos;
import br.com.belval.api.jornadaativa.model.entity.StatusEvento;
import br.com.belval.api.jornadaativa.model.repository.EventosRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class EventosService {

    private final EventosRepository eventosRepository;


    // 🔹 Total de eventos cadastrados
    public long contarEventos() {
        return eventosRepository.count();
    }

    // 🔹 Total de eventos com status "ATIVO"
    public long contarEventosAtivos() {
        return eventosRepository.countByStatus(StatusEvento.ATIVO);
    }


    @Transactional
    public Eventos criar(Eventos e) {
        return eventosRepository.save(e);
    }

    @Transactional
    public Eventos atualizar(Long id, Eventos dados) {
        Eventos evento = buscarPorId(id);
        evento.setNome(dados.getNome());
        evento.setDescricao(dados.getDescricao());
        evento.setLinkEvento(dados.getLinkEvento());
        evento.setDataEvento(dados.getDataEvento());
        evento.setImagemEvento(dados.getImagemEvento());
        return eventosRepository.save(evento);
    }

    @Transactional
    public void excluir(Long id) {
        Eventos evento = buscarPorId(id);
        eventosRepository.delete(evento);
    }

    public Eventos buscarPorId(Long id) {
        return eventosRepository.findById(id)
                .orElseThrow(() -> new NotFound("Evento não encontrado: " + id));
    }

    public List<Eventos> listar(String nome) {
        if (nome == null || nome.isBlank()) return eventosRepository.findAll();
        return eventosRepository.findByNomeContainingIgnoreCase(nome);
    }

    public List<Eventos> proximos(LocalDate aPartirDe) {
        LocalDate ref = (aPartirDe != null ? aPartirDe : LocalDate.now());
        return eventosRepository.findByDataEventoGreaterThanEqualOrderByDataEventoAsc(ref);
    }
}
