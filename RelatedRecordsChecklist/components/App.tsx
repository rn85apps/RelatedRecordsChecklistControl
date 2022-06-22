import * as React from 'react';
import { IItem, useItems } from '../hooks/useItems';
import { Footer } from './Footer';
import { ItemRow } from './ItemRow';
type DataSet = ComponentFramework.PropertyTypes.DataSet;
import DataSetInterfaces = ComponentFramework.PropertyHelper.DataSetApi;

export interface IAppProps {
  dataset: DataSet;
  target: string;
  propertySetColumns: DataSetInterfaces.Column[];
  webApi: ComponentFramework.WebApi;
  isDisabled: boolean;
}

export const App: React.FunctionComponent<IAppProps> = ({
  dataset,
  target,
  propertySetColumns,
  webApi,
  isDisabled,
}: IAppProps) => {
  const { items, updateItem } = useItems(dataset, propertySetColumns);

  // Handler that will be passed to each row/item to
  //   (a) update the Dataverse record using webAPI,
  //   (b) update the local state of the items array,
  //   (c) indicate to the item/row whether the update was successful
  const executeUpdate = React.useCallback(
    async (item: IItem): Promise<boolean> => {
      let success: boolean = false;
      try {
        const booleanColumnLogicalName = propertySetColumns[1].name;
        ``;
        const response = await webApi.updateRecord(target, item.id, {
          [booleanColumnLogicalName]: !item.isChecked,
        });

        if (response) {
          success = true;
          updateItem(item);
        }
      } catch (error) {
        success = false;
      } finally {
        return success;
      }
    },
    [target, updateItem, webApi.updateRecord, propertySetColumns]
  );

  // Handler that will open the form associated with the entity record
  const executeOpenRecord = React.useCallback(
    (item: IItem) => {
      const entityReference = item.raw.getNamedReference();
      dataset.openDatasetItem(entityReference);
    },
    [dataset.openDatasetItem]
  );

  return (
    <div className="checklist">
      <div>
        {items &&
          items.length &&
          items.map(item => (
            <ItemRow
              key={item.id}
              item={item}
              handleChange={executeUpdate}
              openRecord={executeOpenRecord}
              isDisabled={isDisabled}
            ></ItemRow>
          ))}
      </div>
      <Footer dataset={dataset} />
    </div>
  );
};
