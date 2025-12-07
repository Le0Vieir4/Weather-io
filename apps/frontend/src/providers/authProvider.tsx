import { AuthContext } from "@/hooks/useAuth"
import { jwtDecode } from "jwt-decode";
import { useState } from "react"
import { useNavigate } from "react-router-dom"

interface TokenPayload {
  sub: string;
  email: string;
  exp?: number;
  // Campos OAuth
  isOAuth?: boolean;
  provider?: string;
  username?: string;
  picture?: string;
  firstName?: string;
  lastName?: string;
}

// Função auxiliar para verificar se o token expirou
function isTokenExpired(token: string): boolean {
  try {
    const decoded = jwtDecode<TokenPayload>(token)
    if (!decoded.exp) return false
    
    // Verifica se o token expirou (exp está em segundos, Date.now() em milissegundos)
    const isExpired = decoded.exp * 1000 < Date.now()
    if (isExpired) {
      console.warn("Token expirado!")
    }
    return isExpired
  } catch {
    return true
  }
}

export function AuthProvider({children}: {children: React.ReactNode}) { 
  const [ token, setToken ] =  useState<string | null>(() => {
    const storedToken = localStorage.getItem("token")
    
    if (!storedToken) {
      return null
    }
    
    if (isTokenExpired(storedToken)) {
      console.warn("⚠️ Token expirado, removendo do localStorage");
      localStorage.removeItem("token")
      return null
    }
    
    return storedToken
  })

   const [userId, setUserId] = useState<string | null>(() => {
    const raw = localStorage.getItem("token")
    if (!raw) return null

    if (isTokenExpired(raw)) {
      localStorage.removeItem("token")
      return null
    }

    try {
      const decoded = jwtDecode<TokenPayload>(raw)
      return decoded.sub
    } catch (error) {
      console.error("❌ Erro ao decodificar token:", error)
      return null
    }
  })
  
  const navigate = useNavigate()
  
  function login(newToken: string){
    try {
      if (isTokenExpired(newToken)) {
        throw new Error("Token expirado")
      }
      
      const decoded = jwtDecode<TokenPayload>(newToken)
      localStorage.setItem("token", newToken)
      setToken(newToken)
      setUserId(decoded.sub)
      navigate("/dashboard")
    } catch (error) {
      console.error("❌ Erro no login:", error)
      if (error instanceof Error) {
        throw error
      }
      throw new Error("Token inválido")
    }
  }
  
  function logout(){
    localStorage.removeItem("token")
    setToken(null)
    setUserId(null)
    navigate("/")
  }

  return (
    <AuthContext.Provider value={{token, userId, login, logout}}>
      {children}
    </AuthContext.Provider>
  )
}

