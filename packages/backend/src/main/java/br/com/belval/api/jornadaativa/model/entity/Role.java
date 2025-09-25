package br.com.belval.api.jornadaativa.model.entity;


import org.springframework.security.core.authority.SimpleGrantedAuthority;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

import static br.com.belval.api.jornadaativa.model.entity.Permission.*;

public enum Role {

    ADMIN (
            Set.of (
                    ADMIN_READ,
                    ADMIN_UPDATE,
                    ADMIN_DELETE,
                    ADMIN_CREATE
            )
    ),
    CLIENTE (
            Set.of (
                    CLIENTE_READ,
                    CLIENTE_UPDATE,
                    CLIENTE_DELETE,
                    CLIENTE_CREATE
            )
    );

    private final Set<Permission> permissions;

    Role(Set<Permission> permissions) {this.permissions = permissions;}

    public List<SimpleGrantedAuthority> getAuthorities() {

        var authorities = getPermissions()
                .stream()
                .map(permission -> new SimpleGrantedAuthority(permission.toString()))
                .collect(Collectors.toList());
        authorities.add(new SimpleGrantedAuthority("ROLE_" + this.name()));
        return authorities;
    }

    public Set<Permission> getPermissions() {
        return permissions;
    }
    
}
