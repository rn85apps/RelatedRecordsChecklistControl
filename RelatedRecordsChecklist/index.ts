import { IInputs, IOutputs } from './generated/ManifestTypes';
import * as React from 'react';
import * as ReactDOMClient from 'react-dom/client';
import { App, IAppProps } from './components/App';
import DataSetInterfaces = ComponentFramework.PropertyHelper.DataSetApi;
type DataSet = ComponentFramework.PropertyTypes.DataSet;

export class RelatedRecordsChecklist
  implements ComponentFramework.StandardControl<IInputs, IOutputs>
{
  private _root: ReactDOMClient.Root;
  private _target: string;
  private _propertySetColumns: DataSetInterfaces.Column[];
  private _hasTargetPrivileges: boolean;

  /**
   * Empty constructor.
   */
  constructor() {}

  /**
   * Used to initialize the control instance. Controls can kick off remote server calls and other initialization actions here.
   * Data-set values are not initialized here, use updateView.
   * @param context The entire property bag available to control via Context Object; It contains values as set up by the customizer mapped to property names defined in the manifest, as well as utility functions.
   * @param notifyOutputChanged A callback method to alert the framework that the control has new outputs ready to be retrieved asynchronously.
   * @param state A piece of data that persists in one session for a single user. Can be set at any point in a controls life cycle by calling 'setControlState' in the Mode interface.
   * @param container If a control is marked control-type='standard', it will receive an empty div element within which it can render its content.
   */
  public init(
    context: ComponentFramework.Context<IInputs>,
    notifyOutputChanged: () => void,
    state: ComponentFramework.Dictionary,
    container: HTMLDivElement
  ): void {
    this._root = ReactDOMClient.createRoot(container);
    this._target = context.parameters.dataset.getTargetEntityType();
    this._hasTargetPrivileges = this.testUserPrivileges(context);

    // Get the property sets configured for the PCF component
    const columnsOnView = context.parameters.dataset.columns;
    const aliases = columnsOnView.map(col => col.alias);
    const propertySetColumns = ['displayColumn', 'booleanColumn', 'contextColumn'].map(
      alias => columnsOnView[aliases.indexOf(alias)]
    );

    this._propertySetColumns = propertySetColumns;
  }

  /**
   * Called when any value in the property bag has changed. This includes field values, data-sets, global values such as container height and width, offline status, control metadata values such as label, visible, etc.
   * @param context The entire property bag available to control via Context Object; It contains values as set up by the customizer mapped to names defined in the manifest, as well as utility functions
   */
  public updateView(context: ComponentFramework.Context<IInputs>): void {
    // Add code to update control view

    const isDisabled = context.mode.isControlDisabled;

    if (this._hasTargetPrivileges) {
      const props: IAppProps = {
        dataset: context.parameters.dataset,
        webApi: context.webAPI,
        target: this._target,
        propertySetColumns: this._propertySetColumns,
        isDisabled,
      };

      this._root.render(React.createElement(App, props));
    } else {
      this._root.render(React.createElement('div'));
    }
  }

  /**
   * It is called by the framework prior to a control receiving new data.
   * @returns an object based on nomenclature defined in manifest, expecting object[s] for property marked as “bound” or “output”
   */
  public getOutputs(): IOutputs {
    return {};
  }

  /**
   * Called when the control is to be removed from the DOM tree. Controls should use this call for cleanup.
   * i.e. cancelling any pending remote calls, removing listeners, etc.
   */
  public destroy(): void {
    // Add code to cleanup control if necessary
    this._root.unmount();
  }

  testUserPrivileges(context: ComponentFramework.Context<IInputs>): boolean {
    const canReadTarget = this.checkUserPrivilege(context, this._target, 2);
    const canWriteTarget = this.checkUserPrivilege(context, this._target, 3);
    return canReadTarget && canWriteTarget;
  }

  checkUserPrivilege(
    context: ComponentFramework.Context<IInputs>,
    tableName: string,
    privilege: ComponentFramework.PropertyHelper.Types.PrivilegeType
  ): boolean {
    const isBasic = context.utils.hasEntityPrivilege(this._target, privilege, 0);
    const isLocal = context.utils.hasEntityPrivilege(this._target, privilege, 1);
    const isDeep = context.utils.hasEntityPrivilege(this._target, privilege, 2);
    const isGlobal = context.utils.hasEntityPrivilege(this._target, privilege, 3);
    const result = isBasic || isLocal || isDeep || isGlobal;
    return result;
  }
}
