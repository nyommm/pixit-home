import { ProjectDataComplete, FileDataComplete } from '@/types/modelTypes';

export interface ProjectMetaDataProps {
  data: ProjectDataComplete;
  isLoading: boolean;
};

export interface FileMetaDataProps {
  data: FileDataComplete;
  isLoading: boolean;
};