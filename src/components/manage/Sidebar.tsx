import { UserProfile } from '@auth0/nextjs-auth0/client';
import Link from 'next/link';
import useSWR from 'swr';
import styles from '@/styles/manage.module.scss';

import ExpandableSbSection from './ExpandableSbSection';

const handler = async (url: string) => {
  let response = await fetch(url, { method: 'GET' });
  response = await response.json();
  return response;
};

function userOptions() {
  return (
    <ul className={styles['sidebar__container__list']}>
      <li>
        <Link className={styles['sidebar__container__list__link']} href="#">Profile</Link>
      </li>
      <li>
        {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
        <a className={styles['sidebar__container__list__link']} href="/api/auth/logout">Logout</a>
      </li>
    </ul>
  );
}

interface FavFile {
  fileId: string;
  fileName: string;
};

function favoriteFiles(files: FavFile[], isLoading: boolean) {
  if (isLoading)
    return <p className={styles['sidebar__container__muted-text']}>Fetching your favorite files...</p>;
  if (files && files.length > 0) {
    return (
      <ul className={styles['sidebar__container__list']}>
        {files.map(({ fileId, fileName }) => (
          <li key={fileId}>
            <Link className={styles['sidebar__container__list__link']} href="#">
              {fileName}
            </Link>
          </li>
        ))}
      </ul>
    );
  }
  return <p className={styles['sidebar__container__muted-text']}>You have no favorite files!</p>;
}

export default function Sidebar({ user }: { user: UserProfile }) {
  const { data, error, isLoading } = useSWR(`/api/files/fav`, handler);
  if (error) console.log(`failed to get fav files for ${user.nickname}:\n${error.message}`);
  return (
    <nav className={styles['sidebar']}>
      <div className={styles['sidebar__container']}>
        <Link className={styles['sidebar__container__link']} href="/manage">Recent Files</Link>
        <Link className={styles['sidebar__container__link']} href="/manage/projects">Your Projects</Link>
        <Link className={styles['sidebar__container__link']} href="/manage/files">Your Files</Link>
        <ExpandableSbSection title={'Favorite Files'} render={() => favoriteFiles(data?.body?.files, isLoading)} />
        <ExpandableSbSection title={'Account'} render={userOptions} />
      </div>
    </nav>
  );
}