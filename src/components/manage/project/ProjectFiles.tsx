import useSWRMutation from 'swr/mutation';
import ListItem from '@/components/manage/shared/ListItem';
import ListHeader from '@/components/manage/shared/ListHeader';
import NewItemBtn from '@/components/manage/shared/NewItemBtn';
import { ProjectMetaDataProps } from '@/types/propTypes';
import styles from '@/styles/manage.module.scss';

const addFile = async (url: string, { arg }: { arg: { fileName: string } }) => {
  let response = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
    },
    method: 'POST', 
    body: JSON.stringify({
      ...arg,
    }),
  });
  response = await response.json();
  return response;
}

export default function ProjectFiles({ data, isLoading }: ProjectMetaDataProps) {
  const { trigger, error } = useSWRMutation(`/api/projects/${data?.projectId}/add/file`, addFile);
  return (
    <section className={styles['section']}>
      <h1 className={styles['section__title']}>
        Files
      </h1>
      <div className={styles['section__container']}>
        {isLoading
          ? null 
          : (<NewItemBtn 
            title={'Add File'} errorMsg={error?.message}
            description={'Add a new file to this project'} 
            label={'File Name'} fieldName={'fileName'} trigger={trigger} />)}
      </div>
      {isLoading || !data
        ? <p className={styles['section__empty']}>Fetching files for this project...</p>
        : (<ul className={styles['list-container']}>
            {(!isLoading && data && data.files.length > 0) &&
              (<ListHeader names={['File Name', 'Last Modified On', 'Created On']}/>)}
            {(!isLoading && data) && (
              data.files.length > 0
              ? data.files.map(
                  ({ fileId, fileName, createdDate, updatedDate }) => {
                    updatedDate = new Date(updatedDate);
                    createdDate = new Date(createdDate);
                    let links = [{url: `/manage/files/${fileId}`, title: fileName }];
                    let fields = [
                      `${updatedDate.toLocaleDateString()} ${updatedDate.toLocaleTimeString()}`,
                      `${createdDate.toLocaleDateString()} ${createdDate.toLocaleTimeString()}`,
                    ];
                    return <ListItem key={fileId} links={links} fields={fields} />;
                  })
              : <p className={styles['section__empty']}>So empty! Create your first file now.</p>
            )}
          </ul>)}
    </section>
  );
}