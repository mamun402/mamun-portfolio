import { initialContent, initialCv, initialDesigns, initialProfile, initialProjects, initialSections } from './content.js'
import { supabase } from './supabase.js'

export const emptyPortfolio = () => ({ projects: structuredClone(initialProjects), designs: structuredClone(initialDesigns), profile: structuredClone(initialProfile), cv: structuredClone(initialCv), sections: structuredClone(initialSections), content: structuredClone(initialContent) })
export const mergePortfolio = (value = {}) => ({ ...emptyPortfolio(), ...value, profile: { ...initialProfile, ...value.profile }, cv: { ...initialCv, ...value.cv }, content: { ...initialContent, ...value.content } })

export async function loadPortfolio() {
  if (!supabase) return null
  const { data, error } = await supabase.from('portfolio_content').select('data').eq('id', 'main').maybeSingle()
  if (error) throw error
  return data ? mergePortfolio(data.data) : null
}

export async function savePortfolio(portfolio) {
  if (!supabase) throw new Error('Supabase is not configured.')
  const { error } = await supabase.from('portfolio_content').upsert({ id: 'main', data: portfolio, updated_at: new Date().toISOString() })
  if (error) throw error
}

export async function uploadPortfolioAsset(file, folder) {
  if (!supabase) throw new Error('Supabase is not configured.')
  const extension = file.name.split('.').pop()?.toLowerCase() || 'file'
  const path = `${folder}/${crypto.randomUUID()}.${extension}`
  const { error } = await supabase.storage.from('portfolio-assets').upload(path, file, { cacheControl: '31536000', upsert: false })
  if (error) throw error
  return supabase.storage.from('portfolio-assets').getPublicUrl(path).data.publicUrl
}
