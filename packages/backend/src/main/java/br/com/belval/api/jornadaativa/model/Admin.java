package br.com.belval.api.jornadaativa.model;

import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;


@Entity
@DiscriminatorValue("ADMIN")
public class Admin extends Usuario {

}
