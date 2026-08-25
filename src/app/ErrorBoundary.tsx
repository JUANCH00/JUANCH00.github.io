import { Component, type ErrorInfo, type ReactNode } from 'react'

interface Props {
  readonly children: ReactNode
  readonly fallback: ReactNode
}

interface State {
  readonly hasError: boolean
}

/**
 * Keeps one broken widget from blanking the page.
 *
 * The lab sections run animation and canvas code; if one of them throws, a
 * recruiter should still see the projects and the contact details rather than
 * a white screen. React has no hook equivalent for this, hence the class.
 */
export class ErrorBoundary extends Component<Props, State> {
  override state: State = { hasError: false }

  static getDerivedStateFromError(): State {
    return { hasError: true }
  }

  override componentDidCatch(error: Error, info: ErrorInfo): void {
    console.error('Section failed to render', error, info.componentStack)
  }

  override render(): ReactNode {
    return this.state.hasError ? this.props.fallback : this.props.children
  }
}
