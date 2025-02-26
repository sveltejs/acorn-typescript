const TypeCastsSnapshot = {
	OneAsNumber: {
		type: 'Program',
		start: 0,
		end: 22,
		loc: {
			start: { line: 1, column: 0, index: 0 },
			end: { line: 1, column: 22, index: 22 }
		},
		body: [
			{
				type: 'VariableDeclaration',
				start: 0,
				end: 22,
				loc: {
					start: { line: 1, column: 0, index: 0 },
					end: { line: 1, column: 22, index: 22 }
				},
				declarations: [
					{
						type: 'VariableDeclarator',
						start: 4,
						end: 22,
						loc: {
							start: { line: 1, column: 4, index: 4 },
							end: { line: 1, column: 22, index: 22 }
						},
						id: {
							type: 'Identifier',
							start: 4,
							end: 8,
							loc: {
								start: { line: 1, column: 4, index: 4 },
								end: { line: 1, column: 8, index: 8 }
							},
							name: 'test'
						},
						init: {
							type: 'TSAsExpression',
							start: 11,
							end: 22,
							loc: {
								start: { line: 1, column: 11, index: 11 },
								end: { line: 1, column: 22, index: 22 }
							},
							expression: {
								type: 'Literal',
								start: 11,
								end: 12,
								loc: {
									start: { line: 1, column: 11, index: 11 },
									end: { line: 1, column: 12, index: 12 }
								},
								value: 1,
								raw: '1'
							},
							typeAnnotation: {
								type: 'TSNumberKeyword',
								start: 16,
								end: 22,
								loc: {
									start: { line: 1, column: 16, index: 16 },
									end: { line: 1, column: 22, index: 22 }
								}
							}
						}
					}
				],
				kind: 'let'
			}
		],
		sourceType: 'module'
	},
	OneCastNumber: {
		type: 'Program',
		start: 0,
		end: 20,
		loc: {
			start: {
				line: 1,
				column: 0,
				index: 0
			},
			end: {
				line: 1,
				column: 20,
				index: 20
			}
		},
		body: [
			{
				type: 'VariableDeclaration',
				start: 0,
				end: 20,
				loc: {
					start: {
						line: 1,
						column: 0,
						index: 0
					},
					end: {
						line: 1,
						column: 20,
						index: 20
					}
				},
				declarations: [
					{
						type: 'VariableDeclarator',
						start: 4,
						end: 20,
						loc: {
							start: {
								line: 1,
								column: 4,
								index: 4
							},
							end: {
								line: 1,
								column: 20,
								index: 20
							}
						},
						id: {
							type: 'Identifier',
							start: 4,
							end: 8,
							loc: {
								start: {
									line: 1,
									column: 4,
									index: 4
								},
								end: {
									line: 1,
									column: 8,
									index: 8
								}
							},
							name: 'test'
						},
						init: {
							type: 'TSTypeAssertion',
							start: 11,
							end: 20,
							loc: {
								start: {
									line: 1,
									column: 11,
									index: 11
								},
								end: {
									line: 1,
									column: 20,
									index: 20
								}
							},
							typeAnnotation: {
								type: 'TSNumberKeyword',
								start: 12,
								end: 18,
								loc: {
									start: {
										line: 1,
										column: 12,
										index: 12
									},
									end: {
										line: 1,
										column: 18,
										index: 18
									}
								}
							},
							expression: {
								type: 'Literal',
								start: 19,
								end: 20,
								loc: {
									start: {
										line: 1,
										column: 19,
										index: 19
									},
									end: {
										line: 1,
										column: 20,
										index: 20
									}
								},
								value: 1,
								raw: '1'
							}
						}
					}
				],
				kind: 'let'
			}
		],
		sourceType: 'module'
	},
	LabeledOneAsNumber: {
		type: 'Program',
		start: 0,
		end: 21,
		loc: {
			start: {
				line: 1,
				column: 0,
				index: 0
			},
			end: {
				line: 1,
				column: 21,
				index: 21
			}
		},
		body: [
			{
				type: 'LabeledStatement',
				start: 0,
				end: 21,
				loc: {
					start: {
						line: 1,
						column: 0,
						index: 0
					},
					end: {
						line: 1,
						column: 21,
						index: 21
					}
				},
				body: {
					type: 'ExpressionStatement',
					start: 3,
					end: 21,
					loc: {
						start: {
							line: 1,
							column: 3,
							index: 3
						},
						end: {
							line: 1,
							column: 21,
							index: 21
						}
					},
					expression: {
						type: 'AssignmentExpression',
						start: 3,
						end: 21,
						loc: {
							start: {
								line: 1,
								column: 3,
								index: 3
							},
							end: {
								line: 1,
								column: 21,
								index: 21
							}
						},
						operator: '=',
						left: {
							type: 'Identifier',
							start: 3,
							end: 7,
							loc: {
								start: {
									line: 1,
									column: 3,
									index: 3
								},
								end: {
									line: 1,
									column: 7,
									index: 7
								}
							},
							name: 'test'
						},
						right: {
							type: 'TSAsExpression',
							start: 10,
							end: 21,
							loc: {
								start: {
									line: 1,
									column: 10,
									index: 10
								},
								end: {
									line: 1,
									column: 21,
									index: 21
								}
							},
							expression: {
								type: 'Literal',
								start: 10,
								end: 11,
								loc: {
									start: {
										line: 1,
										column: 10,
										index: 10
									},
									end: {
										line: 1,
										column: 11,
										index: 11
									}
								},
								value: 1,
								raw: '1'
							},
							typeAnnotation: {
								type: 'TSNumberKeyword',
								start: 15,
								end: 21,
								loc: {
									start: {
										line: 1,
										column: 15,
										index: 15
									},
									end: {
										line: 1,
										column: 21,
										index: 21
									}
								}
							}
						}
					}
				},
				label: {
					type: 'Identifier',
					start: 0,
					end: 1,
					loc: {
						start: {
							line: 1,
							column: 0,
							index: 0
						},
						end: {
							line: 1,
							column: 1,
							index: 1
						}
					},
					name: '$'
				}
			}
		],
		sourceType: 'module'
	},
	LabeledOneCastNumber: {
		type: 'Program',
		start: 0,
		end: 19,
		loc: {
			start: {
				line: 1,
				column: 0,
				index: 0
			},
			end: {
				line: 1,
				column: 19,
				index: 19
			}
		},
		body: [
			{
				type: 'LabeledStatement',
				start: 0,
				end: 19,
				loc: {
					start: {
						line: 1,
						column: 0,
						index: 0
					},
					end: {
						line: 1,
						column: 19,
						index: 19
					}
				},
				body: {
					type: 'ExpressionStatement',
					start: 3,
					end: 19,
					loc: {
						start: {
							line: 1,
							column: 3,
							index: 3
						},
						end: {
							line: 1,
							column: 19,
							index: 19
						}
					},
					expression: {
						type: 'AssignmentExpression',
						start: 3,
						end: 19,
						loc: {
							start: {
								line: 1,
								column: 3,
								index: 3
							},
							end: {
								line: 1,
								column: 19,
								index: 19
							}
						},
						operator: '=',
						left: {
							type: 'Identifier',
							start: 3,
							end: 7,
							loc: {
								start: {
									line: 1,
									column: 3,
									index: 3
								},
								end: {
									line: 1,
									column: 7,
									index: 7
								}
							},
							name: 'test'
						},
						right: {
							type: 'TSTypeAssertion',
							start: 10,
							end: 19,
							loc: {
								start: {
									line: 1,
									column: 10,
									index: 10
								},
								end: {
									line: 1,
									column: 19,
									index: 19
								}
							},
							typeAnnotation: {
								type: 'TSNumberKeyword',
								start: 11,
								end: 17,
								loc: {
									start: {
										line: 1,
										column: 11,
										index: 11
									},
									end: {
										line: 1,
										column: 17,
										index: 17
									}
								}
							},
							expression: {
								type: 'Literal',
								start: 18,
								end: 19,
								loc: {
									start: {
										line: 1,
										column: 18,
										index: 18
									},
									end: {
										line: 1,
										column: 19,
										index: 19
									}
								},
								value: 1,
								raw: '1'
							}
						}
					}
				},
				label: {
					type: 'Identifier',
					start: 0,
					end: 1,
					loc: {
						start: {
							line: 1,
							column: 0,
							index: 0
						},
						end: {
							line: 1,
							column: 1,
							index: 1
						}
					},
					name: '$'
				}
			}
		],
		sourceType: 'module'
	},
	ExpressionOneAsNumber: {
		type: 'Program',
		start: 0,
		end: 16,
		loc: {
			start: {
				line: 1,
				column: 0,
				index: 0
			},
			end: {
				line: 1,
				column: 16,
				index: 16
			}
		},
		body: [
			{
				type: 'ExpressionStatement',
				start: 0,
				end: 16,
				loc: {
					start: {
						line: 1,
						column: 0,
						index: 0
					},
					end: {
						line: 1,
						column: 16,
						index: 16
					}
				},
				expression: {
					type: 'CallExpression',
					start: 0,
					end: 16,
					loc: {
						start: {
							line: 1,
							column: 0,
							index: 0
						},
						end: {
							line: 1,
							column: 16,
							index: 16
						}
					},
					callee: {
						type: 'Identifier',
						start: 0,
						end: 3,
						loc: {
							start: {
								line: 1,
								column: 0,
								index: 0
							},
							end: {
								line: 1,
								column: 3,
								index: 3
							}
						},
						name: 'foo'
					},
					arguments: [
						{
							type: 'TSAsExpression',
							start: 4,
							end: 15,
							loc: {
								start: {
									line: 1,
									column: 4,
									index: 4
								},
								end: {
									line: 1,
									column: 15,
									index: 15
								}
							},
							expression: {
								type: 'Literal',
								start: 4,
								end: 5,
								loc: {
									start: {
										line: 1,
										column: 4,
										index: 4
									},
									end: {
										line: 1,
										column: 5,
										index: 5
									}
								},
								value: 1,
								raw: '1'
							},
							typeAnnotation: {
								type: 'TSNumberKeyword',
								start: 9,
								end: 15,
								loc: {
									start: {
										line: 1,
										column: 9,
										index: 9
									},
									end: {
										line: 1,
										column: 15,
										index: 15
									}
								}
							}
						}
					],
					optional: false
				}
			}
		],
		sourceType: 'module'
	},
	ExpressionOneCastNumber: {
		type: 'Program',
		start: 0,
		end: 14,
		loc: {
			start: {
				line: 1,
				column: 0,
				index: 0
			},
			end: {
				line: 1,
				column: 14,
				index: 14
			}
		},
		body: [
			{
				type: 'ExpressionStatement',
				start: 0,
				end: 14,
				loc: {
					start: {
						line: 1,
						column: 0,
						index: 0
					},
					end: {
						line: 1,
						column: 14,
						index: 14
					}
				},
				expression: {
					type: 'CallExpression',
					start: 0,
					end: 14,
					loc: {
						start: {
							line: 1,
							column: 0,
							index: 0
						},
						end: {
							line: 1,
							column: 14,
							index: 14
						}
					},
					callee: {
						type: 'Identifier',
						start: 0,
						end: 3,
						loc: {
							start: {
								line: 1,
								column: 0,
								index: 0
							},
							end: {
								line: 1,
								column: 3,
								index: 3
							}
						},
						name: 'foo'
					},
					arguments: [
						{
							type: 'TSTypeAssertion',
							start: 4,
							end: 13,
							loc: {
								start: {
									line: 1,
									column: 4,
									index: 4
								},
								end: {
									line: 1,
									column: 13,
									index: 13
								}
							},
							typeAnnotation: {
								type: 'TSNumberKeyword',
								start: 5,
								end: 11,
								loc: {
									start: {
										line: 1,
										column: 5,
										index: 5
									},
									end: {
										line: 1,
										column: 11,
										index: 11
									}
								}
							},
							expression: {
								type: 'Literal',
								start: 12,
								end: 13,
								loc: {
									start: {
										line: 1,
										column: 12,
										index: 12
									},
									end: {
										line: 1,
										column: 13,
										index: 13
									}
								},
								value: 1,
								raw: '1'
							}
						}
					],
					optional: false
				}
			}
		],
		sourceType: 'module'
	}
};

export default TypeCastsSnapshot;
