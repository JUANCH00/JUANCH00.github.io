import styles from './SkipLink.module.css'

/** First tab stop on the page: jump past the navigation straight to the content. */
export const SkipLink = ({ targetId }: { readonly targetId: string }) => (
  <a className={styles.skip} href={`#${targetId}`}>
    Skip to content
  </a>
)
