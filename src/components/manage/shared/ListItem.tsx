import Link from 'next/link';
import styles from '@/styles/manage.module.scss';

interface ItemLink {
  url: string;
  title: string;
};

interface ListItemProps {
  links?: ItemLink[];
  fields?: string[];
};

export default function ListItem({ links, fields }: ListItemProps) {
  return (
    <li className={styles['list-container__item']}>
      {links
        ? links.map(({ url, title }) => (
          <Link className={styles['list-container__item__link']} 
            href={url} key={url}>{title}</Link>
        ))
        : null}
      {fields
        ? fields.map((field, idx) => (
          <span key={`${field}-${idx}`} className={styles['list-container__item__field']}>
            {field}
          </span>
        ))
        : null}
    </li>
  );
}