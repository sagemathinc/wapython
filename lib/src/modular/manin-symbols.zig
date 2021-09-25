const std = @import("std");
const twoTerm = @import("./modsym-2term.zig");
const P1List = @import("./p1list.zig").P1List;

pub const Sign = enum(i4) {
    minus = -1,
    zero = 0,
    plus = 1,
};

pub fn ManinSymbols(comptime T: type) type {
    return struct {
        const Syms = @This();

        allocator: *std.mem.Allocator,
        N: usize,
        sign: Sign,
        P1: P1List(T),

        pub fn init(allocator: *std.mem.Allocator, N: usize, sign: Sign) !Syms {
            var P1 = try P1List(T).init(allocator, @intCast(T, N));
            return Syms{ .N = N, .sign = sign, .allocator = allocator, .P1 = P1 };
        }

        pub fn print(self: Syms) void {
            std.debug.print("ManinSymbols({},N={},sign={})\n", .{ T, self.N, self.sign });
        }

        pub fn deinit(self: *Syms) void {
            self.P1.deinit();
        }

        // Return distinct relations modulo the action of I for the given sign,
        // so for nonzero sign, these are:   x - sign*I*x = 0.
        pub fn relationsModI(
            self: Syms,
        ) !twoTerm.Relations {
            var rels = twoTerm.Relations.init(self.allocator);
            if (self.sign == Sign.zero) {
                // no relations
                return rels;
            }
            const s: twoTerm.Coeff = if (self.sign == Sign.plus) 1 else -1;
            const n = self.P1.count();
            var i: twoTerm.Index = 0;
            while (i < n) : (i += 1) {
                const j = @intCast(twoTerm.Index, try self.P1.applyI(i));
                const a = twoTerm.Element{ .coeff = 1, .index = i };
                const b = twoTerm.Element{ .coeff = -s, .index = j };
                const rel = twoTerm.Relation{ .a = a, .b = b };
                try rels.append(rel);
            }
            return rels;
        }

        // Return the distinct relations x + S*x = 0.
        // S is an involution of the basis elements. Can think of the relations
        // as x_i + x_{j=S(i)} = 0.  So the unique relations are of the form
        // x_i + x_j = 0 with i <= j.
        pub fn relationsModS(
            self: Syms,
        ) !twoTerm.Relations {
            var rels = twoTerm.Relations.init(self.allocator);
            const n = self.P1.count();
            var i: twoTerm.Index = 0;
            while (i < n) : (i += 1) {
                const j = @intCast(twoTerm.Index, try self.P1.applyS(i));
                if (j < i) {
                    // We will see this same relation again when i is j.
                    continue;
                }
                const a = twoTerm.Element{ .coeff = 1, .index = i };
                const b = twoTerm.Element{ .coeff = 1, .index = j };
                const rel = twoTerm.Relation{ .a = a, .b = b };
                try rels.append(rel);
            }
            return rels;
        }
    };
}

// fn relation_matrix(comptime T : type, syms, mod) xx {}

// Compute quotient of Manin symbols by the S relations.
//pub fn relationsModuloS(comptime T : type, N : usize) x

const test_allocator = std.testing.allocator;
const expect = std.testing.expect;

test "create a few spaces" {
    var M = try ManinSymbols(i32).init(test_allocator, 11, Sign.zero);
    defer M.deinit();
    M.print();
    var M2 = try ManinSymbols(i16).init(test_allocator, 15, Sign.plus);
    defer M2.deinit();
    M2.print();
    var M3 = try ManinSymbols(i64).init(test_allocator, 234446, Sign.minus);
    defer M3.deinit();
    M3.print();
}

test "compute relationsModI" {
    var M = try ManinSymbols(i32).init(test_allocator, 11, Sign.zero);
    defer M.deinit();
    var rels = try M.relationsModI();
    defer rels.deinit();
    // no relations since sign is zero
    try expect(rels.items.len == 0);
}

test "compute relationsModI with sign +" {
    var M = try ManinSymbols(i32).init(test_allocator, 11, Sign.plus);
    defer M.deinit();
    var rels = try M.relationsModI();
    defer rels.deinit();
    // many relations since sign is 1
    try expect(rels.items.len == 12);
    // std.debug.print("{s}\n", .{rels.items});
}

test "compute relationsModI with sign - and composite N" {
    var M = try ManinSymbols(i32).init(test_allocator, 12, Sign.minus);
    defer M.deinit();
    var rels = try M.relationsModI();
    defer rels.deinit();
    // many relations since sign is not 0.
    try expect(rels.items.len == 24);
}

test "compute relationsModS for N=7" {
    var M = try ManinSymbols(i16).init(test_allocator, 7, Sign.zero);
    defer M.deinit();
    var rels = try M.relationsModS();
    defer rels.deinit();
    // std.debug.print("\n{s}\n", .{rels.items});
    try expect(rels.items.len == 4);
}
