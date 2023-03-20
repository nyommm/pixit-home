import { useState } from 'react';
import styles from '@/styles/manage.module.scss';

interface NewItemBtnProps {
  title: string;
  description: string;
  label: string;
  fieldName: string;
  errorMsg?: string;
  trigger: Function;
};

export default function NewItemBtn({ title, description, label, fieldName, errorMsg, trigger }: NewItemBtnProps) {
  const [hidden, setHidden] = useState(true);
  const [value, setValue] = useState('');
  const showForm = (evt) => {
    evt.stopPropagation();
    setHidden(false);
  };
  const hideForm = (evt) => {
    evt.stopPropagation();
    setHidden(true);
  };
  const handleSubmit = () => {
    const data = {};
    data[fieldName] = value;
    trigger(data);
  }
  return (
    <span className={styles['new-item-btn']} onClick={showForm}>
      {hidden 
        ? (<>
            <h3 className={styles['new-item-btn__name']}>{title}</h3>
            <p className={styles['new-item-btn__desc']}>{description}</p>
          </>)
        : (<>
            <label className={styles['new-item-btn__label']} htmlFor={fieldName}>{label}</label>
            <input className={styles['new-item-btn__input']} 
              name={fieldName} 
              type="text" value={value} onBlur={hideForm} 
              onChange={(evt) => setValue(evt.target.value)} 
              minLength={5} placeholder='Enter name here...' />
            <button className={styles['new-item-btn__submit']} onClick={handleSubmit}>Go</button>
            {errorMsg && <p className={styles['new-item-btn__error']}>{errorMsg}</p>}
          </>)}
    </span>
  )
}