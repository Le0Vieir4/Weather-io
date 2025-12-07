import { useNavigate } from "react-router-dom"
import { Menu } from "./navMenu"

function Header() {
  const navigate = useNavigate()
  return (
    <nav className='w-full h-20 border-b-2 border-black shadow shadow-zinc-500'>
      <div className='flex justify-between items-center w-full h-full px-10'>
        <span onClick={() => navigate("/dashboard")} className="text-2xl font-bold uppercase">Weather.io</span>
        <div className="flex items-center justify-center space-x-10 text-2xl">
          <Menu />
        </div>
      </div>
    </nav>
  )
}

export default Header
