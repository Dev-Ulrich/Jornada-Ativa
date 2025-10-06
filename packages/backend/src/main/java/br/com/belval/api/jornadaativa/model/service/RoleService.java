package br.com.belval.api.jornadaativa.model.service;


import br.com.belval.api.jornadaativa.model.entity.Role;
import br.com.belval.api.jornadaativa.model.entity.RoleName;
import br.com.belval.api.jornadaativa.model.repository.RoleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class RoleService {

    private final RoleRepository roleRepository;

    public Role getOrThrow(RoleName name) {
        return roleRepository.findByName(name)
                .orElseThrow(() -> new IllegalArgumentException("Role não encontrada: " + name));
    }
}
