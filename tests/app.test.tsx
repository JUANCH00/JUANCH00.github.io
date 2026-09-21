import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { App } from '@app/App'
import { SECTIONS } from '@app/navigation'
import { FakeProfileRepository, fakeProfile } from './fixtures/fakeProfile'

const renderApp = () => render(<App repository={new FakeProfileRepository()} />)

describe('the portfolio page', () => {
  it('renders the profile it is given, not a hard-coded one', () => {
    renderApp()
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Test Person')
    expect(screen.getByText('A short lead sentence for the hero.')).toBeInTheDocument()
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

  it('lists the sections in the nav in the order they appear on the page', () => {
    const { container } = renderApp()
    const onPage = [...container.querySelectorAll('main section[id]')]
      .map((section) => section.id)
      .filter((id) => SECTIONS.some((section) => section.id === id))

    expect(onPage).toEqual(SECTIONS.map((section) => section.id))
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
    expect(screen.getByText('> n2 down: balancer rerouted, 2/3 serving')).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: /Restore all/i }))
    expect(screen.getByRole('button', { name: 'n2' })).toHaveAttribute('aria-pressed', 'false')
  })

  it('scores a penalty and announces the result', async () => {
    const user = userEvent.setup()
    renderApp()

    const goal = screen.getByRole('group', { name: /Goal/ })
    await user.click(within(goal).getByRole('button', { name: /Shoot top left/ }))

    expect(
      await screen.findByText(/^(Saved, the model called it|Goal, outside the model)$/),
    ).toBeInTheDocument()
    expect(screen.getByText(/^Goals \d, saves \d$/)).toHaveTextContent(
      /Goals (0, saves 1|1, saves 0)/,
    )
  })

  it('offers the email as a link and copies it on request', async () => {
    const user = userEvent.setup()
    renderApp()

    expect(screen.getByRole('link', { name: fakeProfile.email })).toHaveAttribute(
      'href',
      `mailto:${fakeProfile.email}`,
    )

    await user.click(screen.getByRole('button', { name: 'Copy email address' }))
    expect(screen.getByRole('button', { name: 'Copied email address' })).toBeInTheDocument()
    await expect(navigator.clipboard.readText()).resolves.toBe(fakeProfile.email)
  })

  it('says so when the browser blocks the clipboard', async () => {
    const user = userEvent.setup()
    renderApp()
    vi.spyOn(navigator.clipboard, 'writeText').mockRejectedValue(new Error('denied'))

    await user.click(screen.getByRole('button', { name: 'Copy email address' }))
    expect(screen.getByText(/Copy blocked by the browser/)).toBeInTheDocument()
  })

  it('exposes one labelled landmark per section', () => {
    renderApp()
    expect(screen.getByRole('navigation', { name: 'Primary' })).toBeInTheDocument()
    expect(screen.getByRole('main')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /Skip to content/i })).toHaveAttribute('href', '#top')
  })
})
