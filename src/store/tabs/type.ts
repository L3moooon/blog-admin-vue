export interface TabItem {
  path: string;
  name?: string | symbol;
  icon?: string;
  key: string;
}
export interface TabStore {
  tabList: Array<TabItem>;
  activeKey: string;
  fixedTabs: Array<string>;
}
