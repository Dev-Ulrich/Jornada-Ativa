package br.com.belval.api.jornadaativa.model;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.databind.annotation.JsonDeserialize;

import br.com.belval.api.jornadaativa.util.BigDecimalDeserializer;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Table(name = "usuario")

public class Usuario {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idUsuario;
    @Column(nullable = false, length = 100)
    private String nome;
    @Column(nullable = false, unique = true, length = 150)
    private String email;
    @Column(name = "senha_hash", nullable = false, length = 255)
    private String senha_hash;
    @Column(length = 20)
    private String genero;
    @Column(name = "data_nascimento", nullable = false)
    private LocalDate dataNascimento;
    @Column
    private Integer nivel;
    @Column(precision = 5, scale = 2)
    @JsonDeserialize(using = BigDecimalDeserializer.class)
    private BigDecimal altura;
    @Column(precision = 5, scale = 2)
    @JsonDeserialize(using = BigDecimalDeserializer.class)
    private BigDecimal peso;
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;
    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;
    @Column(name = "foto_perfil", length = 255)
    private String fotoPerfil;

    @OneToMany(mappedBy = "usuario", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JsonIgnore
    private List<Postagem> ponstagens;

    @OneToMany(mappedBy = "usuario", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JsonIgnore
    private List<HistoricoTreino> historicosTreinos;

    @OneToMany(mappedBy = "usuario", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JsonIgnore
    private List<UsuarioComunidade> comunidadesParticipa;

    @OneToMany(mappedBy = "usuarioCriador", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JsonIgnore
    private List<Comunidades> ComunidadesCriadas;
}
