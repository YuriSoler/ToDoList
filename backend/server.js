require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log("✅ Conexão estabelecida com o MongoDB!"))
  .catch((err) => console.error("❌ Falha ao conectar ao MongoDB:", err));

// --- SCHEMA ATUALIZADO COM TODOS OS CAMPOS DO SCRIPT SQL ---
const TaskSchema = new mongoose.Schema({
  titulo: { type: String, required: true },
  descricao: { type: String, required: false }, 
  status: {
    type: String,
    enum: ['pendente', 'em andamento', 'concluida'],
    required: true,
    default: 'pendente'
  },
  prioridade: {
    type: String,
    enum: ['baixa', 'media', 'alta'],
    required: true,
    default: 'media'
  },
  data_entrega: {
    type: Date,
    required: true
  }
}, { 
  // Esta opção já cria o campo 'data_criacao' (como createdAt) automaticamente
  timestamps: true 
});

const Task = mongoose.model("Task", TaskSchema);

// --- ROTAS DA API ---

// GET: Busca todas as tarefas, ordenadas pela data de entrega
app.get("/tasks", async (req, res) => {
  try {
    const tasks = await Task.find().sort({ data_entrega: 1 }); // Ordena pela data mais próxima
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET: Busca uma única tarefa pelo ID
app.get("/tasks/:id", async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: "Tarefa não encontrada" });
    res.json(task);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST: Cria uma nova tarefa
app.post("/tasks", async (req, res) => {
  try {
    const newTask = new Task(req.body);
    await newTask.save();
    res.status(201).json(newTask);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// PUT: Atualiza uma tarefa existente (usado para mudar o status, etc.)
app.put("/tasks/:id", async (req, res) => {
  try {
    const updatedTask = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedTask);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// DELETE: Apaga uma tarefa
app.delete("/tasks/:id", async (req, res) => {
  try {
    await Task.findByIdAndDelete(req.params.id);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta http://localhost:${PORT}`);
});
