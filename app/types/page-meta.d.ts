declare module '#app' {
  interface PageMeta {
    auth?: boolean
    requiredRole?: 'planner' | 'scanner'
  }
}

export {}
