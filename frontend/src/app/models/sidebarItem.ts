export class SidebarItem {
  id: number;
  title: string;
  webroute: string;
  iconPath: string;

  /**
   * Creates a new sidebar item with given parameters
   * @param newid the new id identifying the item
   * @param newtitle the title shown in the web view
   * @param newwebroute path to a new web location
   * @param newiconpath path to a given icon
   */
  constructor(
    newid: number,
    newtitle: string,
    newwebroute: string,
    newiconpath?: string
  ) {
    this.id = newid;
    this.title = newtitle;
    this.webroute = newwebroute;
    this.iconPath = newiconpath;
  }
}
