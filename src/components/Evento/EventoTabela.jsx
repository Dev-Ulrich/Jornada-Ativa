import React, { useState, useEffect } from "react";
import { FaPencilAlt, FaTrashAlt, FaPlus } from "react-icons/fa";
import "./EventoTabela.css";
import Modal from "../../Modal/Modal.jsx";
import api from "../../services/api.jsx";

const EventoTabela = ({ eventos, setEventos }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [eventoSelecionado, setEventoSelecionado] = useState(null);
  const [editingEventoId, setEditingEventoId] = useState(null);
  const [editingData, setEditingData] = useState({
    nome: "",
    descricao: "",
    link: "",
  });

  const usersPerPage = 10;

  const indexOfLastEvento = currentPage * usersPerPage;
  const indexOfFirstEvento = indexOfLastEvento - usersPerPage;
  const currentEventos = eventos.slice(indexOfFirstEvento, indexOfLastEvento);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const pageNumbers = [];
  for (let i = 1; i <= Math.ceil(eventos.length / usersPerPage); i++) {
    pageNumbers.push(i);
  }

  const startEditing = (evento) => {
    setEditingEventoId(evento.id);
    setEditingData({
      nome: evento.nome,
      descricao: evento.descricao,
      link: evento.link,
    });
  };
  const cancelEditing = () => {
    setEditingEventoId(null);
    setEditingData({
      nome: "",
      descricao: "",
      link: "",
    });
  };
  const handleEditingChange = (field, value) => {
    setEditingData({ ...editingData, [field]: value });
  };

  const saveEditedTreino = async (id) => {
    try {
      const updatedData = {
        nome: editingData.nome,
        descricao: editingData.descricao,
        link: editingData.link,
      };
      const response = await api.put(`/eventos/${id}`, updatedData);
      setEventos(
        eventos.map((evento) => (evento.id === id ? response.data : evento))
      );

      cancelEditing();
      alert("Treino atualizado com sucesso!");
      window.location.reload();
    } catch (error) {
      console.error("Erro ao atualizar o treino:", error);
      alert("Erro ao atualizar o treino. Tente novamente mais tarde.");
    }
  };

  const openModal = (id) => {
    setIsModalOpen(true);
    setEventoSelecionado(id);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEventoSelecionado(null);
  };

  const deleteEvento = async () => {
    try {
      await api.delete(`/eventos/${eventoSelecionado}`);
      setEventos(eventos.filter((evento) => evento.id !== eventoSelecionado));
      closeModal();
      alert("Evento deletado com sucesso!");
    } catch (error) {
      console.error("Erro ao deletar o evento:", error);
      alert("Erro ao deletar o evento. Tente novamente mais tarde.");
    }
  };

  useEffect(() => {
    console.log("Eventos atualizados:", eventos);
  }, [eventos]);

  return (
    <section className="section-evento" id="section4">
      <h1 className="titulo-eventos">Eventos</h1>
      <div className="table-responsive">
        <table className="table table-bordered table-striped table-hover">
          <thead className="table-dark">
            <tr>
              <th>Id</th>
              <th>Nome</th>
              <th>Descrição</th>
              <th>Link</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {currentEventos.map((evento) => (
              <tr key={evento.id}>
                <td>{evento.id}</td>
                <td>
                  {editingEventoId === evento.id ? (
                    <input
                      type="text"
                      value={editingData.nome}
                      onChange={(e) =>
                        handleEditingChange("nome", e.target.value)
                      }
                    />
                  ) : (
                    evento.nome
                  )}
                </td>
                <td>
                  {editingEventoId === evento.id ? (
                    <input
                      type="text"
                      value={editingData.descricao}
                      onChange={(e) =>
                        handleEditingChange("descricao", e.target.value)
                      }
                    />
                  ) : (
                    evento.descricao
                  )}
                </td>
                <td>
                  {editingEventoId === evento.id ? (
                    <input
                      type="url"
                      value={editingData.link}
                      onChange={(e) =>
                        handleEditingChange("link", e.target.value)
                      }
                    />
                  ) : (
                    evento.link
                  )}
                </td>
                <td className="text-center">
                  {editingEventoId === evento.id ? (
                    <>
                      <button
                        className="btn btn-sm btn-success me-2"
                        onClick={() => saveEditedTreino(evento.id)}
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
                        onClick={() => startEditing(evento)}
                      >
                        <FaPencilAlt />
                      </button>
                      <button
                        className="btn btn-sm btn-danger"
                        title="Excluir"
                        onClick={() => openModal(evento.id)}
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
          onClose={closeModal}
          onConfirm={deleteEvento}
          menssage="Tem certeza que deseja excluir este treino?"
        />
      )}

      <div className="text-end mt-3">
        <a href="/funcionario/evento/novoevento" className="btn btn-success">
          <FaPlus /> Novo Evento
        </a>
      </div>
    </section>
  );
};

export default EventoTabela;
