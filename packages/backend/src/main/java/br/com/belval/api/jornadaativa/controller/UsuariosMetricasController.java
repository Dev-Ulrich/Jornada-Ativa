package br.com.belval.api.jornadaativa.controller;


import br.com.belval.api.jornadaativa.model.service.UsuariosMetricasService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/usuarios" )
public class UsuariosMetricasController {

    private final UsuariosMetricasService service;

    public UsuariosMetricasController(UsuariosMetricasService service) {
        this.service = service;
    }

    @GetMapping("/metricas")
    public ResponseEntity<?> metricas(@RequestParam String range) {
        return switch (range) {
            case "semana" -> ResponseEntity.ok(service.metricasUltimos7Dias());
            case "mes"    -> ResponseEntity.ok(service.metricasUltimos12Meses());
            default       -> ResponseEntity.badRequest().body("range inválido: use semana|mes");
        };
    }
}
