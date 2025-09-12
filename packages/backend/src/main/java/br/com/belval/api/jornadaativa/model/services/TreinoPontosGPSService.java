package br.com.belval.api.jornadaativa.model.services;


import br.com.belval.api.jornadaativa.model.entity.TreinoPontosGPS;

import java.util.List;

public interface TreinoPontosGPSService {


    public TreinoPontosGPS findById(Long id);

    List<TreinoPontosGPS> findAll();

    public TreinoPontosGPS save(TreinoPontosGPS treinoPontosGPS);

    public void delete(Long id);

    public TreinoPontosGPS update(TreinoPontosGPS treinoPontosGPS, Long id);
}
