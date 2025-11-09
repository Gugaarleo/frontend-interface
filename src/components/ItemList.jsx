export default function ItemList({ items, onEdit, onDelete, onToggleCompleted }) {
  if (!items.length) return <p className="muted">Nenhuma tarefa cadastrada.</p>
  return (
    <div className="items-grid">
      {items.map(todo => {
        const id = todo._id || todo.id
        const due = todo.dueDate ? new Date(todo.dueDate) : null
        const overdue = due && !todo.completed && due.getTime() < Date.now()
        return (
          <div key={id} className="card" style={{ borderColor: overdue ? '#dc2626' : undefined }}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', gap:'.5rem' }}>
              <strong style={{ textDecoration: todo.completed ? 'line-through' : 'none' }}>{todo.title}</strong>
              <span style={{ fontSize:'.7rem', padding:'2px 6px', borderRadius:'4px', background: priorityColor(todo.priority), color:'#fff' }}>{todo.priority || 'medium'}</span>
            </div>
            {todo.description && <p style={{ margin: 0, fontSize:'.85rem', whiteSpace:'pre-line' }}>{todo.description}</p>}
            {due && (
              <small className="muted" style={{ color: overdue ? '#dc2626' : undefined }}>
                Vencimento: {due.toLocaleString()}
              </small>
            )}
            <div className="row" style={{ marginTop: 'auto', flexWrap:'wrap', gap:'.5rem' }}>
              <button onClick={() => onToggleCompleted(todo)} style={{ background: todo.completed ? '#16a34a' : '#2563eb', borderColor: todo.completed ? '#15803d' : '#1d4ed8' }}>
                {todo.completed ? 'Concluída' : 'Concluir'}
              </button>
              <button onClick={() => onEdit(todo)} style={{ background:'#9333ea', borderColor:'#7e22ce' }}>Editar</button>
              <button onClick={() => onDelete(todo)} style={{ background:'#dc2626', borderColor:'#b91c1c' }}>Excluir</button>
            </div>
          </div>
        )
      })}
    </div>
  )
}

function priorityColor(p) {
  switch (p) {
    case 'low': return '#64748b'
    case 'medium': return '#2563eb'
    case 'high': return '#dc2626'
    default: return '#2563eb'
  }
}
