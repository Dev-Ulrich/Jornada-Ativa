package br.com.belval.api.jornadaativa.model;

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
	private Integer id;
	private Double distancia;
	private LocalDate data;
	private Long tempo;
	
	public Treino() {
	}
	public Integer getId() {
		return id;
	}
	
	public void setId(Integer id) {
		this.id = id;
	}
	public Double getDistancia() {
		return distancia;
	}

	public void setDistancia(Double distancia) {
		this.distancia = distancia;
	}
	public LocalDate getData() {
		return data;
	}
	
	public void setData(LocalDate data) {
		this.data = data;
	}
	public Long getTempo() {
		return tempo;
		
	}
	public void setTempo(Long tempo) {
		this.tempo = tempo;
	}
	@Override
	public int hashCode() {
		return Objects.hash( id, distancia, data, tempo );
	}
	   
	@Override
	public boolean equals(Object obj) {
		if (this == obj) {
			return true;
		} else if (obj == null) {
			return false;
		} else if (this.getClass() != obj.getClass()) {
			return false;
		} else {
			Treino other = (Treino) obj;
			return Objects.equals(id, other.id) && Objects.equals(distancia, other.distancia)
					&& Objects.equals(tempo, other.tempo) && Objects.equals(data, other.data);
		}
	}
	
	@Override
	public String toString() {
		return "Treino [id=" + id + ", distancia=" + distancia + ", tempo=" + tempo + ", data=" + data
				+ "]";
	}
}

