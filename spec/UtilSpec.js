describe("Util", function () {
	describe("arraysEqual()", function () {
		var arr1,
			arr2;

		it("should return true when two arrays have the same integers", function () {
			arr1 = [1, 2, 3, 4];
			arr2 = [1, 2, 3, 4];

			expect(Util.arraysEqual(arr1, arr2)).toBeTruthy();
		});

		it("should return true when two arrays have the same objects with same id properties", function () {
			arr1 = [
				{ id: 1 },
				{ id: 2 },
				{ id: 3 },
				{ id: 4 }
			];
			arr2 = [
				{ id: 1 },
				{ id: 2 },
				{ id: 3 },
				{ id: 4 }
			];

			expect(Util.arraysEqual(arr1, arr2)).toBeTruthy();
		});
	});
});
