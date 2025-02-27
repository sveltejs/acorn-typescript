const ArrowFunctionTypeSnapshot = {
	Issue39: {
		type: 'Program',
		start: 0,
		end: 93,
		loc: {
			start: {
				line: 1,
				column: 0,
				index: 0
			},
			end: {
				line: 1,
				column: 93,
				index: 93
			}
		},
		body: [
			{
				type: 'ExportNamedDeclaration',
				start: 0,
				end: 93,
				loc: {
					start: {
						line: 1,
						column: 0,
						index: 0
					},
					end: {
						line: 1,
						column: 93,
						index: 93
					}
				},
				exportKind: 'value',
				declaration: {
					type: 'VariableDeclaration',
					start: 7,
					end: 93,
					loc: {
						start: {
							line: 1,
							column: 7,
							index: 7
						},
						end: {
							line: 1,
							column: 93,
							index: 93
						}
					},
					declarations: [
						{
							type: 'VariableDeclarator',
							start: 13,
							end: 92,
							loc: {
								start: {
									line: 1,
									column: 13,
									index: 13
								},
								end: {
									line: 1,
									column: 92,
									index: 92
								}
							},
							id: {
								type: 'Identifier',
								start: 13,
								end: 29,
								loc: {
									start: {
										line: 1,
										column: 13,
										index: 13
									},
									end: {
										line: 1,
										column: 29,
										index: 29
									}
								},
								name: 'getPureFunctions'
							},
							init: {
								type: 'ArrowFunctionExpression',
								start: 32,
								end: 92,
								loc: {
									start: {
										line: 1,
										column: 32,
										index: 32
									},
									end: {
										line: 1,
										column: 92,
										index: 92
									}
								},
								returnType: {
									type: 'TSTypeAnnotation',
									start: 71,
									end: 86,
									loc: {
										start: {
											line: 1,
											column: 71,
											index: 71
										},
										end: {
											line: 1,
											column: 86,
											index: 86
										}
									},
									typeAnnotation: {
										type: 'TSTypeReference',
										start: 73,
										end: 86,
										loc: {
											start: {
												line: 1,
												column: 73,
												index: 73
											},
											end: {
												line: 1,
												column: 86,
												index: 86
											}
										},
										typeName: {
											type: 'Identifier',
											start: 73,
											end: 86,
											loc: {
												start: {
													line: 1,
													column: 73,
													index: 73
												},
												end: {
													line: 1,
													column: 86,
													index: 86
												}
											},
											name: 'PureFunctions'
										}
									}
								},
								id: null,
								expression: false,
								generator: false,
								async: false,
								params: [
									{
										type: 'ObjectPattern',
										start: 33,
										loc: {
											start: {
												line: 1,
												column: 33,
												index: 33
											},
											end: 70
										},
										properties: [
											{
												type: 'Property',
												start: 35,
												end: 44,
												loc: {
													start: {
														line: 1,
														column: 35,
														index: 35
													},
													end: {
														line: 1,
														column: 44,
														index: 44
													}
												},
												method: false,
												shorthand: true,
												computed: false,
												key: {
													type: 'Identifier',
													start: 35,
													end: 44,
													loc: {
														start: {
															line: 1,
															column: 35,
															index: 35
														},
														end: {
															line: 1,
															column: 44,
															index: 44
														}
													},
													name: 'treeshake'
												},
												kind: 'init',
												value: {
													type: 'Identifier',
													start: 35,
													end: 44,
													loc: {
														start: {
															line: 1,
															column: 35,
															index: 35
														},
														end: {
															line: 1,
															column: 44,
															index: 44
														}
													},
													name: 'treeshake'
												}
											}
										],
										typeAnnotation: {
											type: 'TSTypeAnnotation',
											start: 46,
											end: 70,
											loc: {
												start: {
													line: 1,
													column: 46,
													index: 46
												},
												end: {
													line: 1,
													column: 70,
													index: 70
												}
											},
											typeAnnotation: {
												type: 'TSTypeReference',
												start: 48,
												end: 70,
												loc: {
													start: {
														line: 1,
														column: 48,
														index: 48
													},
													end: {
														line: 1,
														column: 70,
														index: 70
													}
												},
												typeName: {
													type: 'Identifier',
													start: 48,
													end: 70,
													loc: {
														start: {
															line: 1,
															column: 48,
															index: 48
														},
														end: {
															line: 1,
															column: 70,
															index: 70
														}
													},
													name: 'NormalizedInputOptions'
												}
											}
										}
									}
								],
								body: {
									type: 'BlockStatement',
									start: 90,
									end: 92,
									loc: {
										start: {
											line: 1,
											column: 90,
											index: 90
										},
										end: {
											line: 1,
											column: 92,
											index: 92
										}
									},
									body: []
								}
							}
						}
					],
					kind: 'const'
				},
				specifiers: [],
				source: null
			}
		],
		sourceType: 'module'
	},
	Issue38: {
		type: 'Program',
		start: 0,
		end: 176,
		loc: {
			start: {
				line: 1,
				column: 0,
				index: 0
			},
			end: {
				line: 7,
				column: 0,
				index: 176
			}
		},
		body: [
			{
				type: 'VariableDeclaration',
				start: 1,
				end: 24,
				loc: {
					start: {
						line: 2,
						column: 0,
						index: 1
					},
					end: {
						line: 2,
						column: 23,
						index: 24
					}
				},
				declarations: [
					{
						type: 'VariableDeclarator',
						start: 5,
						end: 24,
						loc: {
							start: {
								line: 2,
								column: 4,
								index: 5
							},
							end: {
								line: 2,
								column: 23,
								index: 24
							}
						},
						id: {
							type: 'Identifier',
							start: 5,
							end: 20,
							loc: {
								start: {
									line: 2,
									column: 4,
									index: 5
								},
								end: {
									line: 2,
									column: 19,
									index: 20
								}
							},
							name: 'defaultHashSize'
						},
						init: {
							type: 'Literal',
							start: 23,
							end: 24,
							loc: {
								start: {
									line: 2,
									column: 22,
									index: 23
								},
								end: {
									line: 2,
									column: 23,
									index: 24
								}
							},
							value: 0,
							raw: '0'
						}
					}
				],
				kind: 'let'
			},
			{
				type: 'ExportNamedDeclaration',
				start: 25,
				end: 175,
				loc: {
					start: {
						line: 3,
						column: 0,
						index: 25
					},
					end: {
						line: 6,
						column: 1,
						index: 175
					}
				},
				exportKind: 'value',
				declaration: {
					type: 'VariableDeclaration',
					start: 32,
					end: 175,
					loc: {
						start: {
							line: 3,
							column: 7,
							index: 32
						},
						end: {
							line: 6,
							column: 1,
							index: 175
						}
					},
					declarations: [
						{
							type: 'VariableDeclarator',
							start: 38,
							end: 175,
							loc: {
								start: {
									line: 3,
									column: 13,
									index: 38
								},
								end: {
									line: 6,
									column: 1,
									index: 175
								}
							},
							id: {
								type: 'Identifier',
								start: 38,
								end: 65,
								loc: {
									start: {
										line: 3,
										column: 13,
										index: 38
									},
									end: {
										line: 3,
										column: 40,
										index: 65
									}
								},
								name: 'getHashPlaceholderGenerator'
							},
							init: {
								type: 'ArrowFunctionExpression',
								start: 68,
								end: 175,
								loc: {
									start: {
										line: 3,
										column: 43,
										index: 68
									},
									end: {
										line: 6,
										column: 1,
										index: 175
									}
								},
								returnType: {
									type: 'TSTypeAnnotation',
									start: 70,
									end: 75,
									loc: {
										start: {
											line: 3,
											column: 45,
											index: 70
										},
										end: {
											line: 3,
											column: 50,
											index: 75
										}
									},
									typeAnnotation: {
										type: 'TSAnyKeyword',
										start: 72,
										end: 75,
										loc: {
											start: {
												line: 3,
												column: 47,
												index: 72
											},
											end: {
												line: 3,
												column: 50,
												index: 75
											}
										}
									}
								},
								id: null,
								expression: false,
								generator: false,
								async: false,
								params: [],
								body: {
									type: 'BlockStatement',
									start: 79,
									end: 175,
									loc: {
										start: {
											line: 3,
											column: 54,
											index: 79
										},
										end: {
											line: 6,
											column: 1,
											index: 175
										}
									},
									body: [
										{
											type: 'VariableDeclaration',
											start: 83,
											end: 101,
											loc: {
												start: {
													line: 4,
													column: 2,
													index: 83
												},
												end: {
													line: 4,
													column: 20,
													index: 101
												}
											},
											declarations: [
												{
													type: 'VariableDeclarator',
													start: 87,
													end: 100,
													loc: {
														start: {
															line: 4,
															column: 6,
															index: 87
														},
														end: {
															line: 4,
															column: 19,
															index: 100
														}
													},
													id: {
														type: 'Identifier',
														start: 87,
														end: 96,
														loc: {
															start: {
																line: 4,
																column: 6,
																index: 87
															},
															end: {
																line: 4,
																column: 15,
																index: 96
															}
														},
														name: 'nextIndex'
													},
													init: {
														type: 'Literal',
														start: 99,
														end: 100,
														loc: {
															start: {
																line: 4,
																column: 18,
																index: 99
															},
															end: {
																line: 4,
																column: 19,
																index: 100
															}
														},
														value: 0,
														raw: '0'
													}
												}
											],
											kind: 'let'
										},
										{
											type: 'ReturnStatement',
											start: 104,
											end: 173,
											loc: {
												start: {
													line: 5,
													column: 2,
													index: 104
												},
												end: {
													line: 5,
													column: 71,
													index: 173
												}
											},
											argument: {
												type: 'ArrowFunctionExpression',
												start: 111,
												end: 173,
												loc: {
													start: {
														line: 5,
														column: 9,
														index: 111
													},
													end: {
														line: 5,
														column: 71,
														index: 173
													}
												},
												id: null,
												expression: false,
												generator: false,
												async: false,
												params: [
													{
														type: 'Identifier',
														start: 112,
														loc: {
															start: {
																line: 5,
																column: 10,
																index: 112
															},
															end: 130
														},
														name: 'optionName',
														typeAnnotation: {
															type: 'TSTypeAnnotation',
															start: 122,
															end: 130,
															loc: {
																start: {
																	line: 5,
																	column: 20,
																	index: 122
																},
																end: {
																	line: 5,
																	column: 28,
																	index: 130
																}
															},
															typeAnnotation: {
																type: 'TSStringKeyword',
																start: 124,
																end: 130,
																loc: {
																	start: {
																		line: 5,
																		column: 22,
																		index: 124
																	},
																	end: {
																		line: 5,
																		column: 28,
																		index: 130
																	}
																}
															}
														}
													},
													{
														type: 'AssignmentPattern',
														start: 132,
														end: 166,
														loc: {
															start: {
																line: 5,
																column: 30,
																index: 132
															},
															end: {
																line: 5,
																column: 64,
																index: 166
															}
														},
														left: {
															type: 'Identifier',
															start: 132,
															loc: {
																start: {
																	line: 5,
																	column: 30,
																	index: 132
																},
																end: 148
															},
															name: 'hashSize',
															typeAnnotation: {
																type: 'TSTypeAnnotation',
																start: 140,
																end: 148,
																loc: {
																	start: {
																		line: 5,
																		column: 38,
																		index: 140
																	},
																	end: {
																		line: 5,
																		column: 46,
																		index: 148
																	}
																},
																typeAnnotation: {
																	type: 'TSNumberKeyword',
																	start: 142,
																	end: 148,
																	loc: {
																		start: {
																			line: 5,
																			column: 40,
																			index: 142
																		},
																		end: {
																			line: 5,
																			column: 46,
																			index: 148
																		}
																	}
																}
															}
														},
														right: {
															type: 'Identifier',
															start: 151,
															end: 166,
															loc: {
																start: {
																	line: 5,
																	column: 49,
																	index: 151
																},
																end: {
																	line: 5,
																	column: 64,
																	index: 166
																}
															},
															name: 'defaultHashSize'
														}
													}
												],
												body: {
													type: 'BlockStatement',
													start: 171,
													end: 173,
													loc: {
														start: {
															line: 5,
															column: 69,
															index: 171
														},
														end: {
															line: 5,
															column: 71,
															index: 173
														}
													},
													body: []
												}
											}
										}
									]
								}
							}
						}
					],
					kind: 'const'
				},
				specifiers: [],
				source: null
			}
		],
		sourceType: 'module'
	},
	AssignmentPattern: {
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
				type: 'ExpressionStatement',
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
				expression: {
					type: 'ArrowFunctionExpression',
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
					returnType: {
						type: 'TSTypeAnnotation',
						start: 8,
						end: 14,
						loc: {
							start: {
								line: 1,
								column: 8,
								index: 8
							},
							end: {
								line: 1,
								column: 14,
								index: 14
							}
						},
						typeAnnotation: {
							type: 'TSVoidKeyword',
							start: 10,
							end: 14,
							loc: {
								start: {
									line: 1,
									column: 10,
									index: 10
								},
								end: {
									line: 1,
									column: 14,
									index: 14
								}
							}
						}
					},
					id: null,
					expression: false,
					generator: false,
					async: false,
					params: [
						{
							type: 'AssignmentPattern',
							start: 1,
							end: 7,
							loc: {
								start: {
									line: 1,
									column: 1,
									index: 1
								},
								end: {
									line: 1,
									column: 7,
									index: 7
								}
							},
							left: {
								type: 'Identifier',
								start: 1,
								end: 2,
								loc: {
									start: {
										line: 1,
										column: 1,
										index: 1
									},
									end: {
										line: 1,
										column: 2,
										index: 2
									}
								},
								name: 'x'
							},
							right: {
								type: 'Literal',
								start: 5,
								end: 7,
								loc: {
									start: {
										line: 1,
										column: 5,
										index: 5
									},
									end: {
										line: 1,
										column: 7,
										index: 7
									}
								},
								value: 42,
								raw: '42'
							}
						}
					],
					body: {
						type: 'BlockStatement',
						start: 18,
						end: 20,
						loc: {
							start: {
								line: 1,
								column: 18,
								index: 18
							},
							end: {
								line: 1,
								column: 20,
								index: 20
							}
						},
						body: []
					}
				}
			}
		],
		sourceType: 'module'
	},
	Issue32: {
		type: 'Program',
		start: 0,
		end: 57,
		loc: {
			start: {
				line: 1,
				column: 0,
				index: 0
			},
			end: {
				line: 2,
				column: 2,
				index: 57
			}
		},
		body: [
			{
				type: 'VariableDeclaration',
				start: 0,
				end: 57,
				loc: {
					start: {
						line: 1,
						column: 0,
						index: 0
					},
					end: {
						line: 2,
						column: 2,
						index: 57
					}
				},
				declarations: [
					{
						type: 'VariableDeclarator',
						start: 6,
						end: 56,
						loc: {
							start: {
								line: 1,
								column: 6,
								index: 6
							},
							end: {
								line: 2,
								column: 1,
								index: 56
							}
						},
						id: {
							type: 'Identifier',
							start: 6,
							end: 13,
							loc: {
								start: {
									line: 1,
									column: 6,
									index: 6
								},
								end: {
									line: 1,
									column: 13,
									index: 13
								}
							},
							name: 'testApp'
						},
						init: {
							type: 'ArrowFunctionExpression',
							start: 16,
							end: 56,
							loc: {
								start: {
									line: 1,
									column: 16,
									index: 16
								},
								end: {
									line: 2,
									column: 1,
									index: 56
								}
							},
							id: null,
							expression: false,
							generator: false,
							async: true,
							params: [
								{
									type: 'Identifier',
									start: 22,
									loc: {
										start: {
											line: 1,
											column: 22,
											index: 22
										},
										end: 33
									},
									name: 'app',
									typeAnnotation: {
										type: 'TSTypeAnnotation',
										start: 25,
										end: 33,
										loc: {
											start: {
												line: 1,
												column: 25,
												index: 25
											},
											end: {
												line: 1,
												column: 33,
												index: 33
											}
										},
										typeAnnotation: {
											type: 'TSStringKeyword',
											start: 27,
											end: 33,
											loc: {
												start: {
													line: 1,
													column: 27,
													index: 27
												},
												end: {
													line: 1,
													column: 33,
													index: 33
												}
											}
										}
									}
								},
								{
									type: 'Identifier',
									start: 35,
									loc: {
										start: {
											line: 1,
											column: 35,
											index: 35
										},
										end: 48
									},
									name: 'index',
									typeAnnotation: {
										type: 'TSTypeAnnotation',
										start: 40,
										end: 48,
										loc: {
											start: {
												line: 1,
												column: 40,
												index: 40
											},
											end: {
												line: 1,
												column: 48,
												index: 48
											}
										},
										typeAnnotation: {
											type: 'TSNumberKeyword',
											start: 42,
											end: 48,
											loc: {
												start: {
													line: 1,
													column: 42,
													index: 42
												},
												end: {
													line: 1,
													column: 48,
													index: 48
												}
											}
										}
									}
								}
							],
							body: {
								type: 'BlockStatement',
								start: 53,
								end: 56,
								loc: {
									start: {
										line: 1,
										column: 53,
										index: 53
									},
									end: {
										line: 2,
										column: 1,
										index: 56
									}
								},
								body: []
							}
						}
					}
				],
				kind: 'const'
			}
		],
		sourceType: 'module'
	},
	SimpleGeneric: {
		type: 'Program',
		start: 0,
		end: 43,
		loc: { start: { line: 1, column: 0, index: 0 }, end: { line: 3, column: 1, index: 43 } },
		body: [
			{
				type: 'VariableDeclaration',
				start: 0,
				end: 43,
				loc: { start: { line: 1, column: 0, index: 0 }, end: { line: 3, column: 1, index: 43 } },
				declarations: [
					{
						type: 'VariableDeclarator',
						start: 6,
						end: 43,
						loc: {
							start: { line: 1, column: 6, index: 6 },
							end: { line: 3, column: 1, index: 43 }
						},
						id: {
							type: 'Identifier',
							start: 6,
							end: 10,
							loc: {
								start: { line: 1, column: 6, index: 6 },
								end: { line: 1, column: 10, index: 10 }
							},
							name: 'test'
						},
						init: {
							type: 'ArrowFunctionExpression',
							start: 13,
							end: 43,
							loc: {
								start: { line: 1, column: 13, index: 13 },
								end: { line: 3, column: 1, index: 43 }
							},
							returnType: {
								type: 'TSTypeAnnotation',
								start: 22,
								end: 25,
								loc: {
									start: { line: 1, column: 22, index: 22 },
									end: { line: 1, column: 25, index: 25 }
								},
								typeAnnotation: {
									type: 'TSTypeReference',
									start: 24,
									end: 25,
									loc: {
										start: { line: 1, column: 24, index: 24 },
										end: { line: 1, column: 25, index: 25 }
									},
									typeName: {
										type: 'Identifier',
										start: 24,
										end: 25,
										loc: {
											start: { line: 1, column: 24, index: 24 },
											end: { line: 1, column: 25, index: 25 }
										},
										name: 'T'
									}
								}
							},
							id: null,
							expression: false,
							generator: false,
							async: false,
							params: [
								{
									type: 'Identifier',
									start: 17,
									loc: { start: { line: 1, column: 17, index: 17 }, end: 21 },
									name: 'a',
									typeAnnotation: {
										type: 'TSTypeAnnotation',
										start: 18,
										end: 21,
										loc: {
											start: { line: 1, column: 18, index: 18 },
											end: { line: 1, column: 21, index: 21 }
										},
										typeAnnotation: {
											type: 'TSTypeReference',
											start: 20,
											end: 21,
											loc: {
												start: { line: 1, column: 20, index: 20 },
												end: { line: 1, column: 21, index: 21 }
											},
											typeName: {
												type: 'Identifier',
												start: 20,
												end: 21,
												loc: {
													start: { line: 1, column: 20, index: 20 },
													end: { line: 1, column: 21, index: 21 }
												},
												name: 'T'
											}
										}
									}
								}
							],
							body: {
								type: 'BlockStatement',
								start: 29,
								end: 43,
								loc: {
									start: { line: 1, column: 29, index: 29 },
									end: { line: 3, column: 1, index: 43 }
								},
								body: [
									{
										type: 'ReturnStatement',
										start: 33,
										end: 41,
										loc: {
											start: { line: 2, column: 2, index: 33 },
											end: { line: 2, column: 10, index: 41 }
										},
										argument: {
											type: 'Identifier',
											start: 40,
											end: 41,
											loc: {
												start: { line: 2, column: 9, index: 40 },
												end: { line: 2, column: 10, index: 41 }
											},
											name: 'a'
										}
									}
								]
							},
							typeParameters: {
								type: 'TSTypeParameterDeclaration',
								start: 13,
								end: 16,
								loc: {
									start: { line: 1, column: 13, index: 13 },
									end: { line: 1, column: 16, index: 16 }
								},
								params: [
									{
										type: 'TSTypeParameter',
										start: 14,
										end: 15,
										loc: {
											start: { line: 1, column: 14, index: 14 },
											end: { line: 1, column: 15, index: 15 }
										},
										name: 'T'
									}
								]
							}
						}
					}
				],
				kind: 'const'
			}
		],
		sourceType: 'module'
	},
	GenericWithExtends: {
		type: 'Program',
		start: 0,
		end: 58,
		loc: { start: { line: 1, column: 0, index: 0 }, end: { line: 3, column: 1, index: 58 } },
		body: [
			{
				type: 'VariableDeclaration',
				start: 0,
				end: 58,
				loc: { start: { line: 1, column: 0, index: 0 }, end: { line: 3, column: 1, index: 58 } },
				declarations: [
					{
						type: 'VariableDeclarator',
						start: 6,
						end: 58,
						loc: {
							start: { line: 1, column: 6, index: 6 },
							end: { line: 3, column: 1, index: 58 }
						},
						id: {
							type: 'Identifier',
							start: 6,
							end: 10,
							loc: {
								start: { line: 1, column: 6, index: 6 },
								end: { line: 1, column: 10, index: 10 }
							},
							name: 'test'
						},
						init: {
							type: 'ArrowFunctionExpression',
							start: 13,
							end: 58,
							loc: {
								start: { line: 1, column: 13, index: 13 },
								end: { line: 3, column: 1, index: 58 }
							},
							returnType: {
								type: 'TSTypeAnnotation',
								start: 37,
								end: 40,
								loc: {
									start: { line: 1, column: 37, index: 37 },
									end: { line: 1, column: 40, index: 40 }
								},
								typeAnnotation: {
									type: 'TSTypeReference',
									start: 39,
									end: 40,
									loc: {
										start: { line: 1, column: 39, index: 39 },
										end: { line: 1, column: 40, index: 40 }
									},
									typeName: {
										type: 'Identifier',
										start: 39,
										end: 40,
										loc: {
											start: { line: 1, column: 39, index: 39 },
											end: { line: 1, column: 40, index: 40 }
										},
										name: 'T'
									}
								}
							},
							id: null,
							expression: false,
							generator: false,
							async: false,
							params: [
								{
									type: 'Identifier',
									start: 32,
									loc: { start: { line: 1, column: 32, index: 32 }, end: 36 },
									name: 'a',
									typeAnnotation: {
										type: 'TSTypeAnnotation',
										start: 33,
										end: 36,
										loc: {
											start: { line: 1, column: 33, index: 33 },
											end: { line: 1, column: 36, index: 36 }
										},
										typeAnnotation: {
											type: 'TSTypeReference',
											start: 35,
											end: 36,
											loc: {
												start: { line: 1, column: 35, index: 35 },
												end: { line: 1, column: 36, index: 36 }
											},
											typeName: {
												type: 'Identifier',
												start: 35,
												end: 36,
												loc: {
													start: { line: 1, column: 35, index: 35 },
													end: { line: 1, column: 36, index: 36 }
												},
												name: 'T'
											}
										}
									}
								}
							],
							body: {
								type: 'BlockStatement',
								start: 44,
								end: 58,
								loc: {
									start: { line: 1, column: 44, index: 44 },
									end: { line: 3, column: 1, index: 58 }
								},
								body: [
									{
										type: 'ReturnStatement',
										start: 48,
										end: 56,
										loc: {
											start: { line: 2, column: 2, index: 48 },
											end: { line: 2, column: 10, index: 56 }
										},
										argument: {
											type: 'Identifier',
											start: 55,
											end: 56,
											loc: {
												start: { line: 2, column: 9, index: 55 },
												end: { line: 2, column: 10, index: 56 }
											},
											name: 'a'
										}
									}
								]
							},
							typeParameters: {
								type: 'TSTypeParameterDeclaration',
								start: 13,
								end: 31,
								loc: {
									start: { line: 1, column: 13, index: 13 },
									end: { line: 1, column: 31, index: 31 }
								},
								params: [
									{
										type: 'TSTypeParameter',
										start: 14,
										end: 30,
										loc: {
											start: { line: 1, column: 14, index: 14 },
											end: { line: 1, column: 30, index: 30 }
										},
										name: 'T',
										constraint: {
											type: 'TSStringKeyword',
											start: 24,
											end: 30,
											loc: {
												start: { line: 1, column: 24, index: 24 },
												end: { line: 1, column: 30, index: 30 }
											}
										}
									}
								]
							}
						}
					}
				],
				kind: 'const'
			}
		],
		sourceType: 'module'
	},
	GenericWithConst: {
		type: 'Program',
		start: 0,
		end: 49,
		loc: { start: { line: 1, column: 0, index: 0 }, end: { line: 3, column: 1, index: 49 } },
		body: [
			{
				type: 'VariableDeclaration',
				start: 0,
				end: 49,
				loc: { start: { line: 1, column: 0, index: 0 }, end: { line: 3, column: 1, index: 49 } },
				declarations: [
					{
						type: 'VariableDeclarator',
						start: 6,
						end: 49,
						loc: {
							start: { line: 1, column: 6, index: 6 },
							end: { line: 3, column: 1, index: 49 }
						},
						id: {
							type: 'Identifier',
							start: 6,
							end: 10,
							loc: {
								start: { line: 1, column: 6, index: 6 },
								end: { line: 1, column: 10, index: 10 }
							},
							name: 'test'
						},
						init: {
							type: 'ArrowFunctionExpression',
							start: 13,
							end: 49,
							loc: {
								start: { line: 1, column: 13, index: 13 },
								end: { line: 3, column: 1, index: 49 }
							},
							returnType: {
								type: 'TSTypeAnnotation',
								start: 28,
								end: 31,
								loc: {
									start: { line: 1, column: 28, index: 28 },
									end: { line: 1, column: 31, index: 31 }
								},
								typeAnnotation: {
									type: 'TSTypeReference',
									start: 30,
									end: 31,
									loc: {
										start: { line: 1, column: 30, index: 30 },
										end: { line: 1, column: 31, index: 31 }
									},
									typeName: {
										type: 'Identifier',
										start: 30,
										end: 31,
										loc: {
											start: { line: 1, column: 30, index: 30 },
											end: { line: 1, column: 31, index: 31 }
										},
										name: 'T'
									}
								}
							},
							id: null,
							expression: false,
							generator: false,
							async: false,
							params: [
								{
									type: 'Identifier',
									start: 23,
									loc: { start: { line: 1, column: 23, index: 23 }, end: 27 },
									name: 'a',
									typeAnnotation: {
										type: 'TSTypeAnnotation',
										start: 24,
										end: 27,
										loc: {
											start: { line: 1, column: 24, index: 24 },
											end: { line: 1, column: 27, index: 27 }
										},
										typeAnnotation: {
											type: 'TSTypeReference',
											start: 26,
											end: 27,
											loc: {
												start: { line: 1, column: 26, index: 26 },
												end: { line: 1, column: 27, index: 27 }
											},
											typeName: {
												type: 'Identifier',
												start: 26,
												end: 27,
												loc: {
													start: { line: 1, column: 26, index: 26 },
													end: { line: 1, column: 27, index: 27 }
												},
												name: 'T'
											}
										}
									}
								}
							],
							body: {
								type: 'BlockStatement',
								start: 35,
								end: 49,
								loc: {
									start: { line: 1, column: 35, index: 35 },
									end: { line: 3, column: 1, index: 49 }
								},
								body: [
									{
										type: 'ReturnStatement',
										start: 39,
										end: 47,
										loc: {
											start: { line: 2, column: 2, index: 39 },
											end: { line: 2, column: 10, index: 47 }
										},
										argument: {
											type: 'Identifier',
											start: 46,
											end: 47,
											loc: {
												start: { line: 2, column: 9, index: 46 },
												end: { line: 2, column: 10, index: 47 }
											},
											name: 'a'
										}
									}
								]
							},
							typeParameters: {
								type: 'TSTypeParameterDeclaration',
								start: 13,
								end: 22,
								loc: {
									start: { line: 1, column: 13, index: 13 },
									end: { line: 1, column: 22, index: 22 }
								},
								params: [
									{
										type: 'TSTypeParameter',
										start: 14,
										end: 21,
										loc: {
											start: { line: 1, column: 14, index: 14 },
											end: { line: 1, column: 21, index: 21 }
										},
										const: true,
										name: 'T'
									}
								]
							}
						}
					}
				],
				kind: 'const'
			}
		],
		sourceType: 'module'
	},
	RestParameter: {
		type: 'Program',
		start: 0,
		end: 30,
		loc: { start: { line: 1, column: 0, index: 0 }, end: { line: 1, column: 30, index: 30 } },
		body: [
			{
				type: 'VariableDeclaration',
				start: 0,
				end: 30,
				loc: { start: { line: 1, column: 0, index: 0 }, end: { line: 1, column: 30, index: 30 } },
				declarations: [
					{
						type: 'VariableDeclarator',
						start: 6,
						end: 30,
						loc: {
							start: { line: 1, column: 6, index: 6 },
							end: { line: 1, column: 30, index: 30 }
						},
						id: {
							type: 'Identifier',
							start: 6,
							end: 7,
							loc: {
								start: { line: 1, column: 6, index: 6 },
								end: { line: 1, column: 7, index: 7 }
							},
							name: 'f'
						},
						init: {
							type: 'ArrowFunctionExpression',
							start: 10,
							end: 30,
							loc: {
								start: { line: 1, column: 10, index: 10 },
								end: { line: 1, column: 30, index: 30 }
							},
							id: null,
							expression: false,
							generator: false,
							async: false,
							params: [
								{
									type: 'RestElement',
									start: 11,
									loc: { start: { line: 1, column: 11, index: 11 }, end: 23 },
									argument: {
										type: 'Identifier',
										start: 14,
										end: 18,
										loc: {
											start: { line: 1, column: 14, index: 14 },
											end: { line: 1, column: 18, index: 18 }
										},
										name: 'args'
									},
									typeAnnotation: {
										type: 'TSTypeAnnotation',
										start: 18,
										end: 23,
										loc: {
											start: { line: 1, column: 18, index: 18 },
											end: { line: 1, column: 23, index: 23 }
										},
										typeAnnotation: {
											type: 'TSAnyKeyword',
											start: 20,
											end: 23,
											loc: {
												start: { line: 1, column: 20, index: 20 },
												end: { line: 1, column: 23, index: 23 }
											}
										}
									}
								}
							],
							body: {
								type: 'BlockStatement',
								start: 28,
								end: 30,
								loc: {
									start: { line: 1, column: 28, index: 28 },
									end: { line: 1, column: 30, index: 30 }
								},
								body: []
							}
						}
					}
				],
				kind: 'const'
			}
		],
		sourceType: 'module'
	},
	AsyncRestParameter: {
		type: 'Program',
		start: 0,
		end: 36,
		loc: { start: { line: 1, column: 0, index: 0 }, end: { line: 1, column: 36, index: 36 } },
		body: [
			{
				type: 'VariableDeclaration',
				start: 0,
				end: 36,
				loc: { start: { line: 1, column: 0, index: 0 }, end: { line: 1, column: 36, index: 36 } },
				declarations: [
					{
						type: 'VariableDeclarator',
						start: 6,
						end: 36,
						loc: {
							start: { line: 1, column: 6, index: 6 },
							end: { line: 1, column: 36, index: 36 }
						},
						id: {
							type: 'Identifier',
							start: 6,
							end: 7,
							loc: {
								start: { line: 1, column: 6, index: 6 },
								end: { line: 1, column: 7, index: 7 }
							},
							name: 'f'
						},
						init: {
							type: 'ArrowFunctionExpression',
							start: 10,
							end: 36,
							loc: {
								start: { line: 1, column: 10, index: 10 },
								end: { line: 1, column: 36, index: 36 }
							},
							id: null,
							expression: false,
							generator: false,
							async: true,
							params: [
								{
									type: 'RestElement',
									start: 17,
									end: 24,
									loc: {
										start: { line: 1, column: 17, index: 17 },
										end: { line: 1, column: 24, index: 24 }
									},
									argument: {
										type: 'Identifier',
										start: 20,
										end: 24,
										loc: {
											start: { line: 1, column: 20, index: 20 },
											end: { line: 1, column: 24, index: 24 }
										},
										name: 'args'
									},
									typeAnnotation: {
										type: 'TSTypeAnnotation',
										start: 24,
										end: 29,
										loc: {
											start: { line: 1, column: 24, index: 24 },
											end: { line: 1, column: 29, index: 29 }
										},
										typeAnnotation: {
											type: 'TSAnyKeyword',
											start: 26,
											end: 29,
											loc: {
												start: { line: 1, column: 26, index: 26 },
												end: { line: 1, column: 29, index: 29 }
											}
										}
									}
								}
							],
							body: {
								type: 'BlockStatement',
								start: 34,
								end: 36,
								loc: {
									start: { line: 1, column: 34, index: 34 },
									end: { line: 1, column: 36, index: 36 }
								},
								body: []
							}
						}
					}
				],
				kind: 'const'
			}
		],
		sourceType: 'module'
	},
	DestructuringDefaultValue: {
		type: 'Program',
		start: 0,
		end: 82,
		loc: { start: { line: 1, column: 0, index: 0 }, end: { line: 3, column: 1, index: 82 } },
		body: [
			{
				type: 'VariableDeclaration',
				start: 0,
				end: 82,
				loc: { start: { line: 1, column: 0, index: 0 }, end: { line: 3, column: 1, index: 82 } },
				declarations: [
					{
						type: 'VariableDeclarator',
						start: 6,
						end: 82,
						loc: {
							start: { line: 1, column: 6, index: 6 },
							end: { line: 3, column: 1, index: 82 }
						},
						id: {
							type: 'Identifier',
							start: 6,
							end: 15,
							loc: {
								start: { line: 1, column: 6, index: 6 },
								end: { line: 1, column: 15, index: 15 }
							},
							name: 'increment'
						},
						init: {
							type: 'ArrowFunctionExpression',
							start: 18,
							end: 82,
							loc: {
								start: { line: 1, column: 18, index: 18 },
								end: { line: 3, column: 1, index: 82 }
							},
							id: null,
							expression: false,
							generator: false,
							async: false,
							params: [
								{
									type: 'AssignmentPattern',
									start: 19,
									end: 62,
									loc: {
										start: { line: 1, column: 19, index: 19 },
										end: { line: 1, column: 62, index: 62 }
									},
									left: {
										type: 'ObjectPattern',
										start: 19,
										loc: { start: { line: 1, column: 19, index: 19 }, end: 57 },
										properties: [
											{
												type: 'Property',
												start: 21,
												end: 30,
												loc: {
													start: { line: 1, column: 21, index: 21 },
													end: { line: 1, column: 30, index: 30 }
												},
												method: false,
												shorthand: true,
												computed: false,
												key: {
													type: 'Identifier',
													start: 21,
													end: 30,
													loc: {
														start: { line: 1, column: 21, index: 21 },
														end: { line: 1, column: 30, index: 30 }
													},
													name: 'increment'
												},
												kind: 'init',
												value: {
													type: 'Identifier',
													start: 21,
													end: 30,
													loc: {
														start: { line: 1, column: 21, index: 21 },
														end: { line: 1, column: 30, index: 30 }
													},
													name: 'increment'
												}
											}
										],
										typeAnnotation: {
											type: 'TSTypeAnnotation',
											start: 33,
											end: 57,
											loc: {
												start: { line: 1, column: 33, index: 33 },
												end: { line: 1, column: 57, index: 57 }
											},
											typeAnnotation: {
												type: 'TSTypeLiteral',
												start: 35,
												end: 57,
												loc: {
													start: { line: 1, column: 35, index: 35 },
													end: { line: 1, column: 57, index: 57 }
												},
												members: [
													{
														type: 'TSPropertySignature',
														start: 37,
														end: 55,
														loc: {
															start: { line: 1, column: 37, index: 37 },
															end: { line: 1, column: 55, index: 55 }
														},
														computed: false,
														key: {
															type: 'Identifier',
															start: 37,
															end: 46,
															loc: {
																start: { line: 1, column: 37, index: 37 },
																end: { line: 1, column: 46, index: 46 }
															},
															name: 'increment'
														},
														optional: true,
														typeAnnotation: {
															type: 'TSTypeAnnotation',
															start: 47,
															end: 55,
															loc: {
																start: { line: 1, column: 47, index: 47 },
																end: { line: 1, column: 55, index: 55 }
															},
															typeAnnotation: {
																type: 'TSNumberKeyword',
																start: 49,
																end: 55,
																loc: {
																	start: { line: 1, column: 49, index: 49 },
																	end: { line: 1, column: 55, index: 55 }
																}
															}
														}
													}
												]
											}
										}
									},
									right: {
										type: 'ObjectExpression',
										start: 60,
										end: 62,
										loc: {
											start: { line: 1, column: 60, index: 60 },
											end: { line: 1, column: 62, index: 62 }
										},
										properties: []
									}
								}
							],
							body: {
								type: 'BlockStatement',
								start: 67,
								end: 82,
								loc: {
									start: { line: 1, column: 67, index: 67 },
									end: { line: 3, column: 1, index: 82 }
								},
								body: [
									{
										type: 'ExpressionStatement',
										start: 70,
										end: 80,
										loc: {
											start: { line: 2, column: 1, index: 70 },
											end: { line: 2, column: 11, index: 80 }
										},
										expression: {
											type: 'AssignmentExpression',
											start: 70,
											end: 80,
											loc: {
												start: { line: 2, column: 1, index: 70 },
												end: { line: 2, column: 11, index: 80 }
											},
											operator: '+=',
											left: {
												type: 'Identifier',
												start: 70,
												end: 75,
												loc: {
													start: { line: 2, column: 1, index: 70 },
													end: { line: 2, column: 6, index: 75 }
												},
												name: 'count'
											},
											right: {
												type: 'Literal',
												start: 79,
												end: 80,
												loc: {
													start: { line: 2, column: 10, index: 79 },
													end: { line: 2, column: 11, index: 80 }
												},
												value: 1,
												raw: '1'
											}
										}
									}
								]
							}
						}
					}
				],
				kind: 'const'
			}
		],
		sourceType: 'module'
	}
};

export default ArrowFunctionTypeSnapshot;
