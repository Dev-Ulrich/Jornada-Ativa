import React from "react";
import { FaPencilAlt, FaTrashAlt, FaPlus } from "react-icons/fa";
import EditarUsuario from "./EditarUsuario";

const UsuarioTabela = ({ usuarios, handleEdit, handleDelete }) => (
  <section className="section-funcionario" id="section1">
    <h1 className="titulo-usuarios">Usuarios</h1>
    <div className="table-responsive">
      <table className="table table-bordered table-striped table-hover">
        <thead className="table-dark">
          <tr>
            <th>Foto_Perfil</th>
            <th>Id</th>
            <th>Nome</th>
            <th>Email</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {usuarios.map((usuario) => (
            <tr key={usuario.id}>
              <td>
                {usuario.foto_perfil ? (
                  <img
                    src={usuario.foto_perfil}
                    alt="Perfil"
                    className="foto-perfil"
                  />
                ) : (
                  <span className="sem-foto">-</span>
                )}
              </td>
              <td>{usuario.id}</td>
              <td>{usuario.nome}</td>
              <td>{usuario.email}</td>
              <td className="text-center">
                <button
                  className="btn btn-sm btn-primary me-2"
                  title="Editar"
                  onClick={() => handleEdit(usuario.id)}
                >
                  <FaPencilAlt />
                </button>
                <button
                  className="btn btn-sm btn-danger"
                  title="Excluir"
                  onClick={() => handleDelete(usuario.id)}
                >
                  <FaTrashAlt />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
    <div className="text-end mt-3">
      <a href="/funcionario/usuario/novousuario" className="btn btn-success">
        <FaPlus /> Novo Usuário
      </a>
    </div>
  </section>
);

export default UsuarioTabela;
