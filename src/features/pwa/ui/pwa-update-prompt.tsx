import { useRegisterSW } from 'virtual:pwa-register/react'
import { toast } from 'sonner'
import { useEffect } from 'react'

export function PwaUpdatePrompt() {
  const {
    needRefresh: [needRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    onRegistered(r) {
      if (r) console.log('[PWA] Service Worker registered')
    },
    onRegisterError(error) {
      console.error('[PWA] SW registration error', error)
    },
  })

  useEffect(() => {
    if (needRefresh) {
      toast('Доступно обновление', {
        description: 'Нажмите, чтобы применить новую версию.',
        action: {
          label: 'Обновить',
          onClick: () => updateServiceWorker(true),
        },
        duration: Infinity,
      })
    }
  }, [needRefresh, updateServiceWorker])

  return null
}
