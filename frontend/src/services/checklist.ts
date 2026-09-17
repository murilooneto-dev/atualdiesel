import type { ChecklistItemType, EntryChecklist } from '../types'
import { createCrudService } from './crud'
import { api } from './api'
import { supabase } from '../lib/supabase'

export const checklistItemTypesService = createCrudService<ChecklistItemType>('checklist-item-types')

export const checklistsService = {
  ...createCrudService<EntryChecklist>('checklists'),
  openPdf: async (id: string) => {
    const { data } = await api.get(`/checklists/${id}/pdf`, { responseType: 'blob' })
    const url = URL.createObjectURL(data)
    window.open(url, '_blank')
  },
  uploadPhoto: async (checklistId: string, file: File) => {
    const path = `checklists/${checklistId}/${Date.now()}-${file.name}`
    const { error } = await supabase.storage.from('checklist-photos').upload(path, file)
    if (error) throw error
    const { data: urlData } = supabase.storage.from('checklist-photos').getPublicUrl(path)
    const { data } = await api.post(`/checklists/${checklistId}/photos`, {
      urlStorage: urlData.publicUrl,
    })
    return data
  },
}
