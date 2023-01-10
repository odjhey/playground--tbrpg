import { test } from "tap";
import { system } from "../../src/game/system";

test("normal time progression", async (t) => {
  const givenWorld = {
    time: 0,
    events: [],
    state: { value: 0 },
  };
  const s = system({});

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
      { topic: "", props: "", value: 2 },
      { topic: "", props: "", value: 2 },
      { topic: "", props: "", value: 1 },
    ],
    state: { value: 0 },
  };
  const s = system({});

  const newWorld = s.tick(1, givenWorld);
  t.match(newWorld, { time: 1, events: [], state: { value: 5 } });
});
