const contract_data = {
	"compiler": {
		"version": "0.8.7+commit.e28d00a7"
	},
	"language": "Solidity",
	"output": {
		"abi": [
			{
				"inputs": [
					{
						"internalType": "string",
						"name": "_name",
						"type": "string"
					}
				],
				"stateMutability": "nonpayable",
				"type": "constructor"
			},
			{
				"inputs": [],
				"name": "ACCOUNT_TYPE_STUDENT",
				"outputs": [
					{
						"internalType": "uint8",
						"name": "",
						"type": "uint8"
					}
				],
				"stateMutability": "view",
				"type": "function"
			},
			{
				"inputs": [],
				"name": "ACCOUNT_TYPE_UNIVERSITY",
				"outputs": [
					{
						"internalType": "uint8",
						"name": "",
						"type": "uint8"
					}
				],
				"stateMutability": "view",
				"type": "function"
			},
			{
				"inputs": [
					{
						"internalType": "uint64",
						"name": "courseTemplateID",
						"type": "uint64"
					}
				],
				"name": "addBlacklistedCourseTemplate",
				"outputs": [
					{
						"internalType": "uint64[]",
						"name": "",
						"type": "uint64[]"
					}
				],
				"stateMutability": "nonpayable",
				"type": "function"
			},
			{
				"inputs": [
					{
						"internalType": "address",
						"name": "blacklistedUniversity",
						"type": "address"
					}
				],
				"name": "addBlacklistedUniversity",
				"outputs": [
					{
						"internalType": "address[]",
						"name": "",
						"type": "address[]"
					}
				],
				"stateMutability": "nonpayable",
				"type": "function"
			},
			{
				"inputs": [
					{
						"internalType": "string",
						"name": "_name",
						"type": "string"
					},
					{
						"internalType": "string",
						"name": "_description",
						"type": "string"
					},
					{
						"internalType": "uint8",
						"name": "_duration",
						"type": "uint8"
					}
				],
				"name": "createCourseTemplate",
				"outputs": [
					{
						"components": [
							{
								"internalType": "string",
								"name": "name",
								"type": "string"
							},
							{
								"internalType": "string",
								"name": "description",
								"type": "string"
							},
							{
								"internalType": "uint8",
								"name": "duration",
								"type": "uint8"
							}
						],
						"internalType": "struct DegreeCoin.CourseTemplate",
						"name": "_courseTemplate",
						"type": "tuple"
					}
				],
				"stateMutability": "nonpayable",
				"type": "function"
			},
			{
				"inputs": [],
				"name": "getAccountType",
				"outputs": [
					{
						"internalType": "uint8",
						"name": "",
						"type": "uint8"
					}
				],
				"stateMutability": "view",
				"type": "function"
			},
			{
				"inputs": [
					{
						"internalType": "uint64",
						"name": "courseTemplateID",
						"type": "uint64"
					}
				],
				"name": "getCourseTemplate",
				"outputs": [
					{
						"components": [
							{
								"internalType": "string",
								"name": "name",
								"type": "string"
							},
							{
								"internalType": "string",
								"name": "description",
								"type": "string"
							},
							{
								"internalType": "uint8",
								"name": "duration",
								"type": "uint8"
							}
						],
						"internalType": "struct DegreeCoin.CourseTemplate",
						"name": "_courseTemplate",
						"type": "tuple"
					}
				],
				"stateMutability": "view",
				"type": "function"
			},
			{
				"inputs": [],
				"name": "getCourseTemplates",
				"outputs": [
					{
						"components": [
							{
								"internalType": "string",
								"name": "name",
								"type": "string"
							},
							{
								"internalType": "string",
								"name": "description",
								"type": "string"
							},
							{
								"internalType": "uint8",
								"name": "duration",
								"type": "uint8"
							}
						],
						"internalType": "struct DegreeCoin.CourseTemplate[]",
						"name": "_courseTemplates",
						"type": "tuple[]"
					}
				],
				"stateMutability": "view",
				"type": "function"
			},
			{
				"inputs": [
					{
						"internalType": "address",
						"name": "student",
						"type": "address"
					}
				],
				"name": "getDetailsStudent",
				"outputs": [
					{
						"components": [
							{
								"internalType": "uint64",
								"name": "degreeCount",
								"type": "uint64"
							},
							{
								"components": [
									{
										"internalType": "address",
										"name": "issuer",
										"type": "address"
									},
									{
										"internalType": "uint16",
										"name": "cgpa",
										"type": "uint16"
									},
									{
										"internalType": "string",
										"name": "grade",
										"type": "string"
									},
									{
										"internalType": "uint64",
										"name": "issuedAt",
										"type": "uint64"
									},
									{
										"internalType": "uint64",
										"name": "courseID",
										"type": "uint64"
									},
									{
										"internalType": "string",
										"name": "comments",
										"type": "string"
									}
								],
								"internalType": "struct DegreeCoin.Degree[]",
								"name": "degrees",
								"type": "tuple[]"
							}
						],
						"internalType": "struct DegreeCoin.Student",
						"name": "",
						"type": "tuple"
					}
				],
				"stateMutability": "view",
				"type": "function"
			},
			{
				"inputs": [],
				"name": "getDetailsStudent",
				"outputs": [
					{
						"components": [
							{
								"internalType": "uint64",
								"name": "degreeCount",
								"type": "uint64"
							},
							{
								"components": [
									{
										"internalType": "address",
										"name": "issuer",
										"type": "address"
									},
									{
										"internalType": "uint16",
										"name": "cgpa",
										"type": "uint16"
									},
									{
										"internalType": "string",
										"name": "grade",
										"type": "string"
									},
									{
										"internalType": "uint64",
										"name": "issuedAt",
										"type": "uint64"
									},
									{
										"internalType": "uint64",
										"name": "courseID",
										"type": "uint64"
									},
									{
										"internalType": "string",
										"name": "comments",
										"type": "string"
									}
								],
								"internalType": "struct DegreeCoin.Degree[]",
								"name": "degrees",
								"type": "tuple[]"
							}
						],
						"internalType": "struct DegreeCoin.Student",
						"name": "",
						"type": "tuple"
					}
				],
				"stateMutability": "view",
				"type": "function"
			},
			{
				"inputs": [
					{
						"internalType": "address",
						"name": "university",
						"type": "address"
					}
				],
				"name": "getDetailsUniversity",
				"outputs": [
					{
						"components": [
							{
								"internalType": "string",
								"name": "name",
								"type": "string"
							},
							{
								"internalType": "address",
								"name": "invitedBy",
								"type": "address"
							},
							{
								"internalType": "uint64",
								"name": "establishedAt",
								"type": "uint64"
							},
							{
								"internalType": "address[]",
								"name": "blacklistedUniversities",
								"type": "address[]"
							},
							{
								"internalType": "uint64[]",
								"name": "blacklistedCourseTemplates",
								"type": "uint64[]"
							},
							{
								"components": [
									{
										"internalType": "string",
										"name": "name",
										"type": "string"
									},
									{
										"internalType": "string",
										"name": "description",
										"type": "string"
									},
									{
										"internalType": "uint8",
										"name": "duration",
										"type": "uint8"
									},
									{
										"internalType": "uint64",
										"name": "equivalency",
										"type": "uint64"
									}
								],
								"internalType": "struct DegreeCoin.Course[]",
								"name": "courses",
								"type": "tuple[]"
							}
						],
						"internalType": "struct DegreeCoin.University",
						"name": "",
						"type": "tuple"
					}
				],
				"stateMutability": "view",
				"type": "function"
			},
			{
				"inputs": [],
				"name": "getDetailsUniversity",
				"outputs": [
					{
						"components": [
							{
								"internalType": "string",
								"name": "name",
								"type": "string"
							},
							{
								"internalType": "address",
								"name": "invitedBy",
								"type": "address"
							},
							{
								"internalType": "uint64",
								"name": "establishedAt",
								"type": "uint64"
							},
							{
								"internalType": "address[]",
								"name": "blacklistedUniversities",
								"type": "address[]"
							},
							{
								"internalType": "uint64[]",
								"name": "blacklistedCourseTemplates",
								"type": "uint64[]"
							},
							{
								"components": [
									{
										"internalType": "string",
										"name": "name",
										"type": "string"
									},
									{
										"internalType": "string",
										"name": "description",
										"type": "string"
									},
									{
										"internalType": "uint8",
										"name": "duration",
										"type": "uint8"
									},
									{
										"internalType": "uint64",
										"name": "equivalency",
										"type": "uint64"
									}
								],
								"internalType": "struct DegreeCoin.Course[]",
								"name": "courses",
								"type": "tuple[]"
							}
						],
						"internalType": "struct DegreeCoin.University",
						"name": "",
						"type": "tuple"
					}
				],
				"stateMutability": "view",
				"type": "function"
			},
			{
				"inputs": [],
				"name": "getValidCourseTemplates",
				"outputs": [
					{
						"components": [
							{
								"internalType": "string",
								"name": "name",
								"type": "string"
							},
							{
								"internalType": "string",
								"name": "description",
								"type": "string"
							},
							{
								"internalType": "uint8",
								"name": "duration",
								"type": "uint8"
							}
						],
						"internalType": "struct DegreeCoin.CourseTemplate[]",
						"name": "_courseTemplates",
						"type": "tuple[]"
					}
				],
				"stateMutability": "view",
				"type": "function"
			},
			{
				"inputs": [
					{
						"internalType": "address",
						"name": "university",
						"type": "address"
					}
				],
				"name": "inviteUniversity",
				"outputs": [
					{
						"internalType": "address",
						"name": "",
						"type": "address"
					}
				],
				"stateMutability": "nonpayable",
				"type": "function"
			},
			{
				"inputs": [
					{
						"internalType": "uint64",
						"name": "courseTemplateID",
						"type": "uint64"
					}
				],
				"name": "isBlacklistedCourseTemplate",
				"outputs": [
					{
						"internalType": "bool",
						"name": "",
						"type": "bool"
					}
				],
				"stateMutability": "view",
				"type": "function"
			},
			{
				"inputs": [
					{
						"internalType": "address",
						"name": "university",
						"type": "address"
					}
				],
				"name": "isBlacklistedUniversity",
				"outputs": [
					{
						"internalType": "bool",
						"name": "",
						"type": "bool"
					}
				],
				"stateMutability": "view",
				"type": "function"
			},
			{
				"inputs": [],
				"name": "isInvitedUniversity",
				"outputs": [
					{
						"internalType": "bool",
						"name": "",
						"type": "bool"
					}
				],
				"stateMutability": "view",
				"type": "function"
			},
			{
				"inputs": [
					{
						"internalType": "address",
						"name": "studentAddr",
						"type": "address"
					},
					{
						"internalType": "uint64",
						"name": "courseID",
						"type": "uint64"
					},
					{
						"internalType": "uint16",
						"name": "cgpa",
						"type": "uint16"
					},
					{
						"internalType": "string",
						"name": "grade",
						"type": "string"
					},
					{
						"internalType": "string",
						"name": "comments",
						"type": "string"
					}
				],
				"name": "issueDegree",
				"outputs": [
					{
						"internalType": "bool",
						"name": "",
						"type": "bool"
					}
				],
				"stateMutability": "nonpayable",
				"type": "function"
			},
			{
				"inputs": [],
				"name": "issuedDegreeCount",
				"outputs": [
					{
						"internalType": "uint256",
						"name": "",
						"type": "uint256"
					}
				],
				"stateMutability": "view",
				"type": "function"
			},
			{
				"inputs": [],
				"name": "owner",
				"outputs": [
					{
						"internalType": "address",
						"name": "",
						"type": "address"
					}
				],
				"stateMutability": "view",
				"type": "function"
			},
			{
				"inputs": [
					{
						"internalType": "string",
						"name": "name",
						"type": "string"
					},
					{
						"internalType": "string",
						"name": "description",
						"type": "string"
					},
					{
						"internalType": "uint8",
						"name": "duration",
						"type": "uint8"
					},
					{
						"internalType": "uint64",
						"name": "equivalency",
						"type": "uint64"
					}
				],
				"name": "registerCourse",
				"outputs": [
					{
						"internalType": "string",
						"name": "",
						"type": "string"
					}
				],
				"stateMutability": "nonpayable",
				"type": "function"
			},
			{
				"inputs": [
					{
						"internalType": "string",
						"name": "_name",
						"type": "string"
					}
				],
				"name": "registerUniversity",
				"outputs": [
					{
						"internalType": "address",
						"name": "",
						"type": "address"
					}
				],
				"stateMutability": "nonpayable",
				"type": "function"
			},
			{
				"inputs": [
					{
						"internalType": "uint64",
						"name": "courseTemplateID",
						"type": "uint64"
					}
				],
				"name": "removeBlacklistedCourseTemplate",
				"outputs": [
					{
						"internalType": "uint64[]",
						"name": "",
						"type": "uint64[]"
					}
				],
				"stateMutability": "nonpayable",
				"type": "function"
			},
			{
				"inputs": [
					{
						"internalType": "address",
						"name": "blacklistedUniversity",
						"type": "address"
					}
				],
				"name": "removeBlacklistedUniversity",
				"outputs": [
					{
						"internalType": "address[]",
						"name": "",
						"type": "address[]"
					}
				],
				"stateMutability": "nonpayable",
				"type": "function"
			},
			{
				"inputs": [],
				"name": "studentCount",
				"outputs": [
					{
						"internalType": "uint256",
						"name": "",
						"type": "uint256"
					}
				],
				"stateMutability": "view",
				"type": "function"
			},
			{
				"inputs": [],
				"name": "universityCount",
				"outputs": [
					{
						"internalType": "uint256",
						"name": "",
						"type": "uint256"
					}
				],
				"stateMutability": "view",
				"type": "function"
			},
			{
				"inputs": [
					{
						"internalType": "string",
						"name": "_name",
						"type": "string"
					}
				],
				"name": "updateUniversityName",
				"outputs": [
					{
						"internalType": "string",
						"name": "",
						"type": "string"
					}
				],
				"stateMutability": "nonpayable",
				"type": "function"
			}
		],
		"devdoc": {
			"kind": "dev",
			"methods": {},
			"version": 1
		},
		"userdoc": {
			"kind": "user",
			"methods": {},
			"version": 1
		}
	},
	"version": 1
}