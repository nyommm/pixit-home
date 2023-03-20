import { useEffect } from 'react';
import NewItemBtn from '@/components/manage/shared/NewItemBtn';
import useSWRMutation from 'swr/mutation';
import styles from '@/styles/manage.module.scss';

interface RequestArgs {
  projectName?: string;
  fileName?: string;
}

async function createItem(url: string, { arg }: { arg: RequestArgs }) {
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

export default function CreateNew() {
  const { trigger: createProjectTrigger, error: projectError } = useSWRMutation('/api/projects/create', createItem);
  const { trigger: createFileTrigger, error: fileError } = useSWRMutation('/api/files/create', createItem);

  return (
    <section className={styles['section']}>
      <h1 className={styles['section__title']}>Create</h1>
      <div className={styles['section__container']}>
        <NewItemBtn 
          title={'New Project...'} 
          description={'Organize similar files in a project'} 
          label={'Project Name'} 
          fieldName={'projectName'} 
          errorMsg={projectError?.message}
          trigger={createProjectTrigger} />
        <NewItemBtn 
          title={'New File...'} 
          description={'Create a new empty file'} 
          label={'File Name'} 
          fieldName={'fileName'} 
          errorMsg={fileError?.message}
          trigger={createFileTrigger} />
      </div>
    </section>
  );
}