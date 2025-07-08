// Adiciona item
const express = require('express');
const fs = require('fs');

let tarefas = [];
let idAtual = 1;

// GET - Listar todas
exports.getToDoList = async (req, res) => {
  res.json(tarefas);
};

// POST - Adicionar tarefa
exports.postToDoList = async (req, res) => {
  const { titulo, descricao } = req.body;

  if (!titulo || titulo.trim() === '') {
    return res.status(400).json({ error: 'Título é obrigatório' });
  }

  const novaTarefa = {
    id: idAtual++,
    titulo: titulo.trim(),
    descricao: descricao?.trim() || '',
    concluida: false
  };

  tarefas.push(novaTarefa);
  res.status(201).json(novaTarefa);
};

// PUT - Editar tarefa por ID
exports.putToDoList = async (req, res) => {
  const { id } = req.params;
  const { titulo, descricao, concluida } = req.body;

  const tarefa = tarefas.find(t => t.id === parseInt(id));
  if (!tarefa) return res.status(404).json({ error: 'Tarefa não encontrada' });

  if (titulo !== undefined) tarefa.titulo = titulo.trim();
  if (descricao !== undefined) tarefa.descricao = descricao.trim();
  if (concluida !== undefined) tarefa.concluida = concluida;

  res.json(tarefa);
  this.salvarCSV();
};

// DELETE - Apagar todas
exports.deleteToDoList = async (req, res) => {
  tarefas = [];
  idAtual = 1;
  res.json({ message: 'Todas as tarefas foram apagadas' });
};

// DELETE - Apagar tarefa por ID
exports.deleteToDoListById = async (req, res) => {
  const id = parseInt(req.params.id);
  const index = tarefas.findIndex(t => t.id === id);

  if (index === -1) {
    return res.status(404).json({ error: 'Tarefa não encontrada' });
  }

  const tarefaRemovida = tarefas.splice(index, 1)[0];
  res.json({ message: 'Tarefa removida com sucesso', tarefa: tarefaRemovida });
};

// GET - Exportar para CSV
exports.exportgetToDoList = async (req, res) => {
  if (tarefas.length === 0) return res.status(400).send('Lista vazia');

  const header = 'id,titulo,descricao,concluida';
  const rows = tarefas.map(t =>
    `${t.id},"${t.titulo.replace(/"/g, '""')}","${t.descricao.replace(/"/g, '""')}",${t.concluida}`
  );

  const csv = [header, ...rows].join('\n');

  fs.writeFileSync('tarefas.csv', csv);

  res.setHeader('Content-Disposition', 'attachment; filename="tarefas.csv"');
  res.setHeader('Content-Type', 'text/csv');
  res.send(csv);
};

exports.salvarCSV = () => {
  const header = 'id,titulo,descricao,concluida';
  const rows = tarefas.map(t =>
    `${t.id},"${t.titulo.replace(/"/g, '""')}","${t.descricao.replace(/"/g, '""')}",${t.concluida}`
  );
  const csv = [header, ...rows].join('\n');
  fs.writeFileSync('tarefas.csv', csv);
}
