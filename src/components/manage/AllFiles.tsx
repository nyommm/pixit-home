import { UserProfile } from '@auth0/nextjs-auth0/client';
import useSWR from 'swr';
import styles from '@/styles/manage.module.scss';
import ListItem from './shared/ListItem';
import ListHeader from './shared/ListHeader';

const handler = async (url: string) => {
  let response = await fetch(url, { method: 'GET' });
  response = await response.json();
  return response;
}

export default function AllFiles({ user }: { user: UserProfile }) {
  const { data, error, isLoading } = useSWR(`/api/files/allFiles`, handler);
  let jsx;
  if (isLoading) {
    jsx = <p className={styles['section__empty']}>{`Loading files for ${user.nickname}...`}</p>;
  }
  else if (error) {
    jsx = <p className={styles['section__empty']}>{`Failed to fetch files for ${user.nickname}! Try again later.`}</p>;
  }
  else if (data?.body && data.body.files && data.body.files.length > 0) {
    jsx = (
      <ul className={styles['list-container']}>
        <ListHeader names={['File Name', 'Project Name', 'Last Modified On', 'Created On', 'Created By']}/>
        {data.body.files.map((file) => {
          const updatedDate = new Date(file.updatedDate);
          const createdDate = new Date(file.createdDate);
          let links = [{ url: `/manage/files/${file.fileId}`, title: file.fileName }];
          let fields = [
            `${updatedDate.toLocaleDateString()} ${updatedDate.toLocaleTimeString()}`,
            `${createdDate.toLocaleDateString()} ${createdDate.toLocaleTimeString()}`,
            `${file.creator.userName}`
          ];
          if (file.project)
            links.push({ url: `/manage/projects/${file.project.projectId}`, title: file.project.projectName })
          else
            fields.unshift('NA')
          return <ListItem key={file.fileId} links={links} fields={fields} />;
        })}
      </ul>
    );
  } else {
    jsx = <p className={styles['section__empty']}>So empty! Create your first file using the button above.</p>;
  }
  return (
    <section className={styles['section']}>
      <h1 className={styles['section__title']}>All Files</h1>
      {jsx}
    </section>
  );
}