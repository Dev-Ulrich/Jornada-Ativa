package br.com.belval.api.jornadaativa.model;

import java.util.Objects;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

@Entity
public class Comunidades {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    private String nome;
    private String descricao;
    private String integrantes;

    @Column(name = "foto_comunidade")
    private String fotoComunidade;

    public Comunidades() {
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getNome() {
        return nome;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }

    public String getDescricao() {
        return descricao;
    }

    public void setDescricao(String descricao) {
        this.descricao = descricao;
    }

    public String getIntegrantes() {
        return integrantes;
    }

    public void setIntegrantes(String integrantes) {
        this.integrantes = integrantes;
    }

    public String getFotoComunidade() {
        return fotoComunidade;
    }

    public void setFotoComunidade(String fotoComunidade) {
        this.fotoComunidade = fotoComunidade;
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, nome, descricao, integrantes, fotoComunidade);
    }

    @Override
    public boolean equals(Object obj) {
        if (this == obj)
            return true;
        if (obj == null || getClass() != obj.getClass())
            return false;
        Comunidades other = (Comunidades) obj;
        return Objects.equals(id, other.id) &&
                Objects.equals(nome, other.nome) &&
                Objects.equals(descricao, other.descricao) &&
                Objects.equals(integrantes, other.integrantes) &&
                Objects.equals(fotoComunidade, other.fotoComunidade);
    }

    @Override
    public String toString() {
        return "Comunidades{" +
                "id=" + id +
                ", nome='" + nome + '\'' +
                ", descricao='" + descricao + '\'' +
                ", integrantes='" + integrantes + '\'' +
                ", fotoComunidade='" + fotoComunidade + '\'' +
                '}';
    }
}