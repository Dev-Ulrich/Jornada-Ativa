package br.com.belval.api.jornadaativa.model;

import java.util.Objects;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

@Entity
public class TipoTreino {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    private double velocidade;
    private String resistencia;
    private String caminhada;

    public TipoTreino() {}

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public double getVelocidade() {
        return velocidade;
    }

    public void setVelocidade(double velocidade) {
        this.velocidade = velocidade;
    }

    public String getResistencia() {
        return resistencia;
    }

    public void setResistencia(String resistencia) {
        this.resistencia = resistencia;
    }

    public String getCaminhada() {
        return caminhada;
    }

    public void setCaminhada(String caminhada) {
        this.caminhada = caminhada;
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, velocidade, resistencia, caminhada);
    }

    @Override
    public boolean equals(Object obj) {
        if (this == obj)
            return true;
        if (obj == null || getClass() != obj.getClass())
            return false;
        TipoTreino other = (TipoTreino) obj;
        return Objects.equals(id, other.id)
            && Double.compare(velocidade, other.velocidade) == 0
            && Objects.equals(resistencia, other.resistencia)
            && Objects.equals(caminhada, other.caminhada);
    }

    @Override
    public String toString() {
        return "TipoTreino [id=" + id + ", velocidade=" + velocidade + ", resistencia=" + resistencia + ", caminhada=" + caminhada + "]";
    }
}