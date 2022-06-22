import * as React from 'react';
import { Checkbox } from '@fluentui/react/lib/Checkbox';
import { IItem } from '../hooks/useItems';

export interface IItemRowProps {
  item: IItem;
  handleChange: (item: IItem) => Promise<boolean>;
  openRecord: (item: IItem) => void;
  isDisabled: boolean;
}

export const ItemRow: React.FunctionComponent<IItemRowProps> = ({
  item,
  handleChange,
  openRecord,
  isDisabled,
}: IItemRowProps) => {
  const { isChecked, displayName, contextInfo } = item;
  const [isSaving, setIsSaving] = React.useState<boolean>(false);
  const [hasError, setHasError] = React.useState<boolean>(false);

  // Handler the Checkbox's onChange event
  const handleOnChange = () => {
    setIsSaving(true);
    handleChange(item).then(success => {
      setIsSaving(false);
      setHasError(!success);
    });
  };

  const handleClick = (ev: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    ev.preventDefault();
    openRecord(item);
  };

  return (
    <article className="checklist--rowitem">
      <Checkbox
        className="grid-checkbox"
        checked={isChecked}
        onChange={handleOnChange}
        disabled={isDisabled}
      />
      <a
        onClick={handleClick}
        title="View details"
        href="#"
        className="grid-displayName checklist--rowitem--viewdetails"
      >
        {displayName ?? '---'}
      </a>
      <div className="grid-context" title={contextInfo ?? '---'}>
        {contextInfo ?? '----'}
      </div>
      <div className="grid-alert">
        {isSaving && <span style={{ color: 'green' }}> ✔ Saving </span>}
        {hasError && <span style={{ color: 'red' }}> ❗ ERROR. Please Refresh Grid </span>}
      </div>
    </article>
  );
};
