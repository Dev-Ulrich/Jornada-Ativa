package br.com.belval.api.jornadaativa.auth;

import br.com.belval.api.jornadaativa.model.entity.Role;

public class RegisterRequest {

    private String nome ;
    private String email;
    private String password;
    private Role role;

    public RegisterRequest(String nome, String email, String password, Role role) {
        this.nome = nome;
        this.email = email;
        this.password = password;
        this.role = role;
    }

    public String getNome() {
        return nome;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public Role getRole() {
        return role;
    }

    public void setRole(Role role) {
        this.role = role;
    }
}
