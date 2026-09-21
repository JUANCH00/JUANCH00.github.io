import { useProfile } from '@application/profile'
import { Button, Container, Reveal } from '@ui/primitives'
import { useCopyToClipboard } from '@ui/hooks/useCopyToClipboard'
import styles from './ContactSection.module.css'

/**
 * Two visible actions instead of one hidden one: the address is a real
 * `mailto:` link, and copying is a separate button that says what it does.
 * Clipboard access can be denied or unavailable (plain HTTP, some embedded
 * browsers), so a failure is reported instead of silently doing nothing.
 */
const EmailChannel = () => {
  const { email } = useProfile()
  const { copied, failed, copy } = useCopyToClipboard()

  return (
    <div>
      <p className={styles.label}>Email</p>
      <div className={styles.value}>
        <a href={`mailto:${email}`}>{email}</a>
        {/* The spoken name contains the visible word, so voice control users can
            say what they see ("click Copy"). */}
        <Button
          size="sm"
          aria-label={copied ? 'Copied email address' : 'Copy email address'}
          onClick={() => void copy(email)}
        >
          {copied ? 'Copied' : 'Copy'}
        </Button>
      </div>
      {/* Always mounted, so screen readers announce the change when it lands. */}
      <p className={styles.feedback} role="status">
        {failed && 'Copy blocked by the browser. Open your mail client instead.'}
      </p>
    </div>
  )
}

export const ContactSection = () => {
  const { contactChannels } = useProfile()

  return (
    <Container
      as="section"
      id="contact"
      className={styles.contact}
      aria-labelledby="contact-heading"
    >
      <Reveal>
        <h2 id="contact-heading" className={styles.headline}>
          Let&rsquo;s talk about <em>an internship</em>
        </h2>

        <div className={styles.channels}>
          <EmailChannel />
          {contactChannels.map((channel) => (
            <div key={channel.id}>
              <p className={styles.label}>{channel.label}</p>
              <div className={styles.value}>
                {channel.links.map((link) =>
                  link.href ? (
                    <a
                      key={link.id}
                      href={link.href}
                      {...(link.href.startsWith('http')
                        ? { target: '_blank', rel: 'noreferrer noopener' }
                        : {})}
                    >
                      {link.text}
                    </a>
                  ) : (
                    <span key={link.id}>{link.text}</span>
                  ),
                )}
              </div>
            </div>
          ))}
        </div>
      </Reveal>
    </Container>
  )
}
