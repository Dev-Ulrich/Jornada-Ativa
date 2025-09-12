import br.com.belval.api.jornadaativa.model.entity.HistoricoTreino;
import br.com.belval.api.jornadaativa.model.repository.HistoricoTreinoRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
@AllArgsConstructor

public class HistoricoTreinoSerivceImpl implements HistoricoTreinoService {

        private HistoricoTreinoRepository historicoTreinoRepository;

        @Override
        public HistoricoTreino findById(Long id) {
            return historicotreinoRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("Historico não encontrada com o id " + id));
        }

        @Override
        public List<HistoricoTreino> findAll() {
            return historicoTreinoRepository.findAll();
        }

        @Override
        public HistoricoTreino save(HistoricoTreino historicoTreino) {
            return historicoTreinoRepository.save(historicoTreino);
        }

        @Override
        public void delete(Long id) {
            if (!historicoTreinoRepository.existsById(id)) {
                throw new RuntimeException("Historico não encontrada com o id " + id);
            }
            historicoTreinoRepository.deleteById(id);
        }
    }

}
