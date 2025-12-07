import { useAuthApi } from "@/hooks/useAuthApi"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import useToast from "@/hooks/useToast"
import type { User } from "@/types/schemas/user-schema"
import { Trash } from "lucide-react"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { ExportWeatherData } from './ExportWeatherData';

export function Menu() {
  const { update, deleteUser, logout, getUser } = useAuthApi()
  const navigate = useNavigate()
  const [openDialog, setOpenDialog] = useState(false)
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [userData, setUserData] = useState<User | null>(null)
  const [avatarFile, setAvatarFile] = useState<File | null>(null)
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null)
  const { toasts } = useToast()


  // Busca os dados do usuário ao montar o componente
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const data = await getUser();
        setUserData(data);
      } catch (err) {
        console.error('Erro ao carregar dados do usuário:', err);
      }
    };

    fetchUserData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Executa apenas uma vez ao montar

  // Atualiza o preview quando um arquivo é selecionado
  useEffect(() => {
    if (!avatarFile) {
      setAvatarPreview(null)
      return
    }

    const objectUrl = URL.createObjectURL(avatarFile)
    setAvatarPreview(objectUrl)

    // Cleanup: libera memória quando o componente desmonta ou arquivo muda
    return () => URL.revokeObjectURL(objectUrl)
  }, [avatarFile])

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]

      // Validação de tipo de arquivo
      if (!file.type.startsWith('image/')) {
        toasts.invalidFileType()
        return
      }

      // Validação de tamanho (máx 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toasts.imageSizeError()
        return
      }
      setAvatarFile(file)
    }
  }



  const handleUpdateProfile = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setIsLoading(true);

    try {
      const formData = new FormData(e.currentTarget);

      // Extrai e limpa os dados do formulário
      const firstName = formData.get("firstName");
      const lastName = formData.get("lastName");
      const username = formData.get("username");
      const email = formData.get("email");

      // Verifica se email ou username foram alterados
      const emailChanged = email && email !== "" && email !== userData?.email;
      const usernameChanged = username && username !== "" && username !== userData?.username;
      const needsRelogin = emailChanged || usernameChanged;

      const updateData: {
        firstName?: string;
        lastName?: string;
        picture?: string;
        username?: string;
        email?: string;
      } = {
        ...(firstName && firstName !== "" ? { firstName: String(firstName) } : {}),
        ...(lastName && lastName !== "" ? { lastName: String(lastName) } : {}),
        ...(username && username !== "" ? { username: String(username) } : {}),
        ...(email && email !== "" ? { email: String(email) } : {}),
      };

      // Se houver arquivo de avatar, converte para base64
      if (avatarFile) {
        const reader = new FileReader();
        const base64Promise = new Promise<string>((resolve, reject) => {
          reader.onloadend = () => {
            if (typeof reader.result === 'string') {
              resolve(reader.result);
            } else {
              reject(new Error('Erro ao ler arquivo'));
            }
          };
          reader.onerror = reject;
          reader.readAsDataURL(avatarFile);
        });

        const base64String = await base64Promise;
        updateData.picture = base64String;
      }

      await update(updateData);

      setOpenDialog(false);
      setAvatarFile(null);

      // Se email ou username foram alterados, faz logout
      if (needsRelogin) {
        toasts.credentialsChanged();

        // Aguarda um momento para o usuário ler a mensagem
        setTimeout(() => {
          logout();
        }, 2500);
      } else {
        // Se apenas nome ou foto foram alterados, recarrega os dados
        const updatedData = await getUser();
        setUserData(updatedData);
        toasts.profileUpdateSuccess();
      }
    } catch (err) {
      console.error(err);
      const errorMessage = err instanceof Error ? err.message : undefined;
      toasts.profileUpdateError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
  };

  const handleDeleteAccount = async () => {
    setIsLoading(true);
    try {
      await deleteUser();
      toasts.accountDeleted();
    } catch (err) {
      console.error(err);
      const errorMessage = err instanceof Error ? err.message : undefined;
      toasts.error("Erro ao deletar conta", errorMessage);
    } finally {
      setIsLoading(false);
      setOpenDeleteDialog(false);
    }
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Avatar className="w-14 h-14 border-2 border-gray-800 shadow-sm shadow-gray-600 cursor-pointer select-none">
            <AvatarImage
              draggable="false"
              src={userData?.picture || ""}
              alt="Avatar"
            />
            <AvatarFallback className="relative -top-1">
              {userData?.firstName && userData?.lastName && (
                <>
                  {userData?.firstName?.[0] || ''}
                  {userData?.lastName?.[0] || ''}
                </>
              )}
              <>{userData?.username?.[0] || ''}{userData?.username?.[userData.username.length - 1] || ''}</>
            </AvatarFallback>
          </Avatar>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56 mt-2 mr-4 [&>*:not(:first-child)]:cursor-pointer" align="start">
          <DropdownMenuLabel className="cursor-default">
            {userData ? `${userData.firstName || ''} ${userData.lastName || ''}`.trim() || userData.username || 'Minha Conta' : 'Carregando...'}
          </DropdownMenuLabel>
          <DropdownMenuGroup className="*:cursor-pointer">
            <DropdownMenuItem
              onSelect={
                userData?.isOAuth ? () => toasts.oauthEditWarning(userData?.provider || 'OAuth') : (e) => {
                  e.preventDefault();
                  setOpenDialog(true);
                }
              }
            >
              Profile
            </DropdownMenuItem>
            <DropdownMenuItem>
              <a target="_blank" href="http://localhost:3000/api/weather/logs" className="w-full h-full">Logs</a>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <a href="/dashboard/stats" className='w-full h-full'>Estatisticas Avancadas</a>
            </DropdownMenuItem>
              <DropdownMenuSub>
                <DropdownMenuSubTrigger >Exportar Dados</DropdownMenuSubTrigger>
                <DropdownMenuPortal>
                  <DropdownMenuSubContent>
                    <DropdownMenuItem><ExportWeatherData /></DropdownMenuItem>
                  </DropdownMenuSubContent>
                </DropdownMenuPortal>
              </DropdownMenuSub>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuItem ><a href="https://github.com/Le0Vieir4/Weather-io" className="w-full h-full" target="_blank">Github</a></DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onSelect={handleLogout}>
            Log out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {userData?.isOAuth && (
        <Dialog open={openDialog} onOpenChange={setOpenDialog}>
          <DialogContent>
            <div className="bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg p-3 mb-4">
              <p className="text-sm text-blue-800 dark:text-blue-200">
                ℹ️ Você está usando login via {userData.provider}. Alguns campos podem não estar disponíveis para edição.
              </p>
            </div>
          </DialogContent>
        </Dialog>
      )}
      {/* Dialog de Edição de Perfil */}
      {!userData?.isOAuth && (
        <>
          <Dialog open={openDialog} onOpenChange={setOpenDialog}>
            <DialogContent className="sm:max-w-[425px]">
              <form onSubmit={handleUpdateProfile}>
                <DialogHeader>
                  <DialogTitle>Editar perfil</DialogTitle>
                  <DialogDescription className="mb-2">
                    Atualize suas informações de perfil.
                  </DialogDescription>
                  <div className="bg-amber-50 dark:bg-amber-950 border border-amber-200 dark:border-amber-800 rounded-lg p-3 mb-4">
                    <p className="text-xs text-amber-800 dark:text-amber-200">
                      ⚠️ <strong>Atenção:</strong> Alterar email ou username exigirá que você faça login novamente com as novas credenciais.
                    </p>
                  </div>
                </DialogHeader>
                <div className="grid gap-4">
                  <div className="grid gap-3">
                    <Label htmlFor="picture-1">Foto de Perfil</Label>
                    <div className="flex items-center gap-4">
                      <Avatar className="w-20 h-20">
                        <AvatarImage
                          src={avatarPreview || userData?.picture || ''}
                          alt="Preview do avatar"
                        />
                        <AvatarFallback>
                          {userData?.firstName?.[0]}{userData?.lastName?.[0]}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <Input
                          type="file"
                          id="picture-1"
                          name="picture"
                          accept="image/*"
                          onChange={handleAvatarChange}
                          className="cursor-pointer"
                        />
                        <p className="text-xs text-muted-foreground mt-1">
                          PNG, JPG ou GIF (máx. 5MB)
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="grid gap-4">
                  <div className="grid gap-3">
                    <Label htmlFor="username-1">Usuário</Label>
                    <Input
                      id="username-1"
                      name="username"
                      placeholder="ex.: pedrosilva"
                      defaultValue={userData?.username || ''}
                    />
                  </div>
                  <div className="grid gap-3">
                    <Label htmlFor="firstName-1">Primeiro Nome</Label>
                    <Input
                      id="firstName-1"
                      name="firstName"
                      placeholder="ex.: Pedro"
                      defaultValue={userData?.firstName || ''}
                    />
                  </div>
                  <div className="grid gap-3">
                    <Label htmlFor="lastName-1">Último Nome</Label>
                    <Input
                      id="lastName-1"
                      name="lastName"
                      placeholder="ex.: Silva"
                      defaultValue={userData?.lastName || ''}
                    />
                  </div>
                  <div className="grid gap-3">
                    <Label htmlFor="email-1">Email</Label>
                    <Input
                      id="email-1"
                      name="email"
                      type="email"
                      placeholder="ex.: pedro@email.com"
                      defaultValue={userData?.email || ''}
                    />
                  </div>
                  <div className="flex justify-end">
                    {!userData?.isOAuth && (
                      <button
                        type="button"
                        onClick={() => navigate("/change-password")}
                        className="hover:underline cursor-pointer text-md text-muted-foreground"
                      >
                        trocar senha?
                      </button>
                    )}
                  </div>
                </div>
                <DialogFooter>
                  <div className="flex justify-between w-full mt-6">
                    {!userData?.isOAuth && (
                      <Button variant="destructive" onClick={handleDeleteAccount} className=""><Trash />Deletar a conta</Button>
                    )}
                    <div className="space-x-2 ml-auto">
                      <DialogClose asChild>
                        <Button disabled={isLoading} variant="outline">{!isLoading ? "Cancelar" : "Cancelando..."}</Button>
                      </DialogClose>
                      <Button disabled={isLoading} type="submit">{!isLoading ? "Salvar" : "Salvando..."}</Button>
                    </div>
                  </div>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>

          <Dialog open={openDeleteDialog} onOpenChange={setOpenDeleteDialog}>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Deletar conta</DialogTitle>
                <DialogDescription>
                  Tem certeza que deseja deletar sua conta? Esta ação não pode ser desfeita.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <DialogClose asChild>
                  <Button disabled={isLoading} variant="outline">Cancelar</Button>
                </DialogClose>
                <Button
                  disabled={isLoading}
                  variant="destructive"
                  onClick={handleDeleteAccount}
                >
                  {!isLoading ? "Deletar" : "Deletando..."}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </>
      )}
    </>
  )
}
