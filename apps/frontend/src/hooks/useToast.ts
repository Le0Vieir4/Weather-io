import { toast, type ExternalToast } from "sonner";

/**
 * Tipos de toast disponíveis
 */
export type ToastType = 'success' | 'error' | 'warning' | 'info';

/**
 * Variantes de estilo para os toasts
 */
export type ToastVariant = 'default' | 'success' | 'destructive' | 'custom';

/**
 * Opções para configurar um toast
 */
export interface ToastOptions {
  title: string;
  description?: string;
  type?: ToastType;
  variant?: ToastVariant;
  duration?: number;
  backgroundColor?: string;
  textColor?: string;
}

/**
 * Hook customizado para gerenciar toasts de forma modular
 */
export function useToast() {
  
  /**
   * Exibe um toast com configurações personalizadas
   */
  const showToast = (options: ToastOptions) => {
    const {
      title,
      description,
      type = 'info',
      variant = 'default',
      duration = 3000,
      backgroundColor,
      textColor = '#ffffff'
    } = options;

    // Configurações base do toast
    const baseConfig: ExternalToast = {
      description,
      duration,
      unstyled: false,
    };

    // Configurações de estilo customizado
    if (variant === 'custom' && backgroundColor) {
      baseConfig.style = {
        backgroundColor,
        color: textColor,
        border: 'none',
      };
      baseConfig.classNames = {
        description: '!text-white',
        title: '!text-white',
        toast: `!text-white`,
      };
    } else if (variant === 'destructive') {
      baseConfig.style = {
        backgroundColor: '#fb2c36',
        color: '#ffffff',
        border: 'none',
      };
      baseConfig.classNames = {
        description: '!text-white',
        title: '!text-white',
        toast: '!bg-[#fb2c36] !text-white',
      };
    } else if (variant === 'success') {
      baseConfig.style = {
        backgroundColor: '#00c951',
        color: '#ffffff',
        border: 'none',
      };
      baseConfig.classNames = {
        description: '!text-white',
        title: '!text-white',
        toast: '!bg-[#00c951] !text-white',
      };
    }

    // Exibe o toast de acordo com o tipo
    switch (type) {
      case 'success':
        return toast.success(title, baseConfig);
      case 'error':
        return toast.error(title, baseConfig);
      case 'warning':
        return toast.warning(title, baseConfig);
      case 'info':
      default:
        return toast.info(title, baseConfig);
    }
  };

  /**
   * Toasts pré-configurados para casos comuns
   */
  const toasts = {
    // Toast para usuários OAuth que não podem editar perfil
    oauthEditWarning: (provider: string) => {
      return showToast({
        title: "Não é possível editar o perfil",
        description: `Você logou usando ${provider}. Não é possível fazer alterações no perfil`,
        type: 'warning',
        variant: 'destructive',
        duration: 4000,
      });
    },

    // Toast para erro de tamanho de imagem
    imageSizeError: () => {
      return showToast({
        title: "Erro ao atualizar a imagem do perfil",
        description: "Imagem excede o limite de 5MB. Por favor, escolha uma imagem menor.",
        type: 'error',
        variant: 'destructive',
        duration: 3000,
      });
    },

    // Toast para sucesso ao atualizar perfil
    profileUpdateSuccess: () => {
      return showToast({
        title: "Perfil atualizado com sucesso!",
        description: "Suas informações foram salvas.",
        type: 'success',
        duration: 3000,
        variant: 'custom',
        backgroundColor: '#00c951',
      });
    },

    // Toast para erro ao atualizar perfil
    profileUpdateError: (message?: string) => {
      return showToast({
        title: "Erro ao atualizar perfil",
        description: message || "Ocorreu um erro ao salvar suas informações. Tente novamente.",
        type: 'error',
        variant: 'destructive',
        duration: 3000,
      });
    },

    // Toast para erro de tipo de arquivo
    invalidFileType: () => {
      return showToast({
        title: "Tipo de arquivo inválido",
        description: "Por favor, selecione apenas arquivos de imagem (JPG, PNG, etc.)",
        type: 'error',
        variant: 'destructive',
        duration: 3000,
      });
    },

    // Toast para conta deletada
    accountDeleted: () => {
      return showToast({
        title: "Conta excluída",
        description: "Sua conta foi excluída com sucesso.",
        type: 'info',
        duration: 2000,
      });
    },

    // Toast para credenciais alteradas (logout necessário)
    credentialsChanged: () => {
      return showToast({
        title: "Credenciais atualizadas!",
        description: "Você será desconectado. Faça login novamente com suas novas credenciais.",
        type: 'success',
        variant: 'custom',
        backgroundColor: '#00c951',
        duration: 4000,
      });
    },

    // Toast genérico de sucesso
    success: (title: string, description?: string) => {
      return showToast({
        title,
        description,
        type: 'success',
        duration: 2000,
        variant: 'success',
      });
    },

    // Toast genérico de erro
    error: (title: string, description?: string) => {
      return showToast({
        title,
        description,
        type: 'error',
        variant: 'destructive',
        duration: 3000,
      });
    },

    // Toast genérico de warning
    warning: (title: string, description?: string) => {
      return showToast({
        title,
        description,
        type: 'warning',
        variant: 'destructive',
        duration: 3000,
      });
    },

    // Toast genérico de info
    info: (title: string, description?: string) => {
      return showToast({
        title,
        description,
        type: 'info',
        duration: 2000,
      });
    },
  };

  return {
    showToast,
    toasts,
  };
}

export default useToast;
