package br.com.belval.api.jornadaativa.model.entity;


import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.*;

@Entity
@Table(name = "tokens")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Token {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "expired", nullable = false)
    private Boolean expired = false;

    @Column(name = "revoked", nullable = false)
    private Boolean revoked = false;

    @Column(name = "token", length = 255, unique = false) // unique é por índice filtrado
    private String token;

    @Enumerated(EnumType.STRING)
    @Column(name = "token_type", length = 20)
    private TokenType tokenType = TokenType.BEARER;

    @ManyToOne
    @JoinColumn(name = "id_usuario")
    private Usuarios usuario;
}
