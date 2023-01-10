import { test } from "tap";
import { system } from "../../src/game/system";

const ident = <T>(v: T): T => v;

test("normal time progression", async (t) => {
  const givenWorld = {
    time: 0,
    events: [],
    state: { value: 0 },
  };
  const s = system({ consumers: {}, onTickEnd: ident });

  const newWorld = s.tick(1, givenWorld);
  t.match(newWorld, { time: 1, events: [], state: { value: 0 } });

  const futureWorld = Array.from({ length: 13 }, (_, i) => i).reduce(
    (accu, item) => {
      return s.tick(1, accu);
    },
    newWorld
  );

  t.match(futureWorld, { time: 14, events: [], state: { value: 0 } });
});

test("normal time progression with simple event", async (t) => {
  const givenWorld = {
    time: 0,
    events: [
      { topic: "/base/value/add/1", props: "", value: 2 },
      { topic: "/base/value/add/1", props: "", value: 2 },
      { topic: "/base/value/add/1", props: "", value: 1 },
    ],
    state: { value: 0 },
  };
  const s = system<number, number>({
    consumers: {
      "/base/value/add/1": (event, prevState) => {
        return { value: event.value + prevState.value };
      },
    },
    onTickEnd: ident,
  });

  const newWorld = s.tick(1, givenWorld);
  t.match(newWorld, { time: 1, events: [], state: { value: 5 } });
});

test("simple event consumer", async (t) => {
  const givenWorld = {
    time: 0,
    events: [
      { topic: "/base/atk/exec/1", props: "l/char1/move1", value: { atk: 14 } },
    ],
    state: { value: { hp: 22 } },
  };
  const s = system<{ hp: number }, { atk: number }>({
    consumers: {
      "/base/atk/exec/1": (e, p) => {
        return {
          value: {
            hp: p.value.hp - e.value.atk,
          },
        };
      },
    },
    onTickEnd: ident,
  });

  const newWorld = s.tick(1, givenWorld);
  t.match(newWorld, { time: 1, events: [], state: { value: { hp: 8 } } });
});

test("simple on end checker", async (t) => {
  const givenWorld = {
    time: 0,
    events: [
      { topic: "/base/atk/exec/1", props: "l/char1/move1", value: { atk: 14 } },
    ],
    state: { value: { hp: 22, systemState: "green" as const } },
  };
  const s = system<
    { hp: number; systemState: "green" | "red" },
    { atk: number }
  >({
    consumers: {
      "/base/atk/exec/1": (e, p) => {
        p.value.hp = p.value.hp - e.value.atk;
        return p;
      },
    },
    onTickEnd: (state) => {
      state.value.systemState =
        state.value.hp < 0 ? "red" : state.value.systemState;
      return state;
    },
  });

  const newWorld = s.tick(1, givenWorld);
  t.match(newWorld, { time: 1, events: [], state: { value: { hp: 8 } } });
});
