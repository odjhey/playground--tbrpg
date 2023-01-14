import { test } from "tap";
import { component } from "../../src/game/components";
import { flatten } from "../../src/game/components.utils";

test("simple component nesting", async (t) => {
  const chara = component({
    id: "chara",
    initState: {
      name: "john",
      mana: component({
        id: "mana",
        initState: 10,
        effects: {},
        signals: {
          "-": (cost: number, prevState) => {
            return prevState - cost;
          },
        },
      }),
      statuses: ["bleeding"],
    },
    effects: {},
    signals: {
      cleanse: (a: null, prevState) => {
        prevState.mana.receive("-", 4);
        return { ...prevState, statuses: [] };
      },
    },
  });

  t.match(flatten(chara.state()), { mana: "10", statuses: ["bleeding"] });
  chara.receive("cleanse", null);
  t.match(flatten(chara.state()), { mana: "6", statuses: [] });
});

test("simple component nesting - array", async (t) => {
  const makeStat = (statName: string, v: { value: number }) => {
    return component({
      id: statName,
      initState: v,
      effects: {},
      signals: {
        "+": (a: number, s) => {
          return { ...s, value: s.value + a };
        },
      },
    });
  };

  const chara = component({
    id: "chara",
    initState: {
      name: "john",
      stats: [makeStat("hp", { value: 928 }), makeStat("mp", { value: 129 })],
    },
    effects: {},
    signals: {
      heal: (amt: number, s) => {
        s.stats[0].receive("+", amt);
        return s;
      },
    },
  });

  t.match(flatten(chara.state()), {
    name: "john",
    stats: [{ value: 928 }, { value: 129 }],
  });

  // modify
  chara.receive("heal", 20);
  t.match(flatten(chara.state()), {
    name: "john",
    stats: [{ value: 948 }, { value: 129 }],
  });
});
