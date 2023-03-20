import ListItem from '../shared/ListItem';
import { ProjectMetaDataProps } from '@/types/propTypes';
import styles from '@/styles/manage.module.scss';

export default function ProjectMetaData({ data, isLoading }: ProjectMetaDataProps) {
  const metaData = !isLoading && data
    ? [['Owner:', data.owner.userName], 
        ['Created On:', 
        `${new Date(data.createdDate).toLocaleDateString()} ${new Date(data.updatedDate).toLocaleTimeString()}`],
        ['Last Modified On:', 
          `${new Date(data.updatedDate).toLocaleDateString()} ${new Date(data.updatedDate).toLocaleTimeString()}`]]
    : null;
  return (
    <section className={styles['section']}>
      <h1 className={styles['section__title']}>
        {isLoading || !data
          ? 'Project'
          : data.projectName}
      </h1>
      {isLoading || !data
        ? <p className={styles['section__empty']}>Fetching metadata for this project...</p>
        : (
          <ul className={styles['list-container']}>
            {metaData && metaData.map((fields) => <ListItem key={fields[0]} fields={fields} />)}
          </ul>
        )}
    </section>
  );
}