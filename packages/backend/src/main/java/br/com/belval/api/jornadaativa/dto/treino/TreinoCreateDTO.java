package br.com.belval.api.jornadaativa.dto.treino;


import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TreinoCreateDTO {



    @NotBlank @Size(max = 255) private String nome;
    @Size(max = 255) private String descricao;
    @Size(max = 50) private String nivel;
}
