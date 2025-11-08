import { CommonResponse, CommonListResponse } from "@/api/commonType";

interface Visitor {
	id: number;
	identify: string;
	name: string;
	portrait: string;
	ip: string;
	address: string;
	agent: string;
	create_time: string;
	last_login_time: string;
	visited_count: number;
}

export interface VisitorListResponse extends CommonListResponse {
	data: Array<Visitor>;
}
