import styles from '@/styles/manage.module.scss';

export default function ListHeader({ names }: { names: string[] }) {
  return (
    <li className={styles['list-container__header']}>
      {names.map((name) => (
        <span key={name} className={styles['list-container__header__col']}>
          {name}
        </span>
      ))}
    </li>
  )
}