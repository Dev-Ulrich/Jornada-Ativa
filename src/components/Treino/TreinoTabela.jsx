import React, { useState, useEffect } from "react";
import { FaPencilAlt, FaTrashAlt, FaPlus } from "react-icons/fa";
import './TreinoTabela.css';
import Modal from "../../Modal/Modal.jsx";
import api from "../../services/api";

const TreinoTabela = ({ treinos, setTreinos }) => {

    const [currentPage, setCurrentPage] = useState(1);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [treinoSelecionado, setTreinoSelecionado] = useState(null);
    const [editingTreinoId, setEditingTreinoId] = useState(null);
    const [editingData, setEditingData] = useState({
        data: "",
        distancia: "",
        tempo: "",
    });

    const usersPerPage = 10;

    const indexOfLastTreino = currentPage * usersPerPage;
    const indexOfFirstTreino = indexOfLastTreino - usersPerPage;
    const currentTreinos = treinos.slice(indexOfFirstTreino, indexOfLastTreino);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    const pageNumbers = [];
    for (let i = 1; i <= Math.ceil(treinos.length / usersPerPage); i++) {
        pageNumbers.push(i);
    };


    const startEditing = (treino) => {
        setEditingTreinoId(treino.id);
        setEditingData({
            data: treino.data,
            distancia: treino.distancia,
            tempo: treino.tempo,
        });
    };

    const cancelEditing = () => {
        setEditingTreinoId(null);
        setEditingData({
            data: "",
            distancia: "",
            tempo: "",
        });
    };

    const handleEditingChange = (field, value) => {
        setEditingData({ ...editingData, [field]: value });
    };

    const saveEditedTreino = async (id) => {
        try {
            const updatedData = {
                data: editingData.data,
                distancia: editingData.distancia,
                tempo: editingData.tempo,
            };
            const response = await api.put(`/treinos/${id}`, updatedData);
            setTreinos(
                treinos.map((treino) =>
                    treino.id === id ? response.data : treino
                )
            );

            cancelEditing();
            alert("Treino atualizado com sucesso!");
            window.location.reload();
        } catch (error) {
            console.error("Erro ao atualizar treino: ", error);
            alert("Erro ao atualizar treino. Tente novamente.");
        }
    };

    const openModal = (id) => {
        setIsModalOpen(true);
        setTreinoSelecionado(id);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setTreinoSelecionado(null);
    };

    const deleteTreino = async () => {
        try {
            await api.delete(`/treinos/${treinoSelecionado}`);
            setTreinos(
                treinos.filter((treino) => treino.id !== treinoSelecionado)
            );
            closeModal();
            alert("Treino excluído com sucesso!");
        } catch (error) {
            console.error("Erro ao excluir treino: ", error);
            alert("Erro ao excluir treino. Tente novamente.");
        }
    }

    useEffect(() => {
        // Este useEffect será executado sempre que o estado `treinos` for atualizado
        console.log("Treinos atualizados:", treinos);
    }, [treinos]);

    return (
        <section className="section-treino" id="section2">
            <h1 className="titulo-treinos">Treinos</h1>
            <div className="table-responsive">
                <table className="table table-bordered table-striped table-hover">
                    <thead className="table-dark">
                        <tr>
                            <th>Id</th>
                            <th>Data</th>
                            <th>Distancia</th>
                            <th>Tempo</th>
                            <th>Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentTreinos.map((treino) => (
                            <tr key={treino.id}>
                                <td>{treino.id}</td>
                                <td>
                                    {editingTreinoId === treino.id ? (
                                        <input
                                            type="date"
                                            value={editingData.data}
                                            onChange={(e) => handleEditingChange("data", e.target.value)}
                                        />
                                    ) : (
                                        treino.data
                                    )}
                                </td>
                                <td>
                                    {editingTreinoId === treino.id ? (
                                        <input
                                            type="number"
                                            value={editingData.distancia}
                                            onChange={(e) => handleEditingChange("distancia", e.target.value)}
                                        />
                                    ) : (
                                        treino.distancia
                                    )}
                                </td>
                                <td>
                                    {editingTreinoId === treino.id ? (
                                        <input
                                            type="text"
                                            value={editingData.tempo}
                                            onChange={(e) => handleEditingChange("tempo", e.target.value)}
                                        />
                                    ) : (
                                        treino.tempo
                                    )}
                                </td>
                                <td className="text-center">
                                    {editingTreinoId === treino.id ? (
                                        <>
                                            <button
                                                className="btn btn-sm btn-success me-2"
                                                onClick={() => saveEditedTreino(treino.id)}
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
                                                onClick={() => startEditing(treino)}
                                            >
                                                <FaPencilAlt />
                                            </button>
                                            <button
                                                className="btn btn-sm btn-danger"
                                                title="Excluir"
                                                onClick={() => openModal(treino.id)}
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
                    onConfirm={deleteTreino}
                    menssage="Tem certeza que deseja excluir este treino?"
                />
            )}

            <div className="text-end mt-3">
                <a href="/funcionario/treino/novotreino" className="btn btn-success">
                    <FaPlus /> Novo Treino
                </a>
            </div>
        </section>
    )
}

export default TreinoTabela;