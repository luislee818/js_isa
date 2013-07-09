describe("Isa", function () {
	var isa,
		obj1,
		obj2,
		result,
		expected;

	beforeEach(function () {
		isa = new Isa();
	});

	describe("incise()", function () {
		it("should return object specified by the guide functions", function () {
			var obj = {
				p1: {
					p11: 123,
					p12: {
						p121: "foo",
						p122: "baz",
						p123: "test"
					},
					p13: {
						p131: "quxx"
					}
				},
				p2: {
					p21: "bar",
					p22: "nonsense"
				}
			},
			fnGuide1,
			fnGuide2,
			fnGuides = [],
			result,
			expected = {
				p1: {
					p11: 123,
					p12: {
						p122: "baz",
						p123: "test"
					}
				},
				p2: {
					p22: "nonsense"
				}
			}

			fnGuide1 = function (obj) {
				return {
					p1: {
						p11: obj.p1.p11,
						p12: {
							p122: obj.p1.p12.p122
						}
					}
				};
			};

			fnGuide2 = function (obj) {
				return {
					p1: {
						p12: {
							p123: obj.p1.p12.p123
						}
					},
					p2: {
						p22: obj.p2.p22
					}
				};
			};

			fnGuides.push(fnGuide1);
			fnGuides.push(fnGuide2);

			result = isa.incise(obj, fnGuides);

			expect(result).toEqual(expected);
		});
	});

	describe("intersect()", function () {
		describe("when intersecting with empty object", function () {
			it("should return empty object when intersecting with empty object", function () {
				obj1 = {};
				obj2 = { p1: 123 };
				expected = {};

				result = isa.intersect(obj1, obj2);
				expect(result).toEqual(expected);
			});
		});

		describe("when intersecting with object with single layer of depth", function () {
			it("should return object containing shared properties with values from obj1", function () {
				obj1 = {
					p1: 456,
					p2: "abc"
				};
				obj2 = {
					p1: 123,
					p3: []
				};
				expected = { p1: 456 };

				result = isa.intersect(obj1, obj2);

				expect(result).toEqual(expected);
			});
		});

		describe("when intersecting with object with multiple layers of depth", function () {
			it("should return object containing shared properties with values from obj1", function () {
				obj1 = {
					p1: 456,
					p2: "abc",
					p3: {
						p31: "john",
						p32: {
							p321: "doe",
							p322: 123
						},
						p33: {}
					}
				};
				obj2 = {
					p1: 123,
					p3: {
						p31: "john",
						p32: {
							p322: "doedoedoe"
						},
						p33: {
							p331: 123
						}
					},
					p4: []
				};
				expected = {
					p1: 456,
					p3: {
						p31: "john",
						p32: {
							p322: 123
						},
						p33: {}
					}
				};

				result = isa.intersect(obj1, obj2);

				expect(result).toEqual(expected);
			});
		});
	});

	describe("subtract()", function () {
		describe("when subtracting undefined", function () {
			it("should return original object", function () {
				obj1 = { p1: 123 };
				obj2 = undefined;
				expected = obj1;

				result = isa.subtract(obj1, obj2);
				expect(result).toEqual(expected);
			});
		});

		describe("when subtracting empty object", function () {
			it("should return original object", function () {
				obj1 = { p1: 123 };
				obj2 = {};
				expected = obj1;

				result = isa.subtract(obj1, obj2);
				expect(result).toEqual(expected);
			});
		});

		describe("when subtracting identical object", function () {
			it("should return undefined", function () {
				obj1 = { p1: 123 };
				obj2 = obj1;
				expected = undefined;

				result = isa.subtract(obj1, obj2);
				expect(result).toEqual(expected);
			});
		});

		describe("when subtracting non-empty object with one layer of depth", function () {
			it("should return an object subtracting properties from obj2", function () {
				obj1 = {
					p1: 123,
				p2: "abc"
				};
				obj2 = {
					p1: "foo"
				};
				expected = {
					p1: 123,
				p2: "abc"
				};

				result = isa.subtract(obj1, obj2);
				expect(result).toEqual(expected);
			});
		});

		describe("when subtracting non-empty object with one layer of depth and id property", function () {
			it("should return an object subtracting properties from obj2, leave id property", function () {
				obj1 = {
					id: 1,
				p1: 123,
				p2: "abc"
				};
				obj2 = {
					id: 1,
				p1: "foo"
				};
				expected = {
					id: 1,
				p1: 123,
				p2: "abc"
				};

				result = isa.subtract(obj1, obj2);
				expect(result).toEqual(expected);
			});
		});

		describe("when subtracting non-empty object with multiple layers of depth", function () {
			it("should return an object subtracting properties from obj2", function () {
				obj1 = {
					p1: 123,
				p2: "abc",
				p3: {
					p31: 123,
				p32: "foo",
				p33: "bar"
				}
				};
				obj2 = {
					p1: "foo",
				p3: {
					p31: 123,
				p34: "foo"
				}
				};
				expected = {
					p1: 123,
				p2: "abc",
				p3: {
					p32: "foo",
					p33: "bar"
				}
				};

				result = isa.subtract(obj1, obj2);
				expect(result).toEqual(expected);
			});
		});

		describe("when subtracting with object with property of array with identical values", function () {
			it("should return empty array", function () {
				obj1 = {
					p1: [
				123,
				456
				]
				};
				obj2 = {
					p1: [
				123,
				456
				]
				};
				expected = {
					p1: [
				]
				};

				result = isa.subtract(obj1, obj2);

				expect(result).toEqual(expected);
			});
		});

		describe("when subtracting with object with property of array of primitives", function () {
			it("should remove values in the array according to indexes", function () {
				obj1 = {
					p1: [
				123,
				456,
				123,
				789
				]
				};
				obj2 = {
					p1: [
				123,
				789
				]
				};
				expected = {
					p1: [
				456,
				123,
				789
				]
				};

				result = isa.subtract(obj1, obj2);

				expect(result).toEqual(expected);
			});
		});

		describe("when subtracting with object with property of array of objects with ids", function () {
			it("should remove properties from objects with matching ids in arrays", function () {
				obj1 = {
					p1: [
			{ id: 123, foo: "abc", bar: "quxx" },
				{ id: 456 },
				{ id: 789 }
			]
				};
				obj2 = {
					p1: [
			{ id: 123, foo: "def" },
				{ id: 789 }
			]
				};
				expected = {
					p1: [
			{ id: 123, foo:"abc", bar: "quxx" },
				{ id: 456 }
			]
				};

				result = isa.subtract(obj1, obj2);

				expect(result).toEqual(expected);
			});
		});

		describe("when subtracting with object with property of array of objects without ids", function () {
			it("should subtract objects with matching indexes from array", function () {
				obj1 = {
					p1: [
			{ foo: 123 },
				{ foo: 456 },
				{ foo: 789 }
			]
				};
				obj2 = {
					p1: [
			{ foo: 123 },
				{ foo: 789 }
			]
				};
				expected = {
					p1: [
			{ foo: 456 },
				{ foo: 789 }
			]
				};

				result = isa.subtract(obj1, obj2);

				expect(result).toEqual(expected);
			});
		});

		describe("when subtracting with complex test data", function () {
			it("should subtract correctly", function () {
				obj1 = {
					"surfaces": [
					{
						"elements": [
						{
							"frameId": "6f6364ab-d64c-4b19-ab6a-a338de7949fd",
							"height": 120.00,
							"id": "0e0bde0e-bec8-4e65-b4c4-63b76fa412e5"
						},
						{
							"frameId": "a97efd79-8f31-415b-864c-f0d1f9d44a3f",
							"height": 120.00,
							"id": "df6eb61a-cbd3-4635-aedb-ecbe87be7e3d"
						}
						],
						"frames": [
						{
							"id": "6f6364ab-d64c-4b19-ab6a-a338de7949fd"
						},
						{
							"id": "a97efd79-8f31-415b-864c-f0d1f9d44a3f"
						}
						]
					}
					]
				};
				obj2 = {
					"surfaces": [
					{
						"elements": [
						{
							"frameId": "6f6364ab-d64c-4b19-ab6a-a338de7949fd",
							"height": 120.00,
							"id": "0e0bde0e-bec8-4e65-b4c4-63b76fa412e5"
						}
						],
							"frames": [
							{
								"id": "6f6364ab-d64c-4b19-ab6a-a338de7949fd"
							}
						]
					}
					]
				};
				expected = {
					"surfaces": [
					{
						"elements": [
						{
							"frameId": "a97efd79-8f31-415b-864c-f0d1f9d44a3f",
							"height": 120.00,
							"id": "df6eb61a-cbd3-4635-aedb-ecbe87be7e3d"
						}
						],
							"frames": [
							{
								"id": "a97efd79-8f31-415b-864c-f0d1f9d44a3f"
							}
						]
					}
					]
				};

				result = isa.subtract(obj1, obj2);

				expect(result).toEqual(expected);
			});
		});

		describe("when subtracting with more complex test data", function () {
			it("should subtract correctly", function () {
				obj1 = {
					"fontSize": {
						"maximum": 36,
						"minimum": 8
					},
					"id": "6b6a25aa-3035-47ff-95e0-94417148a0d1",
					"productType": "Standard",
					"surfaces": [
					{
						"elements": [
						{
							"frameId": "6f6364ab-d64c-4b19-ab6a-a338de7949fd",
							"height": 120.00,
							"id": "0e0bde0e-bec8-4e65-b4c4-63b76fa412e5"
						},
						{
							"frameId": "a97efd79-8f31-415b-864c-f0d1f9d44a3f",
							"height": 120.00,
							"id": "df6eb61a-cbd3-4635-aedb-ecbe87be7e3d"
						}
						],
						"frames": [
						{
							"id": "6f6364ab-d64c-4b19-ab6a-a338de7949fd"
						},
						{
							"id": "a97efd79-8f31-415b-864c-f0d1f9d44a3f"
						}
						]
					}
					]
				};
				obj2 = {
					"surfaces": [
					{
						"elements": [
						{
							"frameId": "6f6364ab-d64c-4b19-ab6a-a338de7949fd",
							"height": 120.00,
							"id": "0e0bde0e-bec8-4e65-b4c4-63b76fa412e5"
						}
						],
						"frames": [
						{
							"id": "6f6364ab-d64c-4b19-ab6a-a338de7949fd"
						}
						]
					}
					]
				};
				expected = {
					"fontSize": {
						"maximum": 36,
						"minimum": 8
					},
					"id": "6b6a25aa-3035-47ff-95e0-94417148a0d1",
					"productType": "Standard",
					"surfaces": [
					{
						"elements": [
						{
							"frameId": "a97efd79-8f31-415b-864c-f0d1f9d44a3f",
							"height": 120.00,
							"id": "df6eb61a-cbd3-4635-aedb-ecbe87be7e3d"
						}
						],
						"frames": [
						{
							"id": "a97efd79-8f31-415b-864c-f0d1f9d44a3f"
						}
						]
					}
					]
				};

				result = isa.subtract(obj1, obj2);

				expect(result).toEqual(expected);
			});
		});
	});

	describe("add()", function () {
		describe("when adding empty object", function () {
			it("should return the original object", function () {
				obj1 = { p1: 123 };
				obj2 = {};
				expected = obj1;

				result = isa.add(obj1, obj2);
				expect(result).toEqual(expected);
			});
		});

		describe("when adding undefined", function () {
			it("should return the original object", function () {
				obj1 = { p1: 123 };
				obj2 = undefined;
				expected = obj1;

				result = isa.add(obj1, obj2);
				expect(result).toEqual(expected);
			});
		});

		describe("when adding non-empty object with one layer of depth", function () {
			it("should return an object adding properties from obj2", function () {
				obj1 = {
					p1: 123,
					p2: "abc"
				};
				obj2 = {
					p3: "foo"
				};
				expected = {
					p1: 123,
					p2: "abc",
					p3: "foo"
				};

				result = isa.add(obj1, obj2);
				expect(result).toEqual(expected);
			});
		});

		describe("when adding non-empty object with multiple layers of depth", function () {
			it("should return an object adding properties from obj2", function () {
				obj1 = {
					p1: 123,
					p2: "abc",
					p3: {
						p31: 123,
						p32: {
							p321: "foo"
						}
					}
				};
				obj2 = {
					p3: {
						p33: 456,
						p34: {
							p341: 123
						}
					},
					p4: "foo",
					p5: {
						p51: 123
					}
				};
				expected = {
					p1: 123,
					p2: "abc",
					p3: {
						p31: 123,
						p32: {
							p321: "foo"
						},
						p33: 456,
						p34: {
							p341: 123
						}
					},
					p4: "foo",
					p5: {
						p51: 123
					}
				};

				result = isa.add(obj1, obj2);
				expect(result).toEqual(expected);
			});
		});

		describe("when adding with object with property of array type", function () {
			it("should combine values in the array", function () {
				obj1 = {
					p1: [
						123,
						456
					]
				};
				obj2 = {
					p1: [
						123,
						789
					]
				};
				expected = {
					p1: [
						123,
						456,
						123,
						789
					]
				};

				result = isa.add(obj1, obj2);

				expect(result).toEqual(expected);
			});
		});

		describe("when adding with object with property of array type, elements being object with id properties", function () {
			it("should add properties from elements in second array with matching ids", function () {
				obj1 = {
					p1: [
						{
							id: 123,
							foo: "abc"
						},
						123,
						456
					]
				};
				obj2 = {
					p1: [
						123,
						789,
						{
							id: 123,
							bar: "def"
						},
						{
							id: 456,
							baz: "ghi"
						}
					]
				};
				expected = {
					p1: [
						{
							id: 123,
							foo: "abc",
							bar: "def"
						},
						123,
						456,
						123,
						789,
						{
							id: 456,
							baz: "ghi"
						}
					]
				};

				result = isa.add(obj1, obj2);

				expect(result).toEqual(expected);
			});
		});

		describe("when adding non-empty object with multiple layers of depth, two objects have same properties", function () {
			it("should return an object adding properties from obj2", function () {
				obj1 = {
					p1: 123,
					p2: "abc",
					p3: {
						p31: 123
					},
					p4: "foo"
				};
				obj2 = {
					p3: {
						p31: 456
					},
					p4: "bar"
				};
				expected = {
					p1: 123,
					p2: "abc",
					p3: {
						p31: 456
					},
					p4: "bar"
				};

				result = isa.add(obj1, obj2);
				expect(result).toEqual(expected);
			});
		});

		describe("when adding with complex test data", function () {
			it("should add correctly", function () {
				obj1 = {
					"surfaces": [
					{
						"elements": [
						{
							"frameId": "a97efd79-8f31-415b-864c-f0d1f9d44a3f",
							"height": 120.00,
							"id": "df6eb61a-cbd3-4635-aedb-ecbe87be7e3d"
						}
						],
							"frames": [
							{
								"id": "a97efd79-8f31-415b-864c-f0d1f9d44a3f"
							}
						]
					}
					]
				};
				obj2 = {
					"surfaces": [
					{
						"elements": [
						{
							"frameId": "6f6364ab-d64c-4b19-ab6a-a338de7949fd",
							"height": 120.00,
							"id": "0e0bde0e-bec8-4e65-b4c4-63b76fa412e5"
						}
						],
							"frames": [
							{
								"id": "6f6364ab-d64c-4b19-ab6a-a338de7949fd"
							}
						]
					}
					]
				};
				expected = {
					"surfaces": [
					{
						"elements": [
						{
							"frameId": "a97efd79-8f31-415b-864c-f0d1f9d44a3f",
							"height": 120.00,
							"id": "df6eb61a-cbd3-4635-aedb-ecbe87be7e3d"
						},
						{
							"frameId": "6f6364ab-d64c-4b19-ab6a-a338de7949fd",
							"height": 120.00,
							"id": "0e0bde0e-bec8-4e65-b4c4-63b76fa412e5"
						}
						],
						"frames": [
						{
							"id": "a97efd79-8f31-415b-864c-f0d1f9d44a3f"
						},
						{
							"id": "6f6364ab-d64c-4b19-ab6a-a338de7949fd"
						}
						]
					}
					]
				};

				result = isa.add(obj1, obj2);

				expect(result).toEqual(expected);
			});
		});

		describe("when adding with more complex test data", function () {
			it("should subtract correctly", function () {
				obj1 = {
					"fontSize": {
						"maximum": 36,
						"minimum": 8
					},
					"id": "6b6a25aa-3035-47ff-95e0-94417148a0d1",
					"productType": "Standard",
					"surfaces": [
					{
						"elements": [
						{
							"frameId": "a97efd79-8f31-415b-864c-f0d1f9d44a3f",
							"height": 120.00,
							"id": "df6eb61a-cbd3-4635-aedb-ecbe87be7e3d"
						}
						],
						"frames": [
						{
							"id": "a97efd79-8f31-415b-864c-f0d1f9d44a3f"
						}
						]
					}
					]
				};
				obj2 = {
					"surfaces": [
					{
						"elements": [
						{
							"frameId": "6f6364ab-d64c-4b19-ab6a-a338de7949fd",
							"height": 120.00,
							"id": "0e0bde0e-bec8-4e65-b4c4-63b76fa412e5"
						}
						],
						"frames": [
						{
							"id": "6f6364ab-d64c-4b19-ab6a-a338de7949fd"
						}
						]
					}
					]
				};
				expected = {
					"fontSize": {
						"maximum": 36,
						"minimum": 8
					},
					"id": "6b6a25aa-3035-47ff-95e0-94417148a0d1",
					"productType": "Standard",
					"surfaces": [
					{
						"elements": [
						{
							"frameId": "a97efd79-8f31-415b-864c-f0d1f9d44a3f",
							"height": 120.00,
							"id": "df6eb61a-cbd3-4635-aedb-ecbe87be7e3d"
						},
						{
							"frameId": "6f6364ab-d64c-4b19-ab6a-a338de7949fd",
							"height": 120.00,
							"id": "0e0bde0e-bec8-4e65-b4c4-63b76fa412e5"
						}
						],
						"frames": [
						{
							"id": "a97efd79-8f31-415b-864c-f0d1f9d44a3f"
						},
						{
							"id": "6f6364ab-d64c-4b19-ab6a-a338de7949fd"
						}
						]
					}
					]
				};

				result = isa.add(obj1, obj2);

				expect(result).toEqual(expected);
			});
		});
	});
});
