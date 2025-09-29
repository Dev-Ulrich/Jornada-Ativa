package br.com.belval.api.jornadaativa.controller;


import br.com.belval.api.jornadaativa.auth.AuthenticationResponse;
import br.com.belval.api.jornadaativa.auth.AuthenticationService;
import br.com.belval.api.jornadaativa.auth.RegisterRequest;
import br.com.belval.api.jornadaativa.model.entity.Role;
import lombok.NoArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/cliente")
@NoArgsConstructor
public class ClienteController {

    private final AuthenticationService authenticationService;

    @PostMapping
    public ResponseEntity<AuthenticationResponse> register(@RequestBody RegisterRequest request){
        request.setRole(Role.CLIENTE);
        return ResponseEntity.ok(authenticationService.register(request));
    }
}
