import { useEffect, useState, useCallback } from 'react';
type DataSet = ComponentFramework.PropertyTypes.DataSet;
import DataSetInterfaces = ComponentFramework.PropertyHelper.DataSetApi;

export interface IItem {
  id: string;
  displayName: string;
  isChecked: boolean;
  booleanLabel: string;
  contextInfo: string;
  raw: DataSetInterfaces.EntityRecord;
}

export const useItems = (dataset: DataSet, propertySetColumns: DataSetInterfaces.Column[]) => {
  const [items, setItems] = useState<IItem[]>([]);

  useEffect(() => {
    // create an array of the column aliases

    const displayColumnLogicalName = propertySetColumns[0].name;
    const booleanColumnLogicalName = propertySetColumns[1].name;
    const booleanLabel = propertySetColumns[1].displayName;
    const contextColumnLogicalName = propertySetColumns[2].name;

    const itemsList = dataset.sortedRecordIds.map(id => {
      const record = dataset.records[id];
      const item: IItem = {
        id: record.getRecordId(),
        displayName: record.getFormattedValue(displayColumnLogicalName),
        isChecked: record.getValue(booleanColumnLogicalName) === '1',
        booleanLabel: booleanLabel,
        contextInfo: record.getFormattedValue(contextColumnLogicalName),
        raw: record,
      };
      return item;
    });

    setItems(itemsList);
  }, [dataset, propertySetColumns]);

  const updateItem = useCallback(
    (item: IItem) => {
      const clonedItems = [...items];
      const index = clonedItems.indexOf(item);
      clonedItems[index] = { ...item, isChecked: !item.isChecked };
      setItems(current => clonedItems);
    },
    [items, setItems]
  );

  return {
    items,
    updateItem,
  };
};
