import { useState } from 'react'
import toast from 'react-hot-toast'

const priorities = [
  { value: 'low', label: 'Baixa' },
  { value: 'medium', label: 'Média' },
  { value: 'high', label: 'Alta' }
]

export default function ItemForm({ onSubmit, initialValues, submitting, mode = 'create' }) {
  const [title, setTitle] = useState(initialValues?.title || '')
  const [description, setDescription] = useState(initialValues?.description || '')
  const [priority, setPriority] = useState(initialValues?.priority || 'medium')
  const [dueDate, setDueDate] = useState(initialValues?.dueDate ? new Date(initialValues.dueDate).toISOString().slice(0,16) : '')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!title.trim()) {
      toast.error('Título é obrigatório')
      return
    }
    onSubmit({
      title: title.trim(),
      description: description.trim() || undefined,
      priority,
      dueDate: dueDate ? new Date(dueDate).toISOString() : null
    })
  }

  return (
    <form onSubmit={handleSubmit} style={{ marginTop: 0 }}>
      <h3 style={{ margin: 0 }}>{mode === 'edit' ? 'Editar Tarefa' : 'Nova Tarefa'}</h3>
      <input
        placeholder="Título"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        disabled={submitting}
        required
      />
      <textarea
        placeholder="Descrição (opcional)"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        rows={3}
        disabled={submitting}
      />
      <div className="row" style={{ gap: '.75rem' }}>
        <select value={priority} onChange={(e) => setPriority(e.target.value)} disabled={submitting} style={{ flex:1 }}>
          {priorities.map(p => <option key={p.value} value={p.value}>{p.label}</option>)}
        </select>
        <input
          type="datetime-local"
          value={dueDate}
            onChange={(e)=> setDueDate(e.target.value)}
          disabled={submitting}
          style={{ flex:1 }}
        />
      </div>
      <div className="row" style={{ justifyContent: 'flex-end' }}>
        <button type="submit" disabled={submitting}>{submitting ? 'Salvando...' : (mode==='edit' ? 'Atualizar' : 'Criar')}</button>
      </div>
    </form>
  )
}
