import { useState, useEffect } from "react";
import api from "../../services/api"; // importe o api
import "./ComunidadeTabela.css";

const ComunidadeTabela = () => {
  const [comunidades, setComunidades] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const communitiesPerPage = 10;

  useEffect(() => {
    api
      .get("/api/comunidade")
      .then((res) => setComunidades(res.data))
      .catch((err) => console.error("Erro ao buscar comunidades:", err));
  }, []);

  const indexOfLastCommunity = currentPage * communitiesPerPage;
  const indexOfFirstCommunity = indexOfLastCommunity - communitiesPerPage;
  const currentComunidades = comunidades.slice(
    indexOfFirstCommunity,
    indexOfLastCommunity
  );

  const pageNumbers = [];
  for (
    let i = 1;
    i <= Math.ceil(comunidades.length / communitiesPerPage);
    i++
  ) {
    pageNumbers.push(i);
  }

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="usuario-tabela-wrapper">
      <div className="usuario-tabela-container">
        <h1>Tabela de Comunidades</h1>
        <table>
          <thead>
            <tr>
              <th>Foto_Comunidade</th>
              <th>ID</th>
              <th>Nome</th>
              <th>Descrição</th>
              <th>Integrantes</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {currentComunidades.map((comunidade) => (
              <tr key={comunidade.id}>
                <td>
                  {comunidade.fotoComunidade ? (
                    <img
                      src={`http://localhost:8081${comunidade.ftComunidade}`}
                      alt="Comunidade"
                      className="foto-comunidade"
                    />
                  ) : (
                    "NULL"
                  )}
                </td>
                <td>{comunidade.idComunidade}</td>
                <td>{comunidade.nome}</td>
                <td>{comunidade.descricao}</td>
                <td>{comunidade.integrantes ?? "NULL"}</td>
                <td>
                  <button className="btn-acao editar" title="Editar">
                    <span role="img" aria-label="editar">
                      ✏️
                    </span>
                  </button>
                  <button className="btn-acao excluir" title="Excluir">
                    <span role="img" aria-label="excluir">
                      🗑️
                    </span>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <nav>
          <ul className="pagination">
            {pageNumbers.map((number) => (
              <li key={number} className="page-item">
                <a
                  onClick={() => paginate(number)}
                  href="#"
                  className="page-link"
                >
                  {number}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <a href="/admin/comunidade/novacomunidade" className="novo-usuario-btn">
          <span style={{ fontSize: "1.3em", fontWeight: "bold" }}>+</span> Nova
          Comunidade
        </a>
      </div>
    </div>
  );
};

export default ComunidadeTabela;
