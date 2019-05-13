export default `
	scalar Date
	input Pagination {
    page: Int
    perPage: Int
	}
	input Sort {
		field: String
		order: String
	}
	input Filter {
		q: String
    	id: ID
		name: String
		startDt: Date
	}
	type ListMetadata {
		count: Int!
	}
`;
