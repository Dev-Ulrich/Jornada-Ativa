import React, { useState, useEffect } from "react";
import { FaPencilAlt, FaTrashAlt, FaPlus } from "react-icons/fa";
import './TipoTreinoTabela.css';
import Modal from "../../Modal/Modal.jsx";
import api from "../../services/api.jsx";

const TipoTreinoTabela = ({ tipoTreinos = [], setTiposTreinos }) => {
    const [currentPage, setCurrentPage] = useState(1);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [tipoTreinoSelecionado, setTipoTreinoSelecionado] = useState(null);
    const [editingTipoTreinoId, setEditingTipoTreinoId] = useState(null);
    const [editingData, setEditingData] = useState({
        velocidade: "",
        resistencia: "",
        caminhada: "",
    });

    const usersPerPage = 10;

    const indexOfLastTipoTreino = currentPage * usersPerPage;
    const indexOfFirstTipoTreino = indexOfLastTipoTreino - usersPerPage;
    const currentTipoTreinos = tipoTreinos.slice(indexOfFirstTipoTreino, indexOfLastTipoTreino);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    const pageNumbers = [];
    for (let i = 1; i <= Math.ceil(tipoTreinos.length / usersPerPage); i++) {
        pageNumbers.push(i);
    }

    // Correção: campos corretos ao iniciar edição
    const startEditing = (tipoTreino) => {
        setEditingTipoTreinoId(tipoTreino.id);
        setEditingData({
            velocidade: tipoTreino.velocidade,
            resistencia: tipoTreino.resistencia,
            caminhada: tipoTreino.caminhada,
        });
    };

    // Correção: nomes dos campos corretos no handleEditingChange
    const handleEditingChange = (field, value) => {
        setEditingData((prev) => ({
            ...prev,
            [field]: value,
        }));
    };

    const cancelEditing = () => {
        setEditingTipoTreinoId(null);
        setEditingData({
            velocidade: "",
            resistencia: "",
            caminhada: "",
        });
    };

    const saveEditedTipoTreino = async (idTipoTreino) => {
    try {
        const updatedData = {
            velocidade: editingData.velocidade,
            resistencia: editingData.resistencia,
            caminhada: editingData.caminhada,
        };
        const response = await api.put(`/tipoTreinos/${idTipoTreino}`, updatedData);
        setTiposTreinos(
            tipoTreinos.map((tipoTreino) => {
                if (tipoTreino.id === idTipoTreino) {
                    return {
                        ...tipoTreino, // Mantém as propriedades existentes
                        ...response.data, // Atualiza com os novos dados
                    };
                }
                return tipoTreino;
            })
            
        );
        cancelEditing();
        alert("Tipo de treino atualizado com sucesso!");
        window.location.reload();
    } catch (error) {
        console.error("Erro ao atualizar tipo de treino: ", error);
        alert("Erro ao atualizar tipo de treino. Tente novamente.");
    }
};

    const openModal = (id) => {
        setIsModalOpen(true);
        setTipoTreinoSelecionado(id);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setTipoTreinoSelecionado(null);
    };

    const deleteTipoTreino = async () => {
        try {
            await api.delete(`/tipoTreinos/${tipoTreinoSelecionado}`);
            setTiposTreinos(
                tipoTreinos.filter((tipoTreino) => tipoTreino.id !== tipoTreinoSelecionado)
            );
            closeModal();
            alert("Tipo de treino excluído com sucesso!");
        } catch (error) {
            console.error("Erro ao excluir tipo de treino: ", error);
            alert("Erro ao excluir tipo de treino. Tente novamente.");
        }
    }

    useEffect(() => {
        // Este useEffect será executado sempre que o estado `tiposTreinos` for atualizado
        console.log("Tipos de treinos atualizados:", tipoTreinos);
    }, [tipoTreinos]);

    return (
        <section className="section-tipo-treino" id="section3">
            <h1 className="titulo-tipos-treinos">Tipos de Treinos</h1>
            <div className="table-responsive">
                <table className="table table-bordered table-striped table-hover">
                    <thead className="table-dark">
                        <tr>
                            <th>Id</th>
                            <th>Velocidade</th>
                            <th>Resistencia</th>
                            <th>Caminhada</th>
                            <th>Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentTipoTreinos.map((tipoTreino) => (
                            <tr key={tipoTreino.id}>
                                <td>{tipoTreino.id}</td>
                                <td>
                                    {editingTipoTreinoId === tipoTreino.id ? (
                                        <input
                                            type="number"
                                            value={editingData.velocidade}
                                            onChange={(e) => handleEditingChange("velocidade", e.target.value)}
                                        />
                                    ) : (
                                        tipoTreino.velocidade
                                    )}
                                </td>
                                <td>
                                    {editingTipoTreinoId === tipoTreino.id ? (
                                        <input
                                            type="text"
                                            value={editingData.resistencia}
                                            onChange={(e) => handleEditingChange("resistencia", e.target.value)}
                                        />
                                    ) : (
                                        tipoTreino.resistencia
                                    )}
                                </td>
                                <td>
                                    {editingTipoTreinoId === tipoTreino.id ? (
                                        <input
                                            type="text"
                                            value={editingData.caminhada}
                                            onChange={(e) => handleEditingChange("caminhada", e.target.value)}
                                        />
                                    ) : (
                                        tipoTreino.caminhada
                                    )}
                                </td>
                                <td className="text-center">
                                    {editingTipoTreinoId === tipoTreino.id ? (
                                        <>
                                            <button
                                                className="btn btn-sm btn-success me-2"
                                                onClick={() => saveEditedTipoTreino(tipoTreino.id)}
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
                                                onClick={() => startEditing(tipoTreino)}
                                            >
                                                <FaPencilAlt />
                                            </button>
                                            <button
                                                className="btn btn-sm btn-danger"
                                                title="Excluir"
                                                onClick={() => openModal(tipoTreino.id)}
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
                    onConfirm={deleteTipoTreino}
                    menssage="Tem certeza que deseja excluir este tipo de treino?"
                />
            )}

            <div className="text-end mt-3">
                <a href="/funcionario/tipotreino/novotipotreino" className="btn btn-success">
                    <FaPlus /> Novo Tipo de Treino
                </a>
            </div>
        </section>
    )
}

export default TipoTreinoTabela;