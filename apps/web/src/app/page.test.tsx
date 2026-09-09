import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import Home from './page'
jest.mock('@/components/ui/signal-sculpture', () => () => null)
jest.mock('next/dynamic', () => () => () => null)
jest.mock('next/image', () => ({ __esModule: true, default: () => null }))

test('home exposes the primary work and contact journeys', () => {
  render(<Home />)
  expect(screen.getAllByRole('heading', { level: 1 })).toHaveLength(1)
  expect(screen.getByRole('link', { name: /Explore my work/ })).toHaveAttribute('href', '#projects')
  expect(screen.getByRole('link', { name: /Let’s talk/ })).toHaveAttribute('href', '#contact')
  for (const id of ['projects', 'about', 'skills', 'experience', 'contact']) expect(document.getElementById(id)).not.toBeNull()
})

test('projects retain real destinations and safely open external links', () => {
  render(<Home />)
  const links = screen.getAllByRole('link', { name: /Automate Carwash/ })
  for (const link of links) {
    expect(link).toHaveAttribute('href', 'https://auto-carwash-code.vercel.app')
    expect(link).toHaveAttribute('rel', 'noopener noreferrer')
  }
})
