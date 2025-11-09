import { useState } from 'react'
import { Link } from 'react-router-dom'
import toast from 'react-hot-toast'
import { useAuth } from '../context/AuthContext'

export default function Register() {
  const { register } = useAuth()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await register(name, email, password)
    } catch (err) {
      toast.error(err.message || 'Falha no cadastro')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="center">
      <form onSubmit={handleSubmit}>
        <h2 style={{ marginTop: 0 }}>Cadastro</h2>
        <input
          placeholder="Nome"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          disabled={loading}
        />
        <input
          type="email"
          placeholder="E-mail"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          disabled={loading}
        />
        <input
          type="password"
          placeholder="Senha"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          disabled={loading}
        />
        <button type="submit" disabled={loading}>{loading ? 'Registrando...' : 'Cadastrar'}</button>
        <p className="muted">Já tem conta? <Link to="/login">Entrar</Link></p>
      </form>
    </div>
  )
}
