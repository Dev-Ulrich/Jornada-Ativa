package br.com.belval.api.jornadaativa.model;

import java.util.Objects;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

@Entity
public class TipoTreinos {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer idTipoTreino;
    private double velocidade;
    private String resistencia;
    private String caminhada;

    public TipoTreinos() {}

    public Integer getIdTipoTreino() {
        return idTipoTreino;
    }

    public void setIdTipoTreino(Integer idTipoTreino) {
        this.idTipoTreino = idTipoTreino;
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
        return Objects.hash(idTipoTreino, velocidade, resistencia, caminhada);
    }

    @Override
    public boolean equals(Object obj) {
        if (this == obj)
            return true;
        if (obj == null || getClass() != obj.getClass())
            return false;
        TipoTreinos other = (TipoTreinos) obj;
        return Objects.equals(idTipoTreino, other.idTipoTreino)
            && Double.compare(velocidade, other.velocidade) == 0
            && Objects.equals(resistencia, other.resistencia)
            && Objects.equals(caminhada, other.caminhada);
    }

    @Override
    public String toString() {
        return "TipoTreino [idTipoTreino=" + idTipoTreino + ", velocidade=" + velocidade + ", resistencia=" + resistencia + ", caminhada=" + caminhada + "]";
    }
}