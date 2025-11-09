import { useEffect, useMemo, useState } from 'react'
import toast from 'react-hot-toast'
import { api } from '../services/api'
import { useAuth } from '../context/AuthContext'
import ItemForm from '../components/ItemForm'
import ItemList from '../components/ItemList'
import Loader from '../components/Loader'

export default function Dashboard() {
  const { token } = useAuth()
  const [todos, setTodos] = useState([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [editing, setEditing] = useState(null)
  // Filtros
  const [filterTitle, setFilterTitle] = useState('')
  const [filterCompleted, setFilterCompleted] = useState('') // '', 'true', 'false'
  const [filterPriority, setFilterPriority] = useState('') // '', 'low','medium','high'
  const [filterDueFrom, setFilterDueFrom] = useState('')
  const [filterDueTo, setFilterDueTo] = useState('')
  const [debounceTimer, setDebounceTimer] = useState(null)

  const authHeader = useMemo(() => ({ token }), [token])

  const buildQueryParams = () => {
    const params = new URLSearchParams()
    if (filterTitle.trim()) params.append('title', filterTitle.trim())
    if (filterCompleted) params.append('completed', filterCompleted)
    if (filterPriority) params.append('priority', filterPriority)
    if (filterDueFrom) params.append('dueFrom', new Date(filterDueFrom).toISOString())
    if (filterDueTo) params.append('dueTo', new Date(filterDueTo).toISOString())
    const qs = params.toString()
    return qs ? `?${qs}` : ''
  }

  const loadTodos = async () => {
    try {
      setLoading(true)
      const query = buildQueryParams()
      const res = await api.get(`/todos${query}`, authHeader)
      const list = res?.data || res
      setTodos(Array.isArray(list) ? list : list?.todos || [])
    } catch (err) {
      toast.error(err.message || 'Erro ao buscar tarefas')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { loadTodos() }, [])

  // Recarregar quando filtros mudarem (com pequeno debounce para não spammar API)
  useEffect(() => {
    if (debounceTimer) clearTimeout(debounceTimer)
    const t = setTimeout(() => {
      loadTodos()
    }, 400)
    setDebounceTimer(t)
    return () => clearTimeout(t)
  }, [filterTitle, filterCompleted, filterPriority, filterDueFrom, filterDueTo])

  const handleCreate = async (payload) => {
    setSubmitting(true)
    try {
      const res = await api.post('/todos', payload, authHeader)
      const created = res?.data || res
      toast.success('Tarefa criada!')
      setTodos(prev => [created, ...prev])
    } catch (err) {
      toast.error(err.message || 'Erro ao criar tarefa')
    } finally { setSubmitting(false) }
  }

  const handleUpdate = async (payload) => {
    if (!editing) return
    setSubmitting(true)
    try {
      const id = editing._id || editing.id
      // PUT requer campos principais completos no backend
      const res = await api.put(`/todos/${id}`, { ...payload, completed: Boolean(editing.completed) }, authHeader)
      const updated = res?.data || res
      toast.success('Tarefa atualizada!')
      setTodos(prev => prev.map(t => ((t._id||t.id) === id ? updated : t)))
      setEditing(null)
    } catch (err) {
      toast.error(err.message || 'Erro ao atualizar tarefa')
    } finally { setSubmitting(false) }
  }

  const handleDelete = async (todo) => {
    const id = todo._id || todo.id
    try {
      await api.delete(`/todos/${id}`, authHeader)
      toast.success('Tarefa excluída!')
      setTodos(prev => prev.filter(t => (t._id||t.id) !== id))
    } catch (err) {
      toast.error(err.message || 'Erro ao excluir tarefa')
    }
  }

  const toggleCompleted = async (todo) => {
    const id = todo._id || todo.id
    try {
      const res = await api.patch(`/todos/${id}`, { completed: !todo.completed }, authHeader)
      const updated = res?.data || res
      setTodos(prev => prev.map(t => ((t._id||t.id) === id ? updated : t)))
    } catch (err) {
      toast.error(err.message || 'Erro ao alternar conclusão')
    }
  }

  return (
    <div>
  <h2>Suas Tarefas</h2>
  <p className="muted">Lista de tarefas do usuário</p>

      {/* Filtros */}
      <div className="card" style={{ marginBottom:'1rem', display:'flex', flexDirection:'column', gap:'.75rem' }}>
        <h3 style={{ margin:'0 0 .25rem' }}>Filtros</h3>
        <div className="row" style={{ flexWrap:'wrap', gap:'.75rem' }}>
          <input
            placeholder="Buscar por título"
            value={filterTitle}
            onChange={(e) => setFilterTitle(e.target.value)}
            style={{ flex:'1 1 160px' }}
          />
          <select value={filterCompleted} onChange={(e) => setFilterCompleted(e.target.value)} style={{ flex:'1 1 140px' }}>
            <option value="">Status</option>
            <option value="false">Pendentes</option>
            <option value="true">Concluídas</option>
          </select>
          <select value={filterPriority} onChange={(e) => setFilterPriority(e.target.value)} style={{ flex:'1 1 140px' }}>
            <option value="">Prioridade</option>
            <option value="low">Baixa</option>
            <option value="medium">Média</option>
            <option value="high">Alta</option>
          </select>
          <input
            type="date"
            value={filterDueFrom}
            onChange={(e) => setFilterDueFrom(e.target.value)}
            style={{ flex:'1 1 150px' }}
          />
          <input
            type="date"
            value={filterDueTo}
            onChange={(e) => setFilterDueTo(e.target.value)}
            style={{ flex:'1 1 150px' }}
          />
          <button
            type="button"
            onClick={() => { setFilterTitle(''); setFilterCompleted(''); setFilterPriority(''); setFilterDueFrom(''); setFilterDueTo('') }}
            style={{ background:'#6b7280', borderColor:'#4b5563' }}
          >Limpar</button>
        </div>
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'1.25rem' }}>
        <div>
          {!editing ? (
            <ItemForm onSubmit={handleCreate} submitting={submitting} mode="create" />
          ) : (
            <div className="card">
              <ItemForm onSubmit={handleUpdate} initialValues={editing} submitting={submitting} mode="edit" />
              <button onClick={() => setEditing(null)} style={{ marginTop: '.5rem', background:'#6b7280', borderColor:'#4b5563' }}>Cancelar edição</button>
            </div>
          )}
        </div>
        <div>
          {loading ? (
            <Loader label="Carregando tarefas..." />
          ) : (
            <ItemList
              items={todos}
              onEdit={(todo) => setEditing(todo)}
              onDelete={handleDelete}
              onToggleCompleted={toggleCompleted}
            />
          )}
        </div>
      </div>
    </div>
  )
}
