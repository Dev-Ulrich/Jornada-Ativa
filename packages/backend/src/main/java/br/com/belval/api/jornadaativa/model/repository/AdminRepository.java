package br.com.belval.api.jornadaativa.model.repository;

import br.com.belval.api.jornadaativa.model.entity.Admin;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AdminRepository extends JpaRepository<Admin,Long> {
}
