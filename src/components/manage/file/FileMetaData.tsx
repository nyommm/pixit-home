import Link from 'next/link';
import { FileMetaDataProps } from '@/types/propTypes';
import ListItem from '../shared/ListItem';
import styles from '@/styles/manage.module.scss';


export default function FileMetaData({ data, isLoading }: FileMetaDataProps) {
  const metaData = !isLoading && data
    ? [['Creator:', data.creator.userName], 
        ['Created On:', 
        `${new Date(data.createdDate).toLocaleDateString()} ${new Date(data.updatedDate).toLocaleTimeString()}`],
        ['Last Modified On:', 
          `${new Date(data.updatedDate).toLocaleDateString()} ${new Date(data.updatedDate).toLocaleTimeString()}`]]
    : null;
  return (
    <section className={styles['section']}>
      <h1 className={styles['section__title']}>
        {isLoading
          ? 'File'
          : (<>
              {data?.project && 
                <Link className={styles['section__title__link']} href={`/manage/projects/${data.project.projectId}`}>
                  {data.project.projectName}
                </Link>}
              {data && `/${data.fileName}`}
            </>)}
      </h1>
      {isLoading || !data
        ? <p className={styles['section__empty']}>Fetching metadata for this file...</p>
        : (<ul className={styles['list-container']}>
            {metaData && metaData.map((fields) => <ListItem key={fields[0]} fields={fields} />)}
          </ul>)}
    </section>
  );
}