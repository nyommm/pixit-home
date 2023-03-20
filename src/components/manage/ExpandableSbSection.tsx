import { useState } from 'react';
import styles from '@/styles/manage.module.scss';

interface ExpandableSbSectionProps {
  title: string;
  render: () => JSX.Element;
}

export default function ExpandableSbSection({ title, render }: ExpandableSbSectionProps) {
  const [hidden, setHidden] = useState(true);
  const toggleVisibility = (evt: React.MouseEvent<HTMLSpanElement, MouseEvent>) => {
    evt.stopPropagation();
    setHidden(!hidden);
  };
  return (
    <>
      <a className={styles['sidebar__container__link']} onClick={toggleVisibility} href="#">
        {hidden ? '+' : '-'} {title}
      </a>
      {!hidden && render()}
    </>
  );
}