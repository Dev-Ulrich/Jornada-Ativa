import { useState } from "react";
import "./UsuarioTabela.css";

const UsuarioTabela = ({ usuarios }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 10;

  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = usuarios.slice(indexOfFirstUser, indexOfLastUser);

  const pageNumbers = [];
  for (let i = 1; i <= Math.ceil(usuarios.length / usersPerPage); i++) {
    pageNumbers.push(i);
  }

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="usuario-tabela-wrapper">
      <div className="usuario-tabela-container">
        <h1>Tabela de Usuarios</h1>
        <table>
          <thead>
            <tr>
              <th>Foto_Perfil</th>
              <th>ID</th>
              <th>Nome</th>
              <th>E-mail</th>
              <th>Data de Cadastro</th>
              <th>Status</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {currentUsers.map((usuario) => (
              <tr key={usuario.id}>
                <td>
                  {usuario.fotoPerfil ? (
                    <img
                      src={`http://localhost:8081${usuario.fotoPerfil}`}
                      alt="Perfil"
                      className="foto-perfil"
                    />
                  ) : (
                    <span className="sem-foto">-</span>
                  )}
                </td>
                <td>{usuario.id}</td>
                <td>{usuario.nome}</td>
                <td>
                  <a href={`mailto:${usuario.email}`}>{usuario.email}</a>
                </td>
                <td>
                  <span className="data-cadastro">{usuario.dataCadastro}</span>
                </td>
                <td>
                  <span
                    className={
                      usuario.status === "Ativo"
                        ? "status-ativo"
                        : "status-bloqueado"
                    }
                  >
                    {usuario.status}
                  </span>
                </td>
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
        <a href="/admin/usuario/novousuario" className="novo-usuario-btn">
          <span style={{ fontSize: "1.3em", fontWeight: "bold" }}>+</span> Novo
          Usuário
        </a>
      </div>
    </div>
  );
};

export default UsuarioTabela;
