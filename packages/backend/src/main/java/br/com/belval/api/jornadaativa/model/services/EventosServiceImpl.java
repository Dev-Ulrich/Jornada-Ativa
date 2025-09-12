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
         return eventosRepository.findById(id)
            .

    orElseThorow(() ->new

    NotFound("Evento não encontrado com o id "+id));


    @Override
    public List<Eventos> findAll() {
        return eventosRepository.findbyAll();
    }

    @Override
    public Eventos save(Eventos eventos) {
        return eventos.Repository.save(eventos);
    }

    @Override
    public void delete(long id) {
        if (!eventosRepository.existsById(id)) {
            throw new NotFound("Evento não encontrado com o id" + id);
        }
        eventosRepository.deleteById(id);
    }

    @Override
    public Eventos update(Eventos eventos, long id) {
        Eventos EventoAtual = findById(id);
        EventoAtual.setNome(eventos.getNome());
        EventoAtual.setDescricao(eventos.getDescricao());

        return eventosRepository.save(eventoAtual);
    }
}