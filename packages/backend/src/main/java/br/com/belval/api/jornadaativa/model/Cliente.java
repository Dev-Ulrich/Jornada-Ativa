package br.com.belval.api.jornadaativa.model;

import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;


@Entity
@DiscriminatorValue("CLIENTE")
public class Cliente extends Usuario {

}
