import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { App } from '@app/App'
import { SECTIONS } from '@app/navigation'
import { FakeProfileRepository, fakeProfile } from './fixtures/fakeProfile'

const renderApp = () => render(<App repository={new FakeProfileRepository()} />)

describe('the portfolio page', () => {
  it('renders the profile it is given, not a hard-coded one', () => {
    renderApp()
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('TestPerson')
    expect(screen.getByText(/A supporting sentence/)).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Project One' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Example Org' })).toBeInTheDocument()
  })

  it('links every project to its repository in a new tab', () => {
    renderApp()
    const link = screen.getByRole('link', { name: /Project One/ })
    expect(link).toHaveAttribute('href', fakeProfile.projects[0]?.repositoryUrl)
    expect(link).toHaveAttribute('rel', expect.stringContaining('noopener'))
  })

  it('offers the CV as a download', () => {
    renderApp()
    const [cvLink] = screen.getAllByRole('link', { name: /CV/i })
    expect(cvLink).toHaveAttribute('href', fakeProfile.cvUrl)
  })

  it('gives every navigation item a section to land on', () => {
    const { container } = renderApp()
    for (const section of SECTIONS) {
      expect(
        screen.getByRole('link', { name: section.label }),
        `nav link for ${section.id}`,
      ).toHaveAttribute('href', `#${section.id}`)
      expect(container.querySelector(`#${section.id}`), `section ${section.id}`).not.toBeNull()
    }
  })

  it('links a published note but never a draft one', () => {
    renderApp()
    expect(screen.getByRole('link', { name: /A published note/ })).toHaveAttribute(
      'href',
      'https://example.com/note',
    )
    expect(screen.queryByRole('link', { name: /An unpublished note/ })).toBeNull()
    expect(screen.getByText('An unpublished note')).toBeInTheDocument()
  })

  it('lets a keyboard user take a replica offline and restore it', async () => {
    const user = userEvent.setup()
    renderApp()

    const node = screen.getByRole('button', { name: 'n2' })
    expect(node).toHaveAttribute('aria-pressed', 'false')

    await user.click(node)
    expect(node).toHaveAttribute('aria-pressed', 'true')
    expect(screen.getByText(/n2 down — balancer rerouted, 2\/3 serving/)).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: /Restore all/i }))
    expect(screen.getByRole('button', { name: 'n2' })).toHaveAttribute('aria-pressed', 'false')
  })

  it('scores a penalty and announces the result', async () => {
    const user = userEvent.setup()
    renderApp()

    const goal = screen.getByRole('group', { name: /Goal/ })
    await user.click(within(goal).getByRole('button', { name: /Shoot top left/ }))

    expect(await screen.findByText(/saved|goal —/)).toBeInTheDocument()
  })

  it('exposes one labelled landmark per section', () => {
    renderApp()
    expect(screen.getByRole('navigation', { name: 'Primary' })).toBeInTheDocument()
    expect(screen.getByRole('main')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /Skip to content/i })).toHaveAttribute('href', '#top')
  })
})
