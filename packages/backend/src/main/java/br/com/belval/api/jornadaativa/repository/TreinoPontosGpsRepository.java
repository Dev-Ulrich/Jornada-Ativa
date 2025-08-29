package br.com.belval.api.jornadaativa.repository;

import br.com.belval.api.jornadaativa.model.TreinoPontosGPS;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TreinoPontosGpsRepository extends JpaRepository<TreinoPontosGPS, Long> {

    List<TreinoPontosGPS> findByIdPonto(Long idPonto);

    List<TreinoPontosGPS> findByLatitude(BigDecimal latitude);

    List<TreinoPontosGPS> findByLongitude(BigDecimal longitude);

    List<TreinoPontosGPS> findByMomento(LocalDateTime momento);

}