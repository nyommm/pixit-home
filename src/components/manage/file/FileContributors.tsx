import useSWRMutation from 'swr/mutation';
import ListItem from '@/components/manage/shared/ListItem';
import ListHeader from '@/components/manage/shared/ListHeader';
import NewItemBtn from '@/components/manage/shared/NewItemBtn';
import { FileMetaDataProps } from '@/types/propTypes';
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

export default function FileContributors({ data, isLoading }: FileMetaDataProps) {
  const { trigger, error } = useSWRMutation(`/api/files/${data?.fileId}/add/contributor`, addUser);
  return (
    <section className={styles['section']}>
      <h1 className={styles['section__title']}>
        Contributors
      </h1>
      <div className={styles['section__container']}>
        {isLoading
          ? null 
          : (<NewItemBtn 
            title={'Add Contributor'} errorMsg={error?.message}
            description={'Share this file with another user'} 
            label={'User Name'} fieldName={'userName'} trigger={trigger} />)}
      </div>
      {isLoading || !data
        ? <p className={styles['section__empty']}>Fetching contributors for this file...</p>
        : (<ul className={styles['list-container']}>
            {(!isLoading && data) &&
              (<ListHeader names={['User Name', 'Role']}/>)}
            {(!isLoading && data) && 
              data.contributors.map(
                ({ userId, userName }) => (
                  <ListItem key={userId} 
                    fields={[userName, `${userId == data.creator.userId ? 'Creator, ' : ''}Contributor`]} />
                )
              )}
          </ul>)}
    </section>
  );
}