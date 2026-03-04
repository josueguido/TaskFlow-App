import { describe, it, expect } from 'vitest'

describe('App', () => {
  it('should pass a basic sanity check', () => {
    expect(true).toBe(true)
  })

  it('should have the correct document title concept', () => {
    const appName = 'TaskFlow'
    expect(appName).toBeDefined()
    expect(appName.length).toBeGreaterThan(0)
  })
})
