package br.com.belval.api.jornadaativa.model;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Objects;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Table(name = "usuario")
@Entity
public class Usuario {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idUsuario;
    private String nome;
    private String email;
    private String senha;
    private String genero;
    private LocalDate dataNascimento;
    private Integer nivel;
    private BigDecimal altura;
    private BigDecimal peso;
    private String fotoPerfil;

    public Usuario() {
    }

    public Long getIdUsuario() {
        return idUsuario;
    }

    public void setIdUsuario(Long idUsuario) {
        this.idUsuario = idUsuario;
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

    public String getSenha() {
        return senha;
    }

    public void setSenha(String senha) {
        this.senha = senha;
    }

    public String getGenero() {
        return genero;
    }

    public void setGenero(String genero) {
        this.genero = genero;
    }

    public LocalDate getDataNascimento() {
        return dataNascimento;
    }

    public void setDataNascimento(LocalDate dataNascimento) {
        this.dataNascimento = dataNascimento;
    }

    public Integer getNivel() {
        return nivel;
    }

    public void setNivel(Integer nivel) {
        this.nivel = nivel;
    }

    public BigDecimal getAltura() {
        return altura;
    }

    public void setAltura(BigDecimal altura) {
        this.altura = altura;
    }

    public BigDecimal getPeso() {
        return peso;
    }

    public void setPeso(BigDecimal peso) {
        this.peso = peso;
    }

    public String getFotoPerfil() {
        return fotoPerfil;
    }

    public void setFotoPerfil(String fotoPerfil) {
        this.fotoPerfil = fotoPerfil;
    }

    @Override
    public int hashCode() {
        return Objects.hash(idUsuario, nome, email, senha, genero,
                dataNascimento, altura, peso, nivel, fotoPerfil);
    }

    @Override
    public boolean equals(Object obj) {
        if (this == obj)
            return true;
        if (obj == null || getClass() != obj.getClass())
            return false;
        Usuario other = (Usuario) obj;
        return Objects.equals(idUsuario, other.idUsuario) &&
                Objects.equals(nome, other.nome) &&
                Objects.equals(email, other.email) &&
                Objects.equals(senha, other.senha) &&
                Objects.equals(genero, other.genero) &&
                Objects.equals(dataNascimento, other.dataNascimento) &&
                Objects.equals(altura, other.altura) &&
                Objects.equals(peso, other.peso) &&
                Objects.equals(nivel, other.nivel) &&
                Objects.equals(fotoPerfil, other.fotoPerfil);
    }

    @Override
    public String toString() {
        return "Usuario {" +
                "idUsuario=" + idUsuario +
                ", nome='" + nome + '\'' +
                ", email='" + email + '\'' +
                ", senha='" + senha + '\'' +
                ", genero='" + genero + '\'' +
                ", dataNascimento=" + dataNascimento +
                ", altura=" + altura +
                ", peso=" + peso +
                ", nivel=" + nivel +
                ", fotoPerfil='" + fotoPerfil + '\'' +
                '}';
    }
}
