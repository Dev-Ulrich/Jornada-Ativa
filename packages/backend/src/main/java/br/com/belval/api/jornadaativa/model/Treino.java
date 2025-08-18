package br.com.belval.api.jornadaativa.model;

import java.math.BigDecimal;
import java.time.Duration;
import java.time.LocalDate;
import java.util.Objects;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

@Entity
public class Treino {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idTreino;
    private String nome;
    private Duration tempo;     // Tempo do treino
    private BigDecimal vMedia;
    private BigDecimal distancia;
    private BigDecimal kcal;
    private BigDecimal pace;
    private LocalDate data;

    public Treino() {}

    // Getters e Setters
    public Long getIdTreino() {
        return idTreino;
    }

    public void setIdTreino(Long idTreino) {
        this.idTreino = idTreino;
    }

    public String getNome() {
        return nome;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }

    public Duration getTempo() {
        return tempo;
    }

    public void setTempo(Duration tempo) {
        this.tempo = tempo;
    }

    public BigDecimal getVMedia() {
        return vMedia;
    }

    public void setVMedia(BigDecimal vMedia) {
        this.vMedia = vMedia;
    }

    public BigDecimal getDistancia() {
        return distancia;
    }

    public void setDistancia(BigDecimal distancia) {
        this.distancia = distancia;
    }

    public BigDecimal getKcal() {
        return kcal;
    }

    public void setKcal(BigDecimal kcal) {
        this.kcal = kcal;
    }

    public BigDecimal getPace() {
        return pace;
    }

    public void setPace(BigDecimal pace) {
        this.pace = pace;
    }

    public LocalDate getData() {
        return data;
    }

    public void setData(LocalDate data) {
        this.data = data;
    }

    // hashCode e equals
    @Override
    public int hashCode() {
        return Objects.hash(idTreino, nome, tempo, vMedia, distancia, kcal, pace, data);
    }

    @Override
    public boolean equals(Object obj) {
        if (this == obj) return true;
        if (obj == null || getClass() != obj.getClass()) return false;
        Treino other = (Treino) obj;
        return Objects.equals(idTreino, other.idTreino) &&
               Objects.equals(nome, other.nome) &&
               Objects.equals(tempo, other.tempo) &&
               Objects.equals(vMedia, other.vMedia) &&
               Objects.equals(distancia, other.distancia) &&
               Objects.equals(kcal, other.kcal) &&
               Objects.equals(pace, other.pace) &&
               Objects.equals(data, other.data);
    }

    @Override
    public String toString() {
        return "Treino [idTreino=" + idTreino + ", nome=" + nome + ", tempo=" + tempo +
               ", vMedia=" + vMedia + ", distancia=" + distancia + ", kcal=" + kcal +
               ", pace=" + pace + ", data=" + data + "]";
    }
}
