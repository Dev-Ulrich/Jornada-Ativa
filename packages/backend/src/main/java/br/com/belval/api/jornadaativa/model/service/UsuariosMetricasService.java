package br.com.belval.api.jornadaativa.model.service;

import br.com.belval.api.jornadaativa.model.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.YearMonth;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class UsuariosMetricasService {


    private final UsuarioRepository usuarioRepository;

    public record MetricasSemanaDTO(String dia, long cadastros) {}
    public record MetricasMesDTO(String mes, long cadastros) {}

    // Última semana (seg..dom) — rótulos curtos
    public List<MetricasSemanaDTO> metricasUltimos7Dias() {
        LocalDate hoje = LocalDate.now();
        LocalDate segunda = hoje.minusDays((hoje.getDayOfWeek().getValue() + 6) % 7);

        String[] rotulos = {"Seg","Ter","Qua","Qui","Sex","Sáb","Dom"};
        List<MetricasSemanaDTO> out = new ArrayList<>(7);

        for (int i = 0; i < 7; i++) {
            LocalDate d = segunda.plusDays(i);
            LocalDateTime ini = d.atStartOfDay();
            LocalDateTime fim = d.plusDays(1).atStartOfDay().minusNanos(1);
            long c = usuarioRepository.countByCreatedAtBetween(ini, fim);
            out.add(new MetricasSemanaDTO(rotulos[i], c));
        }
        return out;
    }

    // Últimos 12 meses (do mês atual voltando 11)
    public List<MetricasMesDTO> metricasUltimos12Meses() {
        YearMonth atual = YearMonth.now();
        String[] meses = {"Jan","Fev","Mar","Abr","Mai","Jun","Jul","Ago","Set","Out","Nov","Dez"};

        List<MetricasMesDTO> out = new ArrayList<>(12);
        for (int i = 11; i >= 0; i--) {
            YearMonth ym = atual.minusMonths(i);
            LocalDateTime ini = ym.atDay(1).atStartOfDay();
            LocalDateTime fim = ym.atEndOfMonth().atTime(23,59,59,999_999_999);
            long c = usuarioRepository.countByCreatedAtBetween(ini, fim);
            out.add(new MetricasMesDTO(meses[ym.getMonthValue()-1], c));
        }
        return out;
    }
}
