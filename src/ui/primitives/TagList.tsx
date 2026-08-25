import styles from './TagList.module.css'

interface TagListProps {
  readonly items: readonly string[]
  readonly label: string
}

export const TagList = ({ items, label }: TagListProps) => (
  <ul className={styles.list} aria-label={label}>
    {items.map((item) => (
      <li key={item} className={styles.tag}>
        {item}
      </li>
    ))}
  </ul>
)
