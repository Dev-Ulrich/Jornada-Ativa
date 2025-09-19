import { useState } from "react";
import "./TreinoTabela.css";


const TreinoTabela = ({ treinos }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const treinosPerPage = 10;

  const indexOfLastTreino = currentPage * treinosPerPage;
  const indexOfFirstTreino = indexOfLastTreino - treinosPerPage;
  const currentTreinos = treinos.slice(indexOfFirstTreino, indexOfLastTreino);

  const pageNumbers = [];
  for (let i = 1; i <= Math.ceil(treinos.length / treinosPerPage); i++) {
    pageNumbers.push(i);
  }

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="usuario-tabela-wrapper">
      <div className="usuario-tabela-container">
        <h1>Tabela de Treinos</h1>
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Nome</th>
              <th>Descrição</th>
              <th>Nível</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {currentTreinos.map((treino) => (
              <tr key={treino.id}>
                <td>{treino.id}</td>
                <td>{treino.nome}</td>
                <td>{treino.descricao}</td>
                <td>{treino.nivel}</td>
                <td>
                  <button className="btn-acao editar" title="Editar">
                    <span role="img" aria-label="editar">✏️</span>
                  </button>
                  <button className="btn-acao excluir" title="Excluir">
                    <span role="img" aria-label="excluir">🗑️</span>
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
        <a href="/admin/treino/novotreino" className="novo-usuario-btn">
          <span style={{ fontSize: "1.3em", fontWeight: "bold" }}>+</span> Novo Treino
        </a>
      </div>
    </div>
  );
};

export default TreinoTabela;