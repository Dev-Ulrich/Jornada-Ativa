package br.com.belval.api.jornadaativa.model.services;


import br.com.belval.api.jornadaativa.exceptions.NotFound;
import br.com.belval.api.jornadaativa.model.entity.Eventos;
import br.com.belval.api.jornadaativa.model.repository.EventosRepository;
import jakarta.transaction.Transactional;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@Transactional
@AllArgsConstructor
public class EventosServiceImpl implements EventosService {
    private final EventosRepository eventosRepository;

    @Override
    public Eventos findById(Long id) {
        return eventosRepository.findById(id)
                .orElseThrow(() -> new NotFound("Evento não encontrado com o id " + id));
    }


    @Override
    public List<Eventos> findAll() {
        return eventosRepository.findAll();
    }

    @Override
    public Eventos save(Eventos eventos) {
        return eventosRepository.save(eventos);
    }

    @Override
    public void delete(Long id) {
        if (!eventosRepository.existsById(id)) {
            throw new NotFound("Evento não encontrado com o id" + id);
        }
        eventosRepository.deleteById(id);
    }

    @Override
    public Eventos update(Eventos eventos, long id) {
        Eventos eventoAtual = findById(id);
        eventoAtual.setNome(eventos.getNome());
        eventoAtual.setDescricao(eventos.getDescricao());
        eventoAtual.setDataEvento(eventos.getDataEvento());
        eventoAtual.setLinkEvento(eventos.getLinkEvento());
        eventoAtual.setImagemEvento(eventos.getImagemEvento());

        return eventosRepository.save(eventoAtual);
    }
}