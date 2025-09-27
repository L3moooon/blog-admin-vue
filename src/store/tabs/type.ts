export interface TabItem {
  path: string;
  name: string | symbol | undefined;
  icon: string;
  key: string;
}
export interface TabStore {
  tabList: Array<TabItem>;
  activeKey: string;
  fixedTabs: Array<string>;
}
