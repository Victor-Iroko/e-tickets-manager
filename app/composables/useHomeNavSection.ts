export const HOME_NAV_SECTION_IDS = [
  'features',
  'how-it-works',
  'roles'
] as const

export type HomeNavSectionId = (typeof HOME_NAV_SECTION_IDS)[number]

export function useActiveHomeSection() {
  return useState<HomeNavSectionId | null>('active-home-section', () => null)
}
