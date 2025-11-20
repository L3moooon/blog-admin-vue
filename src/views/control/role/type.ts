interface PermissionItem {
	id: number;
	parent_id: number;
	permission_name: string;
	permisson_type: number;
	path?: string;
	component?: string;
	permission_code?: string;
	sort: boolean;
	create_time: string;
	update_time: String;
	disabled: boolean;
}

export interface PermissionTreeItem {
	id: number;
	parent_id: number;
	permission_name: string;
	permission_type: number;
	path?: string;
	component?: string;
	permission_code?: string;
	sort: boolean;
	create_time: string;
	update_time: String;
	disabled: boolean;
	checked?: boolean | "indeterminate";
	children: Array<PermissionTreeItem>;
}
