package br.com.belval.api.jornadaativa.config;

import br.com.belval.api.jornadaativa.model.entity.Role;
import br.com.belval.api.jornadaativa.model.entity.RoleName;
import br.com.belval.api.jornadaativa.model.repository.RoleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class RoleSeeder implements CommandLineRunner {

    private final RoleRepository roleRepository;

    @Override
    public void run(String... args)  {
        createRoleIfNotExists(RoleName.ROLE_USER, "Usuário comum do sistema");
        createRoleIfNotExists(RoleName.ROLE_ADMIN, "Administrador do sistema");
    }

    private void createRoleIfNotExists(RoleName roleName, String description) {
        if (roleRepository.findByName(roleName).isEmpty()) {
            Role role = new Role();
            role.setName(roleName);
            role.setDescription(description);
            roleRepository.save(role);
            System.out.println("✅ Criado: " + roleName);
        }
    }
}
