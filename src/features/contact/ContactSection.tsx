import { useProfile } from '@application/profile'
import { Container, Reveal } from '@ui/primitives'
import { useCopyToClipboard } from '@ui/hooks/useCopyToClipboard'
import styles from './ContactSection.module.css'

const EmailChannel = () => {
  const { email } = useProfile()
  const { copied, failed, copy } = useCopyToClipboard()

  return (
    <div>
      <p className={styles.label}>Email — click to copy</p>
      <button type="button" className={styles.copy} onClick={() => void copy(email)}>
        {copied ? 'copied ✓' : email}
      </button>
      {/* Clipboard access can be denied or unavailable; say so and offer a way out. */}
      {failed && (
        <a className={styles.fallback} href={`mailto:${email}`}>
          Copy blocked by the browser — open your mail client instead
        </a>
      )}
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
      <div className={styles.inner}>
        <Reveal>
          <h2 id="contact-heading" className={styles.headline}>
            Let&rsquo;s talk
            <br />
            <span className={styles.headlineAccent}>about an internship</span>
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
      </div>
    </Container>
  )
}
