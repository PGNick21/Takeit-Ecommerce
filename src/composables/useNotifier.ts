import { inject } from 'vue'

export function useNotifier() {
  const notify = inject('notifier') as (text: string, type?: 'success' | 'error' | 'info') => void
  if (!notify) throw new Error('Notifier not provided')

  return { notify }
}
