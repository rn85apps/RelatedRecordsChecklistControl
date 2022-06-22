import { IconButton } from '@fluentui/react/lib/Button';
import * as React from 'React';
type DataSet = ComponentFramework.PropertyTypes.DataSet;

export interface IFooterProps {
  dataset: DataSet;
}

export const Footer: React.FunctionComponent<IFooterProps> = ({ dataset }: IFooterProps) => {
  const pageSize = dataset.paging.pageSize;
  const totalRecords = dataset.paging.totalResultCount;
  const currentPage: number = (dataset.paging as any).pageNumber;
  const firstItemNumber = (currentPage - 1) * pageSize + 1;
  const lastItemNumber = (currentPage - 1) * pageSize + dataset.sortedRecordIds.length;
  const lastPage = Math.ceil(totalRecords / pageSize);

  function moveToFirst() {
    dataset.paging.loadExactPage(1);
  }

  function movePrevious() {
    dataset.paging.loadExactPage(currentPage - 1);
  }

  function moveNext() {
    dataset.paging.loadExactPage(currentPage + 1);
  }

  function moveToLast() {
    dataset.paging.loadExactPage(lastPage);
  }

  return (
    <div className="checklist--footer">
      <div>
        <span>
          {firstItemNumber} - {lastItemNumber} of {totalRecords}
        </span>
      </div>
      <div>
        {dataset.paging.hasPreviousPage && currentPage > 2 && (
          <IconButton iconProps={{ iconName: 'Previous' }} onClick={moveToFirst} />
        )}
        {dataset.paging.hasPreviousPage && (
          <IconButton iconProps={{ iconName: 'Back' }} onClick={movePrevious} />
        )}
        {(dataset.paging.hasPreviousPage || dataset.paging.hasNextPage) && (
          <span style={{ paddingLeft: '10px', paddingRight: '10px' }}>
            Page {currentPage} of {lastPage}
          </span>
        )}
        {dataset.paging.hasNextPage && (
          <IconButton iconProps={{ iconName: 'Forward' }} onClick={moveNext} />
        )}
        {dataset.paging.hasNextPage && lastPage > 2 && (
          <IconButton iconProps={{ iconName: 'Next' }} onClick={moveToLast} />
        )}
      </div>
    </div>
  );
};
