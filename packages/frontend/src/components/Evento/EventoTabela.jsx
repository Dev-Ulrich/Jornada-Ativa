import React, { useState } from "react";
import "./EventoTabela.css";

const EventoTabela = ({ eventos = [] }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const eventosPerPage = 10;

  const indexOfLastEvento = currentPage * eventosPerPage;
  const indexOfFirstEvento = indexOfLastEvento - eventosPerPage;
  const currentEventos = eventos.slice(indexOfFirstEvento, indexOfLastEvento);

  const pageNumbers = [];
  for (let i = 1; i <= Math.ceil(eventos.length / eventosPerPage); i++) {
    pageNumbers.push(i);
  }

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="usuario-tabela-wrapper">
      <div className="usuario-tabela-container">
        <h1>Tabela de Eventos</h1>
        <table>
          <thead>
            <tr>
              <th>Imagem Evento</th>
              <th>ID</th>
              <th>Nome</th>
              <th>Descrição</th>
              <th>Link do Evento</th>
              <th>Data do Evento</th>
              
              <th>Data de Criação</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {currentEventos.map((evento) => (
              <tr key={evento.id}>
                <td>{evento.id}</td>
                <td>{evento.nome}</td>
                <td>{evento.descricao}</td>
                <td>
                  {evento.link ? (
                    <a href={evento.link} target="_blank" rel="noopener noreferrer">
                      {evento.link}
                    </a>
                  ) : (
                    "-"
                  )}
                </td>
                <td>{evento.dataEvento}</td>
                <td>
                  {evento.imagem ? (
                    <img
                      src={`http://localhost:8081${evento.imagem}`}
                      alt="Evento"
                      className="foto-evento"
                      style={{ width: "40px", height: "40px", borderRadius: "8px", objectFit: "cover" }}
                    />
                  ) : (
                    <span className="sem-foto">-</span>
                  )}
                </td>
                <td>{evento.dataCriacao}</td>
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
        <a href="/admin/evento/novoevento" className="novo-usuario-btn">
          <span style={{ fontSize: "1.3em", fontWeight: "bold" }}>+</span> Novo Evento
        </a>
      </div>
    </div>
  );
};

export default EventoTabela;