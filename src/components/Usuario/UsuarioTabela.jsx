// import { Modal } from "bootstrap";
import { useRef, useState } from "react";
import { FaPencilAlt, FaPlus, FaTrashAlt } from "react-icons/fa";
import './UsuarioTabela.css';
import Modal from "../../Modal/Modal.jsx";
import api from "../../services/api";

const UsuarioTabela = ({ usuarios, setUsuarios}) => {

  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [usuarioSelecionado, setUsuarioSelecionado] = useState(null);
  const [editingUserId, setEditingUserId] = useState(null);
  const [editingData, setEditingData] = useState({
  nome: "",
  email: "",
  file: null, 
});

const fileInputRef = useRef(null);
const usersPerPage = 10;

const indexOfLastUser = currentPage * usersPerPage;
const indexOfFirstUser = indexOfLastUser - usersPerPage;
const currentUsers = usuarios.slice(indexOfFirstUser, indexOfLastUser);

const paginate = (pageNumber) => setCurrentPage(pageNumber);

const pageNumbers = [];
  for (let i = 1; i <= Math.ceil(usuarios.length / usersPerPage); i++) {
    pageNumbers.push(i);
  };



const startEditing = (usuario) => {
  setEditingUserId(usuario.id);
  setEditingData({
    nome: usuario.nome,
    email: usuario.email,
    file: null, // nenhum arquivo novo ainda
  });
};

const cancelEditing = () => {
  setEditingUserId(null);
  setEditingData({
    nome: "",
    email: "",
    file: null,
  });
};

const handleEditingChange = (field, value) => {
  setEditingData({ ...editingData, [field]: value });
};

const saveEditedUser = async (id) => {
  try {
    const updatedData = new FormData();
    updatedData.append("nome", editingData.nome);
    updatedData.append("email", editingData.email);
    if (editingData.file) {
      updatedData.append("files", editingData.file);
    }
    const response = await api.put(`/usuarios/${id}`, updatedData);
    setUsuarios(
      usuarios.map((usuario) =>
        usuario.id === id ? response.data : usuario
      )
    );
    cancelEditing();
    alert("Usuário atualizado com sucesso!");
    window.location.reload();
  } catch (error) {
    console.error("Erro ao atualizar usuário: ", error);
    alert("Erro ao atualizar usuário. Tente novamente.");
  }
};

  const openModal = (id) => {
    setIsModalOpen(true);
    setUsuarioSelecionado(id);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setUsuarioSelecionado(null);
  };

  const deleteUsuario = async () => {
    try {
      await api.delete(`/usuarios/${usuarioSelecionado}`);
      setUsuarios(
        usuarios.filter((usuario) => usuario.id !== usuarioSelecionado)
      );
      closeModal();
      alert("Usuário excluído com sucesso!");
    }catch (error) {
      console.error("Erro ao excluir usuário: ", error);
      alert("Erro ao excluir usuário. Tente novamente.");
    }
  }

  

  return(
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
            {currentUsers.map((usuario) => (
              <tr key={usuario.id}>
                <td>
                  {editingUserId === usuario.id ? (
                    <>
                      {editingData.file ? (
                        <img
                          src={URL.createObjectURL(editingData.file)}
                          alt="Preview"
                          className="foto-perfil"
                        />
                      ) : usuario.fotoPerfil ? (
                        <img
                          src={`http://localhost:8081${usuario.fotoPerfil}`}
                          alt="Perfil"
                          className="foto-perfil"
                        />
                      ) : (
                        <span className="sem-foto">-</span>
                      )}
                      <button
                        className="btn btn-sm btn-secondary mt-1"
                        onClick={() =>
                          fileInputRef.current && fileInputRef.current.click()
                        }
                      >
                        Alterar Foto
                      </button>
                      <input
                        type="file"
                        style={{ display: "none" }}
                        ref={fileInputRef}
                        onChange={(e) =>
                          e.target.files[0] &&
                          handleEditingChange("file", e.target.files[0])
                        }
                      />
                    </>
                  ) : usuario.fotoPerfil ? (
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
                <td>
                  {editingUserId === usuario.id ? (
                    <input
                      type="text"
                      value={editingData.nome}
                      onChange={(e) =>
                        handleEditingChange("nome", e.target.value)
                      }
                    />
                  ) : (
                    usuario.nome
                  )}
                </td>
                <td>
                  {editingUserId === usuario.id ? (
                    <input
                      type="email"
                      value={editingData.email}
                      onChange={(e) =>
                        handleEditingChange("email", e.target.value)
                      }
                    />
                  ) : (
                    usuario.email
                  )}
                </td>
                <td className="text-center">
                  {editingUserId === usuario.id ? (
                    <>
                      <button
                        className="btn btn-sm btn-success me-2"
                        onClick={() => saveEditedUser(usuario.id)}
                      >
                        Salvar
                      </button>
                      <button
                        className="btn btn-sm btn-secondary"
                        onClick={cancelEditing}
                      >
                        Cancelar
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        className="btn btn-sm btn-primary me-2"
                        title="Editar"
                        onClick={() => startEditing(usuario)}
                      >
                        <FaPencilAlt />
                      </button>
                      <button
                        className="btn btn-sm btn-danger"
                        title="Excluir"
                        onClick={() => openModal(usuario.id)}
                      >
                        <FaTrashAlt />
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
      </table>
    </div>

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

    {isModalOpen && (
      <Modal
        isOpen = {isModalOpen}
        onClose={closeModal}
        onConfirm={deleteUsuario}
        menssage="Tem certeza que deseja excluir este usuário?"
        />
    )}

    <div className="text-end mt-3">
      <a href="/funcionario/usuario/novousuario" className="btn btn-success">
        <FaPlus /> Novo Usuário
      </a>
    </div>
  </section>
)};
export default UsuarioTabela;