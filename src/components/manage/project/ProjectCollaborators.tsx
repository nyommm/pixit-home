import useSWRMutation from 'swr/mutation';
import ListItem from '@/components/manage/shared/ListItem';
import ListHeader from '@/components/manage/shared/ListHeader';
import NewItemBtn from '@/components/manage/shared/NewItemBtn';
import { ProjectMetaDataProps } from '@/types/propTypes';
import styles from '@/styles/manage.module.scss';

const addUser = async (url: string, { arg }: { arg: { userName: string } }) => {
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

export default function ProjectCollaborators({ data, isLoading }: ProjectMetaDataProps) {
  const { trigger, error } = useSWRMutation(`/api/projects/${data?.projectId}/add/collaborator`, addUser);
  return (
    <section className={styles['section']}>
      <h1 className={styles['section__title']}>
        Collaborators
      </h1>
      <div className={styles['section__container']}>
        {isLoading
          ? null 
          : (<NewItemBtn 
            title={'Add Collaborator'} errorMsg={error?.message}
            description={'Add a new collaborator to this project'} 
            label={'User Name'} fieldName={'userName'} trigger={trigger} />)}
      </div>
      {isLoading || !data
        ? <p className={styles['section__empty']}>Fetching collaborators for this project...</p>
        : (<ul className={styles['list-container']}>
            {(!isLoading && data) &&
              (<ListHeader names={['User Name', 'Role']}/>)}
            {(!isLoading && data) && 
              data.collaborators.map(
                ({ userId, userName }) => (
                  <ListItem key={userId} 
                    fields={[
                      userName, 
                      `${userId == data.owner.userId ? 'Owner, ' : ''}${userId == data.creator.userId ? 'Creator, ' : ''}Collaborator`
                    ]} />
                )
              )}
          </ul>)}
    </section>
  );
}