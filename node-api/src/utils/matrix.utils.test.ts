import { isRectangular, computeStats, isDiagonal } from "./matrix.utils";

describe("matrix.utils", () => {
    describe("isRectangular", () => {
        it("should return true for valid rectangular matrix", () => {
            const m = [[1, 2], [3, 4]];
            expect(isRectangular(m)).toBe(true);
        });

        it("should return false for irregular matrix", () => {
            const m = [[1, 2], [3]];
            expect(isRectangular(m)).toBe(false);
        });
    });

    describe("computeStats", () => {
        it("should compute correct stats", () => {
            const values = [1, 2, 3, 4];
            const stats = computeStats(values);
            expect(stats).toEqual({
                min: 1,
                max: 4,
                sum: 10,
                avg: 2.5,
                count: 4
            });
        });
    });

    describe("isDiagonal", () => {
        it("should return true for diagonal matrix", () => {
            const m = [[5, 0], [0, 9]];
            expect(isDiagonal(m)).toBe(true);
        });

        it("should return false for non-diagonal matrix", () => {
            const m = [[5, 1], [0, 9]];
            expect(isDiagonal(m)).toBe(false);
        });

        it("should return false for non-square matrix", () => {
            const m = [[5, 0, 0], [0, 9, 0]];
            expect(isDiagonal(m)).toBe(false);
        });
    });
});
