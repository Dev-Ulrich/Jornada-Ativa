import React, { useState, useRef } from "react";
import { FaPencilAlt, FaPlus, FaTrashAlt } from "react-icons/fa";
import "./ComunidadeTabela.css";
import Modal from "../../Modal/Modal.jsx";
import api from "../../services/api";

const ComunidadeTabela = ({ comunidades = [], setComunidades }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [comunidadeSelecionada, setComunidadeSelecionada] = useState(null);
  const [editingCommunityId, setEditingCommunityId] = useState(null);
  const [editingData, setEditingData] = useState({
    nome: "",
    descricao: "",
    integrantes: "",
    file: null,
  });

  const fileInputRef = useRef(null);
  const usersPerPage = 10;

  const indexOfLastCommunity = currentPage * usersPerPage;
  const indexOfFirstCommunity = indexOfLastCommunity - usersPerPage;
  const currentComunidades = comunidades.slice(
    indexOfFirstCommunity,
    indexOfLastCommunity
  );

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const pageNumbers = [];
  for (let i = 1; i <= Math.ceil(comunidades.length / usersPerPage); i++) {
    pageNumbers.push(i);
  }

  const startEditing = (comunidade) => {
    setEditingCommunityId(comunidade.id);
    setEditingData({
      nome: comunidade.nome,
      descricao: comunidade.descricao,
      integrantes: comunidade.integrantes,
      file: null,
    });
  };

  const cancelEditing = () => {
    setEditingCommunityId(null);
    setEditingData({
      nome: "",
      descricao: "",
      integrantes: "",
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
      updatedData.append("descricao", editingData.descricao);
      updatedData.append("integrantes", editingData.integrantes);
      if (editingData.file) {
        updatedData.append("fotoPerfil", editingData.file);
      }

      const response = await api.put(`/comunidades/${id}`, updatedData);
      setComunidades(
        comunidades.map((comunidade) =>
          comunidade.id === id ? response.data : comunidade
        )
      );
      cancelEditing();
      alert("Comunidade atualizada com sucesso!");
      window.location.reload();
    } catch (error) {
      console.error("Erro ao atualizar a comunidade:", error);
      alert("Erro ao atualizar a comunidade. Tente novamente.");
    }
  };

  const openModal = (id) => {
    setIsModalOpen(true);
    setComunidadeSelecionada(id);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setComunidadeSelecionada(null);
  };

  const deleteComunidade = async () => {
    try {
      await api.delete(`/comunidades/${comunidadeSelecionada}`);
      setComunidades(
        comunidades.filter(
          (comunidade) => comunidade.id !== comunidadeSelecionada
        )
      );
      closeModal();
      alert("Comunidade excluída com sucesso!");
    } catch (error) {
      console.error("Erro ao excluir comunidade:", error);
      alert("Erro ao excluir comunidade. Tente novamente.");
    }
  };

  return (
    <section className="section-funcionario" id="section1">
      <h1 className="titulo-comunidades">Comunidades</h1>
      <div className="table-responsive">
        <table className="table table-bordered table-striped table-hover">
          <thead className="table-dark">
            <tr>
              <th>Foto_Comunidade</th>
              <th>Id</th>
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
                  {editingCommunityId === comunidade.id ? (
                    <>
                      {editingData.file ? (
                        <img
                          src={URL.createObjectURL(editingData.file)}
                          alt="Preview"
                          className="foto-comunidade" // Adicione esta classe CSS
                        />
                      ) : comunidade.fotoComunidade ? (
                        <img
                          src={`http://localhost:8081${comunidade.fotoComunidade}`}
                          alt="Comunidade"
                          className="foto-comunidade" // Adicione esta classe CSS
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
                  ) : comunidade.fotoComunidade ? (
                    <img
                      src={`http://localhost:8081${comunidade.fotoComunidade}`}
                      alt="Comunidade"
                      className="foto-comunidade" // Adicione esta classe CSS
                    />
                  ) : (
                    <span className="sem-foto">-</span>
                  )}
                </td>
                <td>{comunidade.id}</td>
                <td>
                  {editingCommunityId === comunidade.id ? (
                    <input
                      type="text"
                      value={editingData.nome}
                      onChange={(e) =>
                        handleEditingChange("nome", e.target.value)
                      }
                    />
                  ) : (
                    comunidade.nome
                  )}
                </td>
                <td>
                  {editingCommunityId === comunidade.id ? (
                    <input
                      type="text"
                      value={editingData.descricao}
                      onChange={(e) =>
                        handleEditingChange("descricao", e.target.value)
                      }
                    />
                  ) : (
                    comunidade.descricao
                  )}
                </td>
                <td>
                  {editingCommunityId === comunidade.id ? (
                    <input
                      type="number"
                      value={editingData.integrantes}
                      onChange={(e) =>
                        handleEditingChange("integrantes", e.target.value)
                      }
                    />
                  ) : (
                    comunidade.integrantes
                  )}
                </td>
                <td className="text-center">
                  {editingCommunityId === comunidade.id ? (
                    <>
                      <button
                        className="btn btn-sm btn-success me-2"
                        onClick={() => saveEditedUser(comunidade.id)}
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
                        onClick={() => startEditing(comunidade)}
                      >
                        <FaPencilAlt />
                      </button>
                      <button
                        className="btn btn-sm btn-danger"
                        title="Excluir"
                        onClick={() => openModal(comunidade.id)}
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
          isOpen={isModalOpen}
          onRequestClose={closeModal}
          onConfirm={deleteComunidade}
          menssage="Tem certeza que deseja excluir esta comunidade?"
        />
      )}

      <div className="text-end mt-3">
        <a
          href="/funcionario/comunidade/novacomunidade"
          className="btn btn-success"
        >
          <FaPlus /> Nova Comunidade
        </a>
      </div>
    </section>
  );
};

export default ComunidadeTabela;
